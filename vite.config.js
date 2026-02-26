import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Serves root-level static assets during dev and copies them into the build output.
// - questions.csv: served via dev middleware + emitted at build time
// - favicon.ico: copied into public/ at startup so Vite's static file server
//   picks it up naturally (connect middleware runs too late for favicons)
const rootAssetsPlugin = {
  name: 'root-assets',
  buildStart() {
    const src = path.resolve(__dirname, 'favicon.ico');
    const dest = path.resolve(__dirname, 'public/favicon.ico');
    fs.mkdirSync(path.resolve(__dirname, 'public'), { recursive: true });
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  },
  configureServer(server) {
    server.middlewares.use('/questions.csv', (_req, res) => {
      const csv = fs.readFileSync(path.resolve(__dirname, 'questions.csv'), 'utf-8');
      res.setHeader('Content-Type', 'text/csv');
      res.end(csv);
    });
  },
  generateBundle() {
    const csv = fs.readFileSync(path.resolve(__dirname, 'questions.csv'), 'utf-8');
    this.emitFile({ type: 'asset', fileName: 'questions.csv', source: csv });
  },
};

export default defineConfig({
  plugins: [react(), rootAssetsPlugin],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    outDir: 'dist',
  },
});
