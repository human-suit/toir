import chokidar from 'chokidar';
import { execSync } from 'child_process';

function regenerate() {
  console.log('\n🚀 Prisma schema changed → regenerating\n');

  execSync('npm run generate', {
    stdio: 'inherit',
  });
}

const watcher = chokidar.watch('prisma/schema.prisma', {
  ignoreInitial: true,
});

watcher.on('change', regenerate);

console.log('👀 Watching prisma/schema.prisma...');
