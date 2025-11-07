import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "https://api.seekkrr.com",
                changeOrigin: true,
                secure: true,
            },
        },
        host: true,
        port: 3000,
    },
    build: {
        outDir: "dist",
        sourcemap: false,
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                },
                entryFileNames: "js/[name]-[hash].js",
                chunkFileNames: "js/[name]-[hash].js",
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split(".");
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|gif|svg/.test(ext)) {
                        return "images/[name]-[hash][extname]";
                    } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
                        return "fonts/[name]-[hash][extname]";
                    } else if (ext === "css") {
                        return "css/[name]-[hash][extname]";
                    }
                    return "[name]-[hash][extname]";
                },
            },
        },
        target: "ES2020",
        cssCodeSplit: true,
        reportCompressedSize: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@styles": path.resolve(__dirname, "./src/styles"),
        },
    },
    optimizeDeps: {
        include: ["react", "react-dom"],
    },
});
