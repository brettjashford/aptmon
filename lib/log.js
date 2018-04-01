const chalk = require('chalk');
const {log} = console;
const {inspect} = require('util')

module.exports = {
    info: message => log(chalk.yellow(message)),
    error: message => log(chalk.red(message)),
    success: message => log(chalk.green(message)),
    inspect: obj => log(chalk.gray(inspect(obj, false, null)))
};
