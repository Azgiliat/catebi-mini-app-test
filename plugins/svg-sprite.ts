import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

import type { Plugin, ViteDevServer } from "vite";

interface SvgSpritePluginOptions {
  iconsDir?: string;
  outputName?: string;
}

const svgTagRegex = /<svg\s+([^>]*)>([\s\S]*?)<\/svg>/i;
const attrRegex = /([:\w-]+)(?:=("[^"]*"|'[^']*'))?/g;
const skippedSvgAttrs = new Set([
  "xmlns",
  "xmlns:xlink",
  "width",
  "height",
  "class",
  "style",
  "aria-hidden",
  "role",
]);

export function svgSpritePlugin(options: SvgSpritePluginOptions = {}): Plugin {
  const outputName = options.outputName ?? "sprite.svg";
  let root = process.cwd();
  let iconsDir = "";

  function configure(rootDir: string) {
    root = rootDir;
    iconsDir = resolve(root, options.iconsDir ?? "src/assets/icons");
  }

  return {
    name: "catebi-svg-sprite",

    configResolved(config) {
      configure(config.root);
    },

    buildStart() {
      getIconFiles(iconsDir).forEach((file) => this.addWatchFile(file));
    },

    configureServer(server) {
      server.middlewares.use(`/${outputName}`, (_, response) => {
        response.setHeader("Content-Type", "image/svg+xml");
        response.end(createSprite(iconsDir));
      });

      server.watcher.add(iconsDir);
    },

    handleHotUpdate(context) {
      if (
        !context.file.startsWith(iconsDir) ||
        extname(context.file) !== ".svg"
      ) {
        return;
      }

      reloadPage(context.server);
      return [];
    },

    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: outputName,
        source: createSprite(iconsDir),
      });
    },
  };
}

function getIconFiles(iconsDir: string) {
  if (!existsSync(iconsDir)) {
    return [];
  }

  return readdirSync(iconsDir)
    .filter((fileName) => extname(fileName) === ".svg")
    .sort()
    .map((fileName) => resolve(iconsDir, fileName));
}

function createSprite(iconsDir: string) {
  const symbols = getIconFiles(iconsDir).map((filePath) =>
    createSymbol(filePath),
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>`;
}

function createSymbol(filePath: string) {
  const svg = readFileSync(filePath, "utf8");
  const match = svg.match(svgTagRegex);

  if (!match) {
    throw new Error(`Invalid SVG icon: ${filePath}`);
  }

  const [, rawAttrs, content] = match;
  const attrs = parseAttrs(rawAttrs);
  const id = `icon-${basename(filePath, ".svg")}`;
  const viewBox = attrs.get("viewBox") ?? "0 0 24 24";
  const symbolAttrs = [...attrs]
    .filter(([name]) => !skippedSvgAttrs.has(name) && name !== "viewBox")
    .map(([name, value]) =>
      value === "" ? name : `${name}="${escapeAttr(value)}"`,
    )
    .join(" ");

  return `  <symbol id="${id}" viewBox="${escapeAttr(viewBox)}"${symbolAttrs ? ` ${symbolAttrs}` : ""}>${content.trim()}</symbol>`;
}

function parseAttrs(rawAttrs: string) {
  const attrs = new Map<string, string>();
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(rawAttrs))) {
    const [, name, quotedValue] = match;

    attrs.set(name, quotedValue ? quotedValue.slice(1, -1) : "");
  }

  return attrs;
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function reloadPage(server: ViteDevServer) {
  server.ws.send({ type: "full-reload" });
}
