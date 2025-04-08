<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-web', function () {
    return 'Web routes are working!';
});

// Test API route in web.php to verify routing
Route::get('/api-test', function () {
    return response()->json(['message' => 'API test route is working!']);
});

// Test route to check if API routes are loaded
Route::get('/check-api-routes', function () {
    $routes = collect(\Illuminate\Support\Facades\Route::getRoutes())->map(function ($route) {
        return [
            'uri' => $route->uri(),
            'methods' => $route->methods(),
        ];
    })->toArray();
    
    return response()->json([
        'message' => 'API routes check',
        'routes' => $routes
    ]);
});