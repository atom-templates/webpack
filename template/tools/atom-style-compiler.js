/**
 * @file atom style compiler
 * @author leon<ludafa@outlook.com>
 */

function createStyleCompiler(handlers) {

    return function (code, {lang, src, scoped}) {

        let handler = handlers[lang];

        if (!handler) {
            return code;
        }

        return handler(code, {src, scoped});

    };

}

// const stylus = require('stylus');

module.exports = createStyleCompiler({

    // stylus(code, {scoped, src}) {
    //     let css = '';
    //     stylus(code)
    //         .render((error, result) => {
    //             if (error) {
    //                 console.error(error);
    //                 return;
    //             }
    //             css = result;
    //         });
    //     return css;
    // }

});
