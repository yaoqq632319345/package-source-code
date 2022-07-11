import { EventEmitter } from 'events';
import mri from 'mri';
class CAC extends EventEmitter {
  name: string;
  commands: any[];
  rawArgs: any[];
  args: any[];
  options: any;
  globalCommand: any;
  constructor(name = '') {
    super();
    this.name = name;
    this.commands = [];
    this.rawArgs = [];
    this.args = [];
    this.options = {};
    this.globalCommand = new GlobalCommand(this);
  }
  option(...args: any[]) {
    this.globalCommand.option(...args);
    return this;
  }
  parse(argv = process.argv) {
    console.log(argv);

    const parsed = mri(argv);
    console.log(parsed);

    return {
      args: [],
      options: {
        type: parsed.type,
        '--': [],
      },
    };
  }
}

const cac = (name = '') => new CAC(name);
module.exports = cac;

class Command {}

class GlobalCommand extends Command {
  cli: any;
  constructor(cli: any) {
    super();
    this.cli = cli;
  }
  option() {}
}
