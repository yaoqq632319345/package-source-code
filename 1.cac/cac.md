# cac

### 使用

- 基本使用

```js
const cli = require('cac')();
// 注册命令行默认参数
cli.option('--type <type>', 'Choose a project type', {
  default: 'node',
});

const parsed = cli.parse();
console.log(JSON.stringify(parsed, null, 2));
```

![alt](./img/basic-usage.png)

- 还可以注册子命令

```js
const cli = require('cac')();

cli
  .command('rm <dir>', 'Remove a dir')
  .option('-r, --recursive', 'Remove recursively')
  .action((dir, options) => {
    console.log('remove ' + dir + (options.recursive ? ' recursively' : ''));
  });
cli.help();
cli.parse();
```

![alt](./img/sub-command.png)

### 查看源码

- 目录

```js
cac
├─ .github              // github 相关
├─ examples             // 示例
├─ scripts              //
├─ src                  // 项目开发目录
├─ .editorconfig        // 编辑器规范配置
├─ .gitattributes       // 文件规范
├─ .gitignore           // git 忽略文件
├─ .prettierrc          // prettier 格式化配置
├─ circle.yml           //
├─ index-compat.js      // 主入口, 兼容不同模块化
├─ jest.config.js       // jest 配置文件
├─ LICENSE              // 协议
├─ mod_test.ts          //
├─ mod.js               //
├─ mod.ts               //
├─ package.json         // 给npm看的文档
├─ README.md            // 给人看的文档
├─ rollup.config.js     // rollup 配置文件
├─ tsconfig.json        // ts 配置文件
└─ yarn.lock            // yarn 安装时 锁定包的版本
```

###### src/CAC.ts

```ts
class CAC extends EventEmitter {
  constructor(name = '') {
    this.globalCommand = new GlobalCommand(this);
  }
  parse() {}
}
```

- 初始化参数
- 创建全局命令 `this.globalCommand = new GlobalCommand(this);`
- 通过查看源码，可以发现 cac 实例只有一个核心方法 parse, 其他基本上都是调用 globalCommnd

###### src/Command.ts

```ts
class Command {
  constructor(
    public rawName: string,
    public description: string,
    public config: CommandConfig = {},
    public cli: CAC
  ) {
    this.options = [];
    this.aliasNames = [];
    this.name = removeBrackets(rawName);
    this.args = findAllBrackets(rawName);
    this.examples = [];
  }
}
```

- command 初始化也很简单，处理一下命令名和参数

###### src/Option.ts

```ts
...
rawName = rawName.replace(/\.\*/g, ''); // .xxx 对象嵌套参数

this.negated = false;
this.names = removeBrackets(rawName)
  .split(',') // 多个参数统一处理
  .map((v: string) => {
    let name = v.trim().replace(/^-{1,2}/, ''); // 除去 一到两个 -
    if (name.startsWith('no-')) { // 是否开关式参数
      this.negated = true;
      name = name.replace(/^no-/, '');
    }

    return camelcaseOptionName(name);
  })
  .sort((a, b) => (a.length > b.length ? 1 : -1));

this.name = this.names[this.names.length - 1];

if (this.negated && this.config.default == null) {
  this.config.default = true;
}

if (rawName.includes('<')) { // 尖括号必传
  this.required = true;
} else if (rawName.includes('[')) { // 方括号选传
  this.required = false;
} else { // 无参数代表boolean
  this.isBoolean = true;
}
...
```

- option 方法 就是注册一个 option 对象，处理一下参数形式和兼容，之后 push 到 command 里

### parse 方法

- 前面都是初始化相关

```ts
class CAC {
  ...
  parse(
    argv = processArgs,
    {
      // 这个参数可以看下面改为false的情况，即获取帮助和版本的时候不执行任何动作
      run = true,
    } = {}
  ): ParsedArgv {
    this.rawArgs = argv;
    let shouldParse = true; // 下面三个动作按优先执行

    // 遍历已注册的子命令，找到匹配的就执行
  for (const command of this.commands) {
      const parsed = this.mri(argv.slice(2), command)
      const commandName = parsed.args[0]
      if (command.isMatched(commandName)) {
        shouldParse = false
        const parsedInfo = {
          ...parsed,
          args: parsed.args.slice(1),
        }
        this.setParsedInfo(parsedInfo, command, commandName)
        this.emit(`command:${commandName}`, command)
      }
    }
    // 如果没有匹配上子命令，则执行默认命令
    if (shouldParse) {
      for (const command of this.commands) {
        if (command.name === '') {
          shouldParse = false
          const parsed = this.mri(argv.slice(2), command)
          this.setParsedInfo(parsed, command)
          this.emit(`command:!`, command)
        }
      }
    }
    // 如果都没有则仅保存一下参数
    if (shouldParse) {
      const parsed = this.mri(argv.slice(2))
      this.setParsedInfo(parsed)
    }
    // 帮助信息
    if (this.options.help && this.showHelpOnExit) {
      this.outputHelp()
      run = false
      this.unsetMatchedCommand()
    }
    // 版本信息
    if (
      this.options.version &&
      this.showVersionOnExit &&
      this.matchedCommandName == null
    ) {
      this.outputVersion()
      run = false
      this.unsetMatchedCommand()
    }

    const parsedArgv = { args: this.args, options: this.options }

    if (run) {
      this.runMatchedCommand()
    }

    if (!this.matchedCommand && this.args[0]) {
      this.emit('command:*')
    }

    return parsedArgv
  }
  ...
}
```

- 上面三个 emit 可以让你注册对应的事件执行回调
- 官方文档示例：

```js
// Listen to the `foo` command
cli.on('command:foo', () => {
  // Do something
});

// Listen to the default command
cli.on('command:!', () => {
  // Do something
});

// Listen to unknown commands
cli.on('command:*', () => {
  console.error('Invalid command: %s', cli.args.join(' '));
  process.exit(1);
});
```
