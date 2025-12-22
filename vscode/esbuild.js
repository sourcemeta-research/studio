const esbuild = require('esbuild');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const context = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: production ? false : 'inline',
    sourcesContent: false,
    platform: 'node',
    outfile: path.join(__dirname, '../build/vscode/extension.js'),
    external: ['vscode', '@sourcemeta/jsonschema'],
    logLevel: 'silent',
    plugins: [
      {
        name: 'esbuild-problem-matcher',
        setup(build) {
          build.onStart(() => {
            console.log('[watch] build started');
          });
          build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
              console.error(`✘ [ERROR] ${text}`);
              if (location) {
                console.error(`    ${location.file}:${location.line}:${location.column}:`);
              }
            });
            console.log('[watch] build finished');
          });
        }
      }
    ]
  });

  if (watch) {
    await context.watch();
  } else {
    await context.rebuild();
    await context.dispose();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
