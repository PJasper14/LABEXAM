<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
        
        // Create employee user
        User::create([
            'name' => 'Employee User',
            'email' => 'employee@example.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);
        
        // Create customer user
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);
        
        // Create some products
        $products = [
            [
                'name' => 'Laptop',
                'description' => 'High-performance laptop with the latest processor and ample storage.',
                'price' => 1299.99,
                'stock' => 10,
                'image' => null,
            ],
            [
                'name' => 'Smartphone',
                'description' => 'Latest smartphone with advanced camera features and long battery life.',
                'price' => 899.99,
                'stock' => 15,
                'image' => null,
            ],
            [
                'name' => 'Headphones',
                'description' => 'Noise-cancelling headphones with premium sound quality.',
                'price' => 249.99,
                'stock' => 25,
                'image' => null,
            ],
            [
                'name' => 'Smartwatch',
                'description' => 'Smartwatch with fitness tracking, heart rate monitoring, and notifications.',
                'price' => 399.99,
                'stock' => 8,
                'image' => null,
            ],
            [
                'name' => 'Wireless Earbuds',
                'description' => 'True wireless earbuds with high-quality sound and long battery life.',
                'price' => 149.99,
                'stock' => 30,
                'image' => null,
            ],
        ];
        
        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
