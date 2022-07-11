const myCac = require('../CAC');
test('should ', () => {
  const cli = myCac();

  cli.option('--type <type>', 'Choose a project type', {
    default: 'node',
  });

  const parsed = cli.parse(['node', 'file', '--type', 't']);

  expect(parsed).toEqual({ args: [], options: { type: 't', '--': [] } });
});

test('should ', () => {
  const cli = myCac();

  cli.option('--aaa <aaa>', 'Choose a aaaa', {
    default: 'aaa',
  });

  const parsed = cli.parse(['node', 'file', '--aaa', 'bbb']);

  expect(parsed).toEqual({ args: [], options: { aaa: 'bbb', '--': [] } });
});
