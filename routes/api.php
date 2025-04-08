<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\CartController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Simple test route
Route::get('/ping', function() {
    return response()->json(['message' => 'pong']);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search/{query?}', [ProductController::class, 'search']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Customer routes
    Route::middleware('role:customer')->group(function () {
        // Cart routes
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{cart}', [CartController::class, 'update']);
        Route::delete('/cart/{cart}', [CartController::class, 'destroy']);
        Route::delete('/cart', [CartController::class, 'clear']);
        
        // Customer order routes
        Route::post('/checkout', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'userOrders']);
        Route::get('/orders/{order}', [OrderController::class, 'showUserOrder']);
    });
    
    // Employee and Admin routes
    Route::middleware('role:employee,admin')->group(function () {
        // Product management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        
        // Order monitoring
        Route::get('/orders/all', [OrderController::class, 'index']);
        Route::get('/orders/all/{order}', [OrderController::class, 'show']);
        Route::get('/orders/filter', [OrderController::class, 'filter']);
    });
});

Route::get('/test', function() {
    return response()->json(['message' => 'API is working!']);
});

// Test route with dummy product data
Route::get('/products-test', function() {
    return response()->json([
        'products' => [
            ['id' => 1, 'name' => 'Test Product 1', 'price' => 19.99],
            ['id' => 2, 'name' => 'Test Product 2', 'price' => 29.99],
            ['id' => 3, 'name' => 'Test Product 3', 'price' => 39.99],
        ]
    ]);
}); 