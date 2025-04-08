<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|array  ...$roles
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        foreach ($roles as $role) {
            if ($request->user()->role === $role || 
                ($role === 'admin' && $request->user()->role === 'admin') ||
                ($role === 'employee' && in_array($request->user()->role, ['admin', 'employee']))) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Forbidden: You do not have the necessary role to access this resource'], 403);
    }
} 