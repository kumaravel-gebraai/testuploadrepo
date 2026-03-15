/**
 * Babel plugin: inject data-source-file and data-source-line attributes
 * into every JSX element during development. This lets the visual editor
 * map a clicked DOM element back to its source code location.
 *
 * Loaded inline via @vitejs/plugin-react's babel option (dev only).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

const SKIP_COMPONENTS = new Set([
  "Fragment",
  "Suspense",
  "StrictMode",
  "Profiler",
]);

export default function jsxSourceLoc(babel: any) {
  const t = babel.types;

  return {
    visitor: {
      JSXOpeningElement(nodePath: any, state: any) {
        const { filename, cwd } = state;
        if (!filename || filename.includes("node_modules")) return;

        const node = nodePath.node;
        const line = node.loc?.start.line;
        if (!line) return;

        // Skip React built-ins (Fragment, etc.)
        if (node.name?.type === "JSXIdentifier" && SKIP_COMPONENTS.has(node.name.name)) {
          return;
        }

        // Don't double-annotate
        if (node.attributes.some((a: any) => a.type === "JSXAttribute" && a.name?.name === "data-source-file")) {
          return;
        }

        const relPath = cwd ? filename.replace(cwd + "/", "") : filename;

        node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier("data-source-file"), t.stringLiteral(relPath)),
          t.jsxAttribute(t.jsxIdentifier("data-source-line"), t.stringLiteral(String(line))),
        );
      },
    },
  };
}
