import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// 手动定义 __dirname  解决cypress 无法导入模块的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    emptyOutDir: false, // 不清空输出目录，保留 tsc 生成的类型文件
    terserOptions: {
      compress: {
        // 生产环境时移除console.log()
        drop_console: true,
        drop_debugger: true,
      },
    },
    //   关闭文件计算
    reportCompressedSize: false,
    sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["lit", "lit/decorators.js", "mitt"],
      output: {
        globals: {
          lit: "Lit",
          mitt: "mitt",
        },
      },
    },
    outDir: "dist",
  },
});
