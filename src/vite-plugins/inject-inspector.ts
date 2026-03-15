/**
 * Vite plugin: inject the inspector script into all HTML pages in dev mode.
 * Uses the transformIndexHtml hook to append a <script> tag.
 */

export default function injectInspector() {
  return {
    name: "inject-inspector",
    transformIndexHtml(html: string) {
      return html.replace(
        "</body>",
        `  <script type="module" src="/src/inspector/inspector.ts"></script>\n  </body>`,
      );
    },
  };
}
