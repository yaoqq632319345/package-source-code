module.exports = {
  // 用来测试的环境，默认node
  testEnvironment: 'node',
  // .ts .tsx 文件使用ts-jest转换
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // 需要测试的文件
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$',
  // 需要跳过的目录
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  // 忽略文件后缀、
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
