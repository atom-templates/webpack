# 开发环境解决方案简介

本地开发环境基于一个 node server。

> node server 基于 express

## webpack 编译

### 1. 启动的同时开始 webpack 编译

这么做的原因是我们的 SSR 处理过程需要使用 webpack 的构建产物 `*.atom.php` 和 `*.template.php` 才能进行。

### 2. 入口 atom

1. 入口 atom 我们是依靠约定 `index.atom` 为入口来进行标识的，即所有的 `index.atom` 都是一个页面的入口；
2. 入口 atom 转化为 entry 的规则是：SomeCategory/SomePage => somecategory-somepage；
3. 入口的启动封装 EntryLoader

    atom 在 html 中启动需要额外配合 `common/index` 以及后端输出的数据才能启动。

    因此，我们给 `index.atom` 添加了一个特殊的 `EntryLoader`。`EntryLoader` 会把 *.atom 进行包裹，并用 `common/index` 启动它。

### 3. *.atom.php 的生成

*.atom.php 的产生是由 `atom-loader` 来完成的。

需要给 `atom-loader` 添加 `resolvePhpOutputPath` 来指定 php 的输出目录。

### 4. 页面入口模板的生成

页面入口模板是由 `webpack` 中的 `html-webpack-plugin` 生成的。

> 在开发环境下，`html-webpack-plugin` 还需要结合 `html-webpack-harddisk-plugin` 才能将生成的 php 写入磁盘

为每个页面都生成了一个定制版本的 php 文件。具体的，每个页面只包含每个页面需要的 chunk，即入口 atom 和 vendor。

另外，我们使用了 `html-webpack-plugin` 的 `template` 功能。 具体的，我们使用 `tools/template.js` 来完成生成的功能。它会根据 `tools/template.php` 的内容来生成定制版本的 php 文件。

> template.php 是 swig 格式的；
> 虽然是 swig 格式的，但是没有没输出什么页面定制的东西。
> 目前的定制主要是指 chunk 的选取

## php ssr 的处理

node server 对于本地路由配置中的请求 URL，请此类请求转发给 php-cgi 进行 SSR 预渲染处理。

其中，涉及到以下模块：

1. tools/routes.json 请求路径到页面入口 atom 组件

    当前示例中的 routes.json 如下：

    ```js
    [
        {
            "pattern": "/",
            "component": "Home/index"
        },
        {
            "pattern": "/post",
            "component": "Post/index"
        },
        {
            "pattern": "/my/info",
            "component": "My/Info/index"
        },
        {
            "pattern": "/my/like",
            "component": "My/Like/index"
        }
    ]
    ```
    当请求 `http://localhost:8080` 时路径 `/` 会被转给 `Home/index` 来处理。

2. node 到 php-cgi 的转发

    这里我们使用了 `tools/php-cgi` 模块完成此工作；

    > 注意，我们将所有的请求都转交给 `tools/server.php` (SCRIPT_FILE)来处理
    > `tools/server.php` 会根据请求路径和 `tools/routes` 来找到匹配的 `atom` 组件，并进行 SSR 处理
