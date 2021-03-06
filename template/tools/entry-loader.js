/**
 * @file Entry Loader
 * @author leon<ludafa@outlook.com>
 */

const loaderUtils = require('loader-utils');
const path = require('path');
const relative = require('relative');

module.exports = function (content, map, meta) {

    let common = path.resolve('src/common/index.js');

    let result = `\
// generated by EntryLoader
import {init} from '${relative(this.resourcePath, common)}';
let m = {
    exports: {}
};
((module, exports) => {
    ${content}
})(m, m.exports);
init(m.exports, window.__DATA__, window.__COMPONENT_PROPS__);`;

    return result;

};
