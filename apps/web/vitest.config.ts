import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'node' },
  resolve: {
    alias: {
      '@chased/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
});
