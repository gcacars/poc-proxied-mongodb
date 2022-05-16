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
      // root: ['./node_modules/mongodb'],
      // context: 'sandbox',
    },
    env: {},
    sandbox: {
      global: {
        context,
      },
    },
  });

  return vm.run(script);
}

process.on('uncaughtException', (err) => {
  console.error(err);
});

export default runHook;
