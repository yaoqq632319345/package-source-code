# package

### 字段

- name: 项目名，如果需要发布 npm，需要唯一
- version: 项目版本
- description: 项目描述
- repository: 仓库信息
- main: commonjs 入口文件
- module: esmodule 入口文件
- types: 类型文件存放位置
- exports: 建立引入映射，根据不同的引入，返回不同的文件
- files: 作为包安装到其他项目时所需要的文件目录
- scripts: npm 脚本
- author: 作者
- license: 许可证
- devDependencies: 开发阶段的依赖
- engines: 运行环境依赖
- release: 发布分支
- config: 用于添加命令行的环境变量
- lint-staged: 代码校验
- husky: 提交代码前的钩子
