import repl from 'repl';
import streamBuffers from 'stream-buffers';

// const streamBuffers = require('stream-buffers');
// const repl = require('repl');

async function getLastEvaluation() {
  return new Promise((resolve, reject) => {
    try {
      const reader = new streamBuffers.ReadableStreamBuffer();
      const writer = new streamBuffers.WritableStreamBuffer();
      let lastEval;

      repl.start({
        input: reader,
        output: writer,
        writer(output) {
          lastEval = output;
          return output;
        },
        replMode: repl.REPL_MODE_STRICT,
      }).on('exit', () => {
        resolve(lastEval);
      });

      reader.push(`const { createHmac } = require('crypto');

const { context } = global;

async function main() {
  return createHmac('sha256', '12345')
          .update('123hjgjh21g3')
          .digest('hex');
}

main();`);
      reader.stop();
    } catch (err) {
      reject(err);
    }
  });
}

console.log(await getLastEvaluation());
