/**
 * @file 工具函数
 * @author
 */
const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;


exports.sortDependencies = function sortDependencies(data) {
    const packageJsonFile = path.join(
        data.inPlace ? '' : data.destDirName,
        'package.json'
    );
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile));
    packageJson.devDependencies = sortObject(packageJson.devDependencies);
    packageJson.dependencies = sortObject(packageJson.dependencies);
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2) + '\n');
}

exports.installDependencies = function installDependencies(cwd, executable = 'npm', color) {
    console.log(`\n\n# ${color('Installing project dependencies ...')}`);
    console.log('# ========================\n');
    return runCommand(executable, ['install'], {
        cwd
    });
}


exports.printMessage = function printMessage(data, {green, yellow}) {
      const message = `
        # ${green('Project initialization finished!')}
        # ========================
        To get started:
        ${yellow(
            `${data.inPlace ? '' : `cd ${data.destDirName}\n  `}${installMsg(
            data
            )}`
        )}

        Documentation can be found at https://vuejs-templates.github.io/webpack
        `
}

function installMsg(data) {
  return !data.autoInstall ? 'npm install (or if using yarn: yarn)\n  ' : ''
}


function runCommand(cmd, args, options) {
    return new Promise((resolve, reject) => {
        const spwan = new spawn(cmd, args, Object.assign({
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: true
        }, options));
        spwan.on('exit', () => {
            resolve();
        });
    });
}

function sortObject(object) {
    const sortedObject = {};
    Object.keys(object).sort().forEach(item => {
        sortedObject[item] = object[item];
    });
    return sortedObject;
}