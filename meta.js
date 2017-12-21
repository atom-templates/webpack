/**
 * @file 配置
 * @author
 */

const path = require('path');
const fs = require('fs');

const {
    sortDependencies,
    installDependencies,
    printMessage
} = require('./utils');

module.exports = {
    prompts: {
        name: {
            type: 'string',
            required: true,
            message: 'Project name'
        },
        description:  {
            type: 'string',
            required: false,
            message: 'Project description',
            default: 'A atom.js project'
        },
        author: {
            type: 'string',
            message: 'Author'
        },
        autoInstall: {
            type: 'list',
            message: 'Should we run `npm install` for you after the project has been created? (recommended)',
            choices: [{
                name: 'Yes, user NPM',
                value: 'npm',
                short: 'npm'
            }, {
                name: 'Yes, use Yarn',
                value: 'yarn',
                short: 'yarn'
            }, {
                name: 'No, I will handle that myself',
                value: false,
                short: 'no'
            }]
        }
    },
    filters: {

    },
    complete: function (data, {chalk}) {
        const green = chalk.green;
        sortDependencies(data, green);
        const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName);
        if (data.autoInstall) {
            installDependencies(cwd, data.autoInstall, green).then(() => {
            //     return runLintFix(cwd, data, green);
            // }).then(() => {
                printMessage(data, green);
            }).catch(e => {
                console.log(chalk.red('Error:'), e);
            });
        }
        else {
            printMessage(data, chalk);
        }
    }
};
