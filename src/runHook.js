import { NodeVM } from 'vm2';

async function runHook(script, context) {
  const vm = new NodeVM({
    timeout: 5 * 1000,
    eval: false,
    wasm: false,
    allowAsync: true,
    strict: true,
    wrapper: 'none',
    require: {
      external: true,
      builtin: ['crypto', 'repl'],
      root: ['./'],
    },
    env: {},
    sandbox: {
      global: {
        context,
      },
    },
  });

  return vm.run(script, './vm.js');
}

process.on('uncaughtException', (err) => {
  console.error(err);
});

export default runHook;
