import runHook from './runHook.js';

async function main() {
  const result = await runHook(`const { ObjectID } = require('mongodb');

const { context } = global;

function main() {
  return new ObjectID(context.id);
}

return main();`, {
    id: '607100a17d0eaf3ff49d7a81',
  });

  console.log(result);
}

main();
