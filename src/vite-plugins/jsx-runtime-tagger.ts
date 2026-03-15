/**
 * Vite plugin: runtime JSX source tagging via jsx-dev-runtime interception.
 *
 * Instead of a Babel transform that adds data-source-* attributes at build time,
 * this plugin replaces react/jsx-dev-runtime with a custom module that:
 * 1. Wraps jsxDEV() to inject refs on every element
 * 2. Stores source location (file:line:col) on DOM nodes via a Symbol
 * 3. Maintains a global sourceElementMap for the inspector to query
 *
 * This allows using @vitejs/plugin-react-swc (20x faster HMR) instead of
 * @vitejs/plugin-react with Babel.
 */

const SOURCE_SYMBOL_KEY = "__jsxSource__";

const runtimeCode = `
import * as React from "react";
import * as ReactJSXDevRuntime from "react/jsx-dev-runtime";

const _jsxDEV = ReactJSXDevRuntime.jsxDEV;
export const Fragment = ReactJSXDevRuntime.Fragment;

const SOURCE_KEY = Symbol.for("${SOURCE_SYMBOL_KEY}");

const sourceElementMap = new Map();
window.sourceElementMap = sourceElementMap;

function cleanFileName(fileName) {
  if (!fileName) return "";
  const prefix = __PROJECT_ROOT_PREFIX__;
  if (prefix && fileName.startsWith(prefix)) return fileName.slice(prefix.length);
  return fileName;
}

function getSourceKey(info) {
  return cleanFileName(info.fileName) + ":" + info.lineNumber + ":" + info.columnNumber;
}

function registerElement(node, info) {
  const key = getSourceKey(info);
  let refs = sourceElementMap.get(key);
  if (!refs) {
    refs = new Set();
    sourceElementMap.set(key, refs);
  }
  refs.add(new WeakRef(node));
}

function unregisterElement(node, info) {
  const key = getSourceKey(info);
  const refs = sourceElementMap.get(key);
  if (refs) {
    for (const ref of refs) {
      if (ref.deref() === node) {
        refs.delete(ref);
        break;
      }
    }
    if (refs.size === 0) {
      sourceElementMap.delete(key);
    }
  }
}

function mergeRef(originalRef, newRef) {
  return (node) => {
    newRef(node);
    if (typeof originalRef === "function") {
      originalRef(node);
    } else if (originalRef && typeof originalRef === "object") {
      originalRef.current = node;
    }
  };
}

function getTypeName(type) {
  if (typeof type === "string") return type;
  if (typeof type === "function") return type.displayName || type.name || "Unknown";
  if (typeof type === "object" && type !== null) {
    return type.displayName || type.render?.displayName || type.render?.name || "Unknown";
  }
  return "Unknown";
}

export function jsxDEV(type, props, key, isStatic, source, self) {
  if (!source?.fileName) {
    return _jsxDEV(type, props, key, isStatic, source, self);
  }

  const sourceInfo = {
    fileName: cleanFileName(source.fileName),
    lineNumber: source.lineNumber,
    columnNumber: source.columnNumber,
    displayName: typeof type === "string" ? type : getTypeName(type),
  };

  const tagRef = (node) => {
    if (!node) return;
    const existing = node[SOURCE_KEY];
    if (existing) {
      if (getSourceKey(existing) !== getSourceKey(sourceInfo)) {
        unregisterElement(node, existing);
        node[SOURCE_KEY] = sourceInfo;
        registerElement(node, sourceInfo);
      }
    } else {
      node[SOURCE_KEY] = sourceInfo;
      registerElement(node, sourceInfo);
    }
  };

  const enhancedProps = {
    ...props,
    ref: props?.ref ? mergeRef(props.ref, tagRef) : tagRef,
  };

  return _jsxDEV(type, enhancedProps, key, isStatic, source, self);
}
`;

export default function jsxRuntimeTagger() {
  return {
    name: "jsx-runtime-tagger",
    enforce: "pre" as const,

    resolveId(id: string, importer?: string) {
      // Intercept jsx-dev-runtime imports, but not our own re-import
      if (
        id === "react/jsx-dev-runtime" &&
        !importer?.includes("\0jsx-source")
      ) {
        return "\0jsx-source/jsx-dev-runtime";
      }
      return null;
    },

    load(id: string) {
      if (id === "\0jsx-source/jsx-dev-runtime") {
        return runtimeCode.replace(
          "__PROJECT_ROOT_PREFIX__",
          JSON.stringify(process.cwd() + "/"),
        );
      }
      return null;
    },
  };
}
