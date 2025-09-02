import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'result',
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: '../../coverage/packages/result',
    },
  },
});