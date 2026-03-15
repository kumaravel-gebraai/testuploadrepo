import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import preload from "vite-plugin-preload";
import jsxRuntimeTagger from "./src/vite-plugins/jsx-runtime-tagger";
import virtualOverride from "./src/vite-plugins/virtual-override";
import injectInspector from "./src/vite-plugins/inject-inspector";

/** Redirect /path to /path/ when path/index.html exists (MPA trailing-slash fix). */
function trailingSlashRedirect() {
  return {
    name: "trailing-slash-redirect",
    configureServer(server: { middlewares: { use: (fn: Function) => void } }) {
      server.middlewares.use(
        (
          req: { url?: string },
          res: { writeHead: (code: number, headers: Record<string, string>) => void; end: () => void },
          next: () => void,
        ) => {
          const url = req.url || "";
          const pathname = url.split("?")[0];
          if (pathname !== "/" && !pathname.endsWith("/") && !path.extname(pathname)) {
            const htmlPath = path.join(__dirname, pathname.slice(1), "index.html");
            if (fs.existsSync(htmlPath)) {
              res.writeHead(301, { Location: pathname + "/" });
              res.end();
              return;
            }
          }
          next();
        },
      );
    },
  };
}

/** Auto-discover HTML entry points for production build. */
function discoverHtmlEntries() {
  return {
    name: "discover-html-entries",
    config(_cfg: unknown, { command }: { command: string }) {
      if (command !== "build") return; // dev serves files from disk
      const entries: Record<string, string> = {};
      function walk(dir: string) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          if (["node_modules", "build", ".brand"].includes(entry.name))
            continue;
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(full);
          } else if (entry.name.endsWith(".html")) {
            const rel = path.relative(__dirname, full);
            const key =
              rel === "index.html"
                ? "main"
                : rel
                    .replace(/\/index\.html$/, "")
                    .replace(/\.html$/, "")
                    .replace(/\//g, "-");
            entries[key] = full;
          }
        }
      }
      walk(__dirname);
      return { build: { rollupOptions: { input: entries } } };
    },
  };
}

/** Inject CSS preload tags into all HTML files in the build output. */
function PreloadCssFromStylesheet() {
  return {
    name: "preload-css-dynamic",
    async closeBundle() {
      const fsp = await import("fs/promises");
      const pathMod = await import("path");

      const dist = "build";

      async function processDir(dir: string) {
        let entries: import("fs").Dirent[];
        try {
          entries = await fsp.readdir(dir, { withFileTypes: true });
        } catch {
          return;
        }
        for (const entry of entries) {
          const full = pathMod.join(dir, entry.name);
          if (entry.isDirectory()) {
            await processDir(full);
          } else if (entry.name.endsWith(".html")) {
            let html = await fsp.readFile(full, "utf-8");
            const cssLinks = [
              ...html.matchAll(
                /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css)["'][^>]*>/g,
              ),
            ];
            if (cssLinks.length === 0) continue;
            cssLinks.forEach((match) => {
              const href = match[1];
              const fullMatch = match[0];
              const preloadTag = `<link rel="preload" href="${href}" as="style">`;
              html = html.replace(fullMatch, `${preloadTag}\n${fullMatch}`);
            });
            await fsp.writeFile(full, html, "utf8");
            console.log(
              `[preload-css] Injected preload for ${cssLinks.length} CSS file(s) in ${pathMod.relative(dist, full)}`,
            );
          }
        }
      }

      await processDir(dist);
    },
  };
}

const isDev = process.env.NODE_ENV !== "production";

export default defineConfig({
  appType: "mpa",
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    cors: true,
    headers: {
      "X-Frame-Options": "ALLOWALL",
    },
    hmr: {
      protocol: "ws",
    },
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  plugins: [
    trailingSlashRedirect(),
    react(),
    ...(isDev ? [virtualOverride(), jsxRuntimeTagger(), injectInspector()] : []),
    tailwindcss(),
    discoverHtmlEntries(),
    preload({
      includeJs: true,
      includeCss: true,
      mode: "preload",
    }),
    PreloadCssFromStylesheet(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "build",
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "react-vendor";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "radix-vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons-vendor";
          }
          if (id.includes("node_modules/recharts")) {
            return "recharts-vendor";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
