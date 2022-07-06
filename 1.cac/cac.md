## cac 文档阅读

#### 使用

```js
// examples/basic-usage.js
const cli = require('cac')();
// 注册命令行默认参数
cli.option('--type <type>', 'Choose a project type', {
  default: 'node',
});

const parsed = cli.parse();

console.log(JSON.stringify(parsed, null, 2));
```

##### 这个小示例中使用了两个方法

1. option

- option 这个方法直接找到源码中 src/Option.ts。 可以看到，对第一个参数进行了一些处理，包括 .\* 对象嵌套参数，no- 开头的否定标识，<> 和 [] 的必选参数

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
} else {
  this.isBoolean = true;
}
...
```

- parse

```ts
parse(argv = processArgs): ParsedArgv {
    this.rawArgs = argv


    let shouldParse = true

    if (shouldParse) {
      const parsed = this.mri(argv.slice(2)) // 解析processArgs 转为json
      this.setParsedInfo(parsed) // 合并参数到this.args 和 this.options上
    }

    const parsedArgv = { args: this.args, options: this.options }

    return parsedArgv
  }

```
