import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'node',
  outDir: 'dist',
  clean: true,
  bundle: true,
  external: ['@prisma/client', '@carbonwise/database', 'firebase-admin', '@google-cloud/storage'],
  noExternal: ['@carbonwise/shared'],
});
