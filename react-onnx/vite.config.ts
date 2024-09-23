//https://stackoverflow.com/questions/78095780/web-assembly-wasm-errors-in-a-vite-vue-app-using-realm-web-sdk
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs'
import path from 'path'

// Custom middleware to serve wasm files with the correct MIME type
const wasmMiddleware = () => {
  return {
    name: 'wasm-middleware',
    configureServer(server: { middlewares: { use: (arg0: (req: any, res: any, next: any) => void) => void; }; }) {
      server.middlewares.use((req, res, next) => {
        if (req.url.endsWith('.wasm')) {
          const wasmPath = path.join('node_modules/onnxruntime-web/dist/', path.basename(req.url));
          try
          {
            const wasmFile = fs.readFileSync(wasmPath);
            res.setHeader('Content-Type', 'application/wasm');
            res.end(wasmFile);
            return;
          }
        catch (error) {
          console.error(`Failed to read .wasm file at ${wasmPath}:`, error);
          res.statusCode = 500;
          res.end(`Failed to load .wasm file: ${(error as Error).message}`);
        }
         
        }
        next();
      });
    },
  };
};


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), 
    viteStaticCopy({
      targets: [
        { src: 'src/assets/*', dest: 'assets' }
      ]
    })
  ,wasmMiddleware()],
  server: {
    host: true, // Here
    strictPort: true,
    port: 2000,
    watch: { usePolling: true },
  }
})
