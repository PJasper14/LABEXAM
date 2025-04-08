<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Display a listing of the user's cart items.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with('product')
            ->get();
            
        $total = $cartItems->sum(function($item) {
            return $item->quantity * $item->product->price;
        });
        
        return response()->json([
            'items' => $cartItems,
            'total' => $total
        ]);
    }

    /**
     * Store a newly created cart item in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check product stock
        $product = Product::find($request->product_id);
        if (!$product || $product->stock <= 0) {
            return response()->json([
                'message' => 'Product is out of stock'
            ], 422);
        }
        
        // Check if quantity exceeds available stock
        if ($request->quantity > $product->stock) {
            return response()->json([
                'message' => 'Requested quantity exceeds available stock',
                'available' => $product->stock
            ], 422);
        }

        // Check if product is already in cart
        $existingItem = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();
            
        if ($existingItem) {
            // Ensure total quantity doesn't exceed stock
            $newQuantity = $existingItem->quantity + $request->quantity;
            if ($newQuantity > $product->stock) {
                return response()->json([
                    'message' => 'Total quantity would exceed available stock',
                    'available' => $product->stock,
                    'in_cart' => $existingItem->quantity
                ], 422);
            }
            
            $existingItem->quantity = $newQuantity;
            $existingItem->save();
            
            return response()->json([
                'message' => 'Cart updated successfully',
                'item' => $existingItem->load('product')
            ]);
        }

        // Create new cart item
        $cartItem = Cart::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
        ]);

        return response()->json([
            'message' => 'Item added to cart successfully',
            'item' => $cartItem->load('product')
        ], 201);
    }

    /**
     * Update the specified cart item in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Cart  $cart
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Cart $cart)
    {
        // Check if cart item belongs to user
        if ($cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check product stock
        $product = $cart->product;
        if ($request->quantity > $product->stock) {
            return response()->json([
                'message' => 'Requested quantity exceeds available stock',
                'available' => $product->stock
            ], 422);
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json([
            'message' => 'Cart updated successfully',
            'item' => $cart->load('product')
        ]);
    }

    /**
     * Remove the specified cart item from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Cart  $cart
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Cart $cart)
    {
        // Check if cart item belongs to user
        if ($cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart->delete();

        return response()->json([
            'message' => 'Item removed from cart successfully'
        ]);
    }

    /**
     * Clear all items from user's cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function clear(Request $request)
    {
        Cart::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'Cart cleared successfully'
        ]);
    }
} 