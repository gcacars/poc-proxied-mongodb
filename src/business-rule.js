const { createHmac } = require('crypto');

const { context } = global;

async function main() {
  return createHmac('sha256', context.secret)
          .update(context.passportNumber)
          .digest('hex');
}

return main();
