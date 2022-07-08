import { EventEmitter } from 'events';
class CAC extends EventEmitter {
  name: string;
  commands: any[];
  rawArgs: any[];
  args: any[];
  options: any;
  globalCommand: any;
  constructor(name) {
    super();
    this.name = name;
    this.commands = [];
    this.rawArgs = [];
    this.args = [];
    this.options = {};
    this.globalCommand = new GlobalCommand(this);
  }
  option(...args) {
    this.globalCommand.option(...args);
    return this;
  }
  parse() {
    return {
      args: [],
      options: {
        type: 't',
        '--': [],
      },
    };
  }
}

const cac = (name = '') => new CAC(name);
module.exports = cac;

class Command {}

class GlobalCommand extends Command {
  constructor(cli) {
    super();
  }
  option(rawName, desc, config) {}
}
