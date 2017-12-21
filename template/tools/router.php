<?php

function route($request) {
    $routes = json_decode(file_get_contents(__DIR__.'/routes.json'), true);
    foreach ($routes as $route) {
        if ($route['pattern'] === parse_url($request, PHP_URL_PATH)) {
            return $route['component'];
        }
    }
    return null;
}
