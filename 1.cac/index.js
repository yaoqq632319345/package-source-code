const cli = require('cac')();
cli.on('command:*', () => {
  console.log(123);
});
cli
  // Simply omit the command name, just brackets
  .command('rm <dir>', 'remove')
  .action((files, options) => {
    console.log(files);
    console.log(options);
  });
cli.help();
cli.parse();
