/**
 * @file create template to serve every entry with ssr support
 * @author leon<ludafa@outlook.com>
 */

const fs = require('fs');
const path = require('path');
const swig = require('swig');
const template = swig.compile(
    fs.readFileSync(path.resolve('tools/template.php'), 'utf8')
);

module.exports = function ({htmlWebpackPlugin}) {
    return template(htmlWebpackPlugin);
};
