import { defineConfig, type Plugin, type ResolvedConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import AutoImport from "unplugin-auto-import/vite";
// import { readdyJsxRuntimeProxyPlugin } from "./vite.jsx-runtime-proxy";

function staticSeoPages(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "generate-static-seo-pages",
    apply: "build",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const index = bundle["index.html"];
        if (!index || index.type !== "asset") throw new Error("The client build has no HTML template for SEO pages.");

        // Include the rendered pages in Vite's output, including builds that
        // return the bundle to a publisher instead of writing it to disk.
        mkdirSync(config.cacheDir, { recursive: true });
        const staging = mkdtempSync(join(config.cacheDir, "seo-"));
        try {
          writeFileSync(join(staging, "index.html"), index.source);
          copyFileSync(join(config.publicDir, "sitemap.xml"), join(staging, "sitemap.xml"));
          execFileSync(process.execPath, [resolve(import.meta.dirname, "scripts/generate-static-pages.cjs"), "--out-dir", staging], { stdio: "inherit" });

          const pages = JSON.parse(readFileSync(join(staging, "prerender-manifest.json"), "utf8")) as Array<{ path: string }>;
          const documents = ["index.html", "404.html", "sitemap.xml", "prerender-manifest.json", ...pages.map(({ path }) => path === "/" ? "index.html" : `${path.slice(1)}/index.html`)];
          for (const fileName of new Set(documents)) {
            const source = readFileSync(join(staging, fileName));
            const existing = bundle[fileName];
            if (existing) {
              if (existing.type !== "asset") throw new Error(`A build chunk conflicts with SEO page: ${fileName}`);
              existing.source = source;
            } else {
              this.emitFile({ type: "asset", fileName, source });
            }
          }
          config.logger.info(`[SEO] Registered ${pages.length} routes in the build output.`);
        } finally {
          rmSync(staging, { recursive: true, force: true });
        }
      },
    },
  };
}

const base = process.env.BASE_PATH || "/";
const isPreview = process.env.IS_PREVIEW ? true : false;
//const proxyPlugins = isPreview ? [readdyJsxRuntimeProxyPlugin()] : [];
// https://vite.dev/config/
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
    __READDY_PROJECT_ID__: JSON.stringify(process.env.PROJECT_ID || ""),
    __READDY_VERSION_ID__: JSON.stringify(process.env.VERSION_ID || ""),
    __READDY_AI_DOMAIN__: JSON.stringify(process.env.READDY_AI_DOMAIN || ""),
  },
  plugins: [
    // ...proxyPlugins,
    react(),
    AutoImport({
      imports: [
        {
          react: [
            ["default", "React"],
            "useState",
            "useEffect",
            "useContext",
            "useReducer",
            "useCallback",
            "useMemo",
            "useRef",
            "useImperativeHandle",
            "useLayoutEffect",
            "useDebugValue",
            "useDeferredValue",
            "useId",
            "useInsertionEffect",
            "useSyncExternalStore",
            "useTransition",
            "startTransition",
            "lazy",
            "memo",
            "forwardRef",
            "createContext",
            "createElement",
            "cloneElement",
            "isValidElement",
          ],
        },
        {
          "react-router-dom": [
            "useNavigate",
            "useLocation",
            "useParams",
            "useSearchParams",
            "Link",
            "NavLink",
            "Navigate",
            "Outlet",
          ],
        },
        // React i18n
        {
          "react-i18next": ["useTranslation", "Trans"],
        },
      ],
      dts: true,
    }),
    // Register route-specific HTML with Vite's output for publication.
    staticSeoPages(),
  ],
  base,
  build: {
    sourcemap: false,
    outDir: 'out',
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
