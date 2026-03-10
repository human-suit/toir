import { execSync } from 'child_process';

function run(cmd: string) {
  console.log('\n--------------------------------');
  console.log('Running:', cmd);
  console.log('--------------------------------\n');

  execSync(cmd, { stdio: 'inherit' });
}

function main() {
  // prisma client
  run('npx prisma generate');

  // meta
  run('npx ts-node tools/generator/generate-meta.ts');

  // backend modules
  run('npx ts-node tools/generator/generateModule.ts');

  // react admin
  run('npx ts-node tools/generator/generate-admin.ts');
  run('npx ts-node tools/generator/generate-admin-lists.ts');
  run('npx ts-node tools/generator/generate-admin-crud.ts');
  run('npx ts-node tools/generator/generate-admin-index.ts');
}

main();
