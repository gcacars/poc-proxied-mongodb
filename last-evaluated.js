import vm from 'vm';
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

      const runner = repl.start({
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

      runner.context = vm.createContext({
        global: { context: { id: '607100a17d0eaf3ff49d7a81' } },
      });

      reader.push(`const { context } = global;

async function main() {
  return context.id;
}

main();`);
      reader.stop();
    } catch (err) {
      reject(err);
    }
  });
}

console.log(await getLastEvaluation());
