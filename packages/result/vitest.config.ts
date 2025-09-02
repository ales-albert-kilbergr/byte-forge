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
      reporter: ['text-summary', 'text', 'html', 'lcov'],
      reportsDirectory: '../../coverage/packages/result',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/index.ts',
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/**/*.d.ts',
      ],
      thresholds: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  },
});