<?php

//显示除去 E_NOTICE 之外的所有错误信息
error_reporting(E_ALL ^ E_NOTICE);

require_once(__DIR__ . "/../node_modules/vip-server-renderer/php/server/Atom.class.php");
require_once(__DIR__.'/AtomWrapper.class.php');
require_once(__DIR__.'/router.php');

$root = __DIR__ . "/..";
$request = $_SERVER['REQUEST_URI'];

$component = route($request);

if (empty($component)) {
    return false;
}

$templateDir = "$root/output/template";

$atomWrapper = new AtomWrapper();

$atomWrapper->setTemplateDir($templateDir);

$data = exec("node $root/tools/get-mock-data.js $root/src/$component $request");
$data = json_decode($data, true);

if (!empty($data)) {
    foreach ($data as $key => $value) {
        $atomWrapper->assign($key, $value);
    }
}

$atomWrapper->display("$component.template.php", "$component.atom.php");
