import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/scripts/*.ts',
  ],
  format: { esm: { target: ['esnext'], }, },
  outDir: 'dist'
});