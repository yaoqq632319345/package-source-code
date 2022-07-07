/* // 基本使用
const cli = require('cac')();

cli.option('--type <type>', 'Choose a project type', {
  default: 'node',
});

const parsed = cli.parse();

console.log(JSON.stringify(parsed, null, 2)); */

// 注册子命令
const cli = require('cac')();

cli
  .command('rm <dir>', 'Remove a dir')
  .option('-r, --recursive', 'Remove recursively')
  .action((dir, options) => {
    console.log('remove ' + dir + (options.recursive ? ' recursively' : ''));
  });

cli.help();

cli.parse();
