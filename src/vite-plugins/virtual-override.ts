/**
 * Vite plugin: virtual file overrides for instant visual editor updates.
 *
 * Instead of writing files to disk and waiting for Vite's file watcher to
 * detect the change, the Express server sends updated file content over
 * Vite's native WebSocket. This plugin intercepts the message, stores the
 * override in-memory, invalidates the module graph, and triggers HMR —
 * cutting edit-to-preview latency from ~85ms to ~20-50ms.
 *
 * Protocol:
 *   Client sends: { type: "custom", event: "gebra:override", data: { file, content } }
 *   Plugin sends back: { type: "custom", event: "gebra:override-ack", data: { file, ok } }
 *
 * Disk writes happen async on the server side — disk is always source of truth,
 * virtual overrides are just ahead of it temporarily.
 */

import type { Plugin, ViteDevServer, ModuleNode } from "vite";
import path from "node:path";

export default function virtualOverride(): Plugin {
  let server: ViteDevServer;

  /** file path (relative to project root, e.g. "src/components/sections/Hero.tsx") → content */
  const overrides = new Map<string, string>();

  return {
    name: "virtual-override",
    enforce: "pre",

    configureServer(srv) {
      server = srv;

      srv.ws.on("gebra:override", (data: { file: string; content: string }, client) => {
        const { file, content } = data;
        if (!file || content == null) {
          client.send("gebra:override-ack", { file, ok: false, error: "missing file or content" });
          return;
        }

        overrides.set(file, content);

        // Resolve the module in Vite's module graph and invalidate it
        const resolved = path.resolve(srv.config.root, file);
        const mod = srv.moduleGraph.getModuleById(resolved);
        if (mod) {
          srv.moduleGraph.invalidateModule(mod);
          // Trigger HMR update for this module
          srv.ws.send({
            type: "update",
            updates: [{
              type: mod.type === "css" ? "css-update" : "js-update",
              path: mod.url,
              acceptedPath: mod.url,
              timestamp: Date.now(),
            }],
          });
        } else {
          // Module not yet in graph — try by URL
          const url = "/" + file;
          const urlMod = srv.moduleGraph.getModulesByFile(resolved);
          if (urlMod) {
            for (const m of urlMod) {
              srv.moduleGraph.invalidateModule(m);
              srv.ws.send({
                type: "update",
                updates: [{
                  type: m.type === "css" ? "css-update" : "js-update",
                  path: m.url,
                  acceptedPath: m.url,
                  timestamp: Date.now(),
                }],
              });
            }
          }
        }

        client.send("gebra:override-ack", { file, ok: true });
      });

      // Allow clearing overrides (e.g., after disk flush)
      srv.ws.on("gebra:clear-override", (data: { file: string }, client) => {
        overrides.delete(data.file);
        client.send("gebra:clear-override-ack", { file: data.file, ok: true });
      });

      srv.ws.on("gebra:clear-all-overrides", (_data: unknown, client) => {
        overrides.clear();
        client.send("gebra:clear-all-overrides-ack", { ok: true });
      });
    },

    // Intercept file loading — serve override content if available
    load(id) {
      if (!server) return null;

      // id is absolute path — resolve to relative
      const root = server.config.root;
      const abs = id.startsWith("/") ? id : path.resolve(root, id);
      const rel = path.relative(root, abs);

      const override = overrides.get(rel);
      if (override !== undefined) {
        return override;
      }
      return null;
    },
  };
}
