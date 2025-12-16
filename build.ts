
import { build } from "bun";

await build({
    banner: "#!/usr/bin/env node",
    entrypoints: ['./src/index.ts'],
    naming: 'index.js',
    sourcemap: 'none',
    outdir: 'dist',
    target: 'node',
    minify: true,
    format: 'esm'
});
