import chokidar from 'chokidar';
import { execSync } from 'child_process';

function regenerate() {
  console.log('\n🚀 Prisma schema changed → regenerating...\n');

  try {
    console.log('📦 Updating database...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    console.log('⚙️ Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log('🏗 Generating backend + frontend...');
    execSync('npm run generate', { stdio: 'inherit' });

    console.log('\n✅ Regeneration complete\n');
  } catch (err) {
    console.error('❌ Generation failed:', err);
  }
}

const watcher = chokidar.watch('prisma/schema.prisma', {
  ignoreInitial: true,
  usePolling: true,
  interval: 1000
});

watcher.on('change', (path) => {
  console.log('📄 File changed:', path);
  regenerate();
});

console.log('👀 Watching prisma/schema.prisma...');