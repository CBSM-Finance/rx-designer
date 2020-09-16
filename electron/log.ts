import * as chalk from 'chalk';
const logger = console.log;

const ctx = new chalk.Instance({ level: 3 });
const toString = (args: any[]) => args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg.toString());
type logLevels = 'error' | 'notify' | 'warn';
export const log: { [level in logLevels]: (...args: any[]) => void } = {
  error: (...args) => logger(ctx.red(...toString(args))),
  notify: (...args) => logger(ctx.hex('#0010e0').bgHex('#8899bb')(...toString(args))),
  warn: (...args) => logger(ctx.yellow(...toString(args))),
};
