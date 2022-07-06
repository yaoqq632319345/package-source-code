const cli = require('cac')();

cli
  // Simply omit the command name, just brackets
  .command('rm <dir>', 'remove')
  .action((files, options) => {
    console.log(files);
    console.log(options);
  });

cli.parse();
