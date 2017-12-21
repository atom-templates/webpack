## atom webpack starter

以 webpack 为构建工具的 atom 种子项目

拥有以下功能：

1. SSR(server side render)支持
2. 本地路由
3. 本地 mock 数据

### 运行环境

本项目需要有以下运行环境支持：

1. node(>=6.0)
2. php(>=5.4)

### Setup

1. 下载本项目 zip 包
2. 解压 zip 包
3. npm install
4. npm start
5. open http://localhost:8080

接下来你就可以开始开发了。

此外，我们还提供了以下快捷脚本：

```sh
# 进行生产环境构建
npm run build

# 在本地以生产环境预览
npm run preview
```

### 项目详情

本章节涉及开发中的一系列约定和规范，请注意。

#### 项目整体目录结构

```text
├── README.md         // 本文档
├── node_modules      // 依赖包
├── output            // 构建产物目录
├── package-lock.json // npm package-lock
├── package.json      // npm package
├── src               // 源代码目录
└── tools             // 开发、构建工具目录
```

#### 源代码目录结构

所有的源代码需要放置到 `src` 目录下，本项目中的示例代码目录结构如下：

```text
src
├── Home
│   ├── Post.atom
│   ├── cat.jpg
│   ├── index.atom
│   └── index.mock.js
├── My
│   ├── Info
│   │   ├── index.atom
│   │   └── index.mock.js
│   ├── Like
│   │   ├── index.atom
│   │   └── index.mock.js
│   └── common
│       └── component
│           └── Tabs.atom
├── Post
│   ├── index.atom
│   └── index.mock.js
└── common
    ├── component
    │   └── Layout.atom
    └── index.js
```

以中需要注意几条规范：

1. 每个页面需要使用一个独立的目录，页面的入口文件是 `index.atom`

    > 强调：此条规则涉及到调试、构建以及与后端的配合，请务必遵守。

2. 页面不允许引用(依赖)其他页面中的模块，比如：

    ```js
    // 当前文件是 src/Home/index.js
    // 那么下边这个 import，即引入其他页面的模块是不允许的
    import xxx from '../Post/someModule.js'
    ```

3. 如果有多个页面的共同依赖模块，需要放置到 `common` 目录下
4. 可以使用多层目录来对页面进行分组，例如上述中的 `My/Info` 和 `My/Like` 页面，同属于 `My` 分类下。

    > `My/Info` 和 `My/Like` 的共用模块可以放置到 `My/common` 目录下

5. 对于目录的命名可以采用以下两种风格之一：

    1. MySomePage
    2. my-some-page

    > 同一项目下，只能采用其中一种风格。

6. 对于模块文件的命名风格需要遵守以下规则：

    1. 对于 `类 class`，需要使用 Pascal 命名法，即 SomeAtomComponent；

        > 由于 atom 组件是一个类，因此要求 atom 组件文件名需要是 Pascal 命名法；

    2. 对于一般 js 模块，需要使用 Camel 命名法，即 someModule;

7. 业务模块代码中引入模块时**必须**使用相对路径

    即：

    ```js
    import {test} from './test';
    import '../../common/js/a';
    ```

#### 构建产物目录

本示例项目的构建产物目录的内容如下：

```text
output
├── static
│   ├── 9a6f4ee0d85fd3fe0b6ce2470cbd1b78.jpg
│   ├── home.43d2243c.css
│   ├── home.dea0247c.js
│   ├── my-info.c400c0d8.js
│   ├── my-info.d710c5fa.css
│   ├── my-like.97cdd578.css
│   ├── my-like.f7e4f1e1.js
│   ├── post.0532d5a4.css
│   ├── post.96916ac8.js
│   └── vendor.25ce2d60.js
└── template
    ├── Home
    │   ├── Post.atom.php
    │   ├── index.atom.php
    │   └── index.template.php
    ├── My
    │   ├── Info
    │   │   ├── index.atom.php
    │   │   └── index.template.php
    │   ├── Like
    │   │   ├── index.atom.php
    │   │   └── index.template.php
    │   └── common
    │       └── component
    │           └── Tabs.atom.php
    ├── Post
    │   ├── index.atom.php
    │   └── index.template.php
    └── common
        └── component
            └── Layout.atom.php
```

其中需要注意的有：

1. `static` 目录下是所有的静态资源

    目前的打包方案大概如下：

    1. 每个页面都有一个入口 js 和 css
    2. 所有的依赖包都合并为 vendor.js

2. `template` 目录下是所有在 SSR 过程需要的 php 文件：

    1. *.template.php 是每个页面的入口模板，

        这个 php 文件中只包含了对应页面的主入口 chunk 和 vendor chunk。

        它提供以下功能：

        1. 提供完整的 html 结构

            > 模板文件不包含业务内容

        2. 提供带有 hash 的静态资源引入
        3. 后端输出的数据

            目前后端输出数据是通过全局变量的方式输出的，目前占用了两个全局变量：

            ```js
            // SSR JS 启动需要的数据
            window.__DATA__ = {};
            // atom 组件的属性名列表
            window.__COMPONENT_PROPS__ = [ ... ];
            ```

    2. *.atom.php

        这个是文件是 *.atom 的编译产物，用来在 php 后端环境下生成业务内容 html。

### 如何使用 atom 进行预渲染(服务器端setup指南)

**AKA: SERVER SIDE SETUP**

1. atom 提供了 `Server Side Renderer` 功能，我们在后端需要使用我们提供的入口模板
1. 我们移除了对 `smarty` 模板的依赖，现在只使用纯 php 来做渲染模板。
1. 我们给后端提供了模板渲染的封装，方便集成。

可以采用以下步骤进行操作：

1. 安装 vip-server-renderer 的 php 渲染库

    在下载好 atom 的 php 库之后，在合适的位置引入：

    ```php
    require_once(__DIR__ . "/path/to/vip-server-renderer/php/server/Atom.class.php");
    ```

1. 使用 AtomWraper.class.php

    我们做了一个简易封装，使得 Atom 的模板管理更简单、更明确。

    你可以在[这里](tools/AtomWrapper.class.php)找到 AtomWrapper 的源码。

    > 请下载此源码，并在合适的位置引入

    AtomWrapper 的用法与 Smarty 非常相似，这里举个例子：

    ```php

    // 创建实例
    $atomWrapper = new AtomWrapper();

    // 设置模板目录
    // 我们会在模板目录下边查找模板文件和atom组件
    $atomWrapper->setTemplateDir('/模板目录的绝对路径');

    // 此处添加模板渲染所需要的数据，可以重复调用多次
    $atomWrapper->assign('title', 'hello atom!');
    $atomWrapper->assign(
        'list',
        array(
            array(
                'name' => 'vue',
                'like' => 100,
            ),
            array(
                'name' => 'atom',
                'like' => 101
            ),
        )
    );

    // 渲染模板和组件
    $atomWrapper->display(
        // 指定页面模板（相对路径，相对于模板目录）
        'relative/to/template/SomePage/index.template.php',
        // 指定atom组件（相对路径，相对于模板目录）
        'relative/to/template/SomePage/index.atom.php'
    );
    ```

此处，可以根据请求，路由到正确的 atom 组件和入口模板。我们建议的目录结构是：

1. 每个页面一个目录
2. 每个页面的 `入口模板` 是页面目录下的 `index.template.php`；
3. 每个页面的 `入口atom组件` 是 **页面目录** 下 `index.atom.php`；

对于后端服务来讲（php开发同学），除了 `atom` 的 php runtime 之外，我们还需要提供构建产物中的 `template` 目录。

> 我们提供了一个简单的本地开发服务器，使用了 AtomWrapper，可供[参考](tools/server.php)

### mock 数据

在此 repo 中，可以通过 `npm start` 开启一个本地的开发服务器。

此时，你可以在页面目录下放置一个 `index.mock.js` 文件来生成 mock 数据。

在这个 js 文件中，你可以直接返回数据，例如在 /src/Home/index.mock.js 中：

```js
module.exports = {
    tplData: {
        // 业务数据
    },
    extData: {
        // 统计数据
    }
};
```

我们会上边这个数据来渲染页面。或者是返回一个函数，我们在渲染前会调用它。它可以返回一个 promise，来进行异步操作：

```js
const fetch = require('node-fetch');
const fs = require('fs');
module.exports = function (request) {
    return fs.existsSync('my-local-mock-data.json')
        ? require('my-local-mock-data.json')
        : fetch('http://remote-mock-server.com', {method: 'GET'})
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.status);
            });
};
```

其中，如果返回的是个函数，那么它还可以拿到当前请求的 url；可以用来做一些更灵活的 mock 处理。

### 其他注意事项

#### atom 组件中的标签 `<img>` 的属性 `src` 不能使用相对路径

由于 atom 组件的 template 部分没有提供 AST 信息，不能将 src 中的值转化为 webpack 所需要的 require，在构建后不能匹配到正确的资源，因此不能使用。

这种情况可以有两种方案来解决：

1. 可以使用绝对路径，比如 https://xxx.com/xxx.png
2. 可以替换为 css 的 background-image

> 由于 atom 组件中的 css 是通过 webpack 进行处理的，因此 atom 中的 css 中的 url( ... ) 不受此影响

#### 通过主入口 atom 组件的 `props` 来限定页面中的数据输入

由于我们的同构技术要求，需要将后端的数据输出在前端，来给前端的 atom 渲染出与预渲染一致的 dom 结构。

但有时后端提供的数据会很多，其中有些数据可以不输出到页面上。例如，后端数据为：

```js
{
    // 需要
    list: [
        {
            id: 1,
            title: 'xxx'
        },
        {
            id: 2,
            title: 'yyy'
        }
    ],
    // 不需要
    user: {
        name: 'xxx'
    }
}
```

我们只需要其中的 list，而不需要 user，那么在 index.atom 的 config 段落的 props 可以进行指定，只输出指定的数据项：

```html
<script type="config">
{
    props: ['list']
}
</script>
```

那么在预渲染输出的 html 中我们只会将 `list` 数据输出。

> `list` 中的无用数据无法进行过滤。可以与 RD 同学进行沟通，不要输出无用数据；


#### 生成 bundle 的一般指导原则

bundle 的配置与业务情况息息相关，需要根据业务来进行细化调整。但一般遵守几个原则：

1. 第三包依赖包一般单独打包

    这部分资源一般不会发生变化，合并成一个包之后利用缓存、CDN等优化可以最大限度地节省流量。因此一般推荐一个 bundle/vendor.js

2. 合并包不宜过大，一般在 200KB（非 gzip）左右为宜

    200KB只是一般意义上的 tcp 链接数与下载速度的最优值。如果 bundle 超过 200KB 很多，请适当拆分。如果 bundle 体积未达到 200KB 请统一合并成一个 bundle。

#### 在 atom 中使用 less / stylus 等预编译样式语言

在 atom 中我们可以使用 `less` / `stylus` 等流行的预编译语言来完成样式编写。我们可以这样来完成它们的编译，我们以 stylus 为例：

1. 首先，安装相应的编译器

    ```sh
    npm install stylus
    ```

2. 在 .atom 文件的 style 标签中添加属性 `lang` 来标识样式的语言类型：

    ```vue
    <style lang="stylus">
    $a = '#aaa';
    .some-class
        background-color: $a
    </style>
    ```

3. 最后，在 `tools/atom-style-compiler.js` 中添加编译配置：

    ```js
    // ...
    const stylus = require('stylus');

    module.exports = createStyleCompiler({

        // 此处的 key 需要与 *.atom 中的 lang 保持一致
        // 也就是说这里的每项配置都与 atom style 标签上的 lang 相应对应
        // @NOTICE 目前此处必须保证编译是同步函数，暂不支持异步编译
        stylus(code, {scoped, src}) {
            let css = '';
            stylus(code)
                .render((error, result) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    css = result;
                });
            return css;
        }

    });

    ```

#### 开发环境的处理细节

[参考](docs/development.md)
