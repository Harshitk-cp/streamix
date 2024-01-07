import chalk from "chalk";

import { LOG_LEVEL } from "./utils/enums.js";

class Logger {
  static _level = LOG_LEVEL.DEBUG;

  static setLevel(level) {
    Logger._level = level;
  }

  static error(label, ...args) {
    if (Logger._level < LOG_LEVEL.ERROR) return;
    if (args.length === 1 && args[0] instanceof Error) {
      console.log(
        chalk.bgRed.whiteBright(`[${label}]`),
        chalk.redBright(">", args[0].stack)
      );
    } else {
      console.log(
        chalk.bgRed.whiteBright(`[${label}]`),
        chalk.redBright(">", ...args)
      );
    }
  }

  static warn(label, ...args) {
    if (Logger._level < LOG_LEVEL.WARN) return;
    console.log(chalk.bgYellow.black(`[${label}]`), chalk.yellow(">", ...args));
  }

  static info(label, ...args) {
    if (Logger._level < LOG_LEVEL.INFO) return;
    console.log(chalk.bgCyan.black(`[${label}]`), chalk.cyan(">", ...args));
  }

  static log(label, ...args) {
    if (Logger._level < LOG_LEVEL.LOG) return;
    console.log(chalk.bgGray.black(`[${label}]`), chalk.gray(">", ...args));
  }

  static debug(...args) {
    if (Logger._level < LOG_LEVEL.DEBUG) return;
    console.log(chalk.bgWhite.black(`[DEBUG]`), ">", ...args);
  }
}

export default Logger;
