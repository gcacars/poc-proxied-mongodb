import runHook from './src/runHook.js';

async function main() {
  const result = await runHook(`const { createHmac } = require('crypto');

const { context } = global;

async function main() {
  return createHmac('sha256', context.secret)
          .update(context.passportNumber)
          .digest('hex');
}

return main();`, {
    secret: '607100a17d0eaf3ff49d7a81',
    passportNumber: 'ABA9875413',
  });

  console.log(result);
}

main();
