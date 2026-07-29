<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModulePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module, ?string $action = null): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if ($user->isAdmin()) {
            return $next($request);
        }

        if (! $action) {
            $method = $request->method();
            if ($method === 'GET') {
                $action = 'view';
                if ($request->routeIs('*.create')) {
                    $action = 'insert';
                }
                if ($request->routeIs('*.edit')) {
                    $action = 'update';
                }
            } elseif ($method === 'POST') {
                $action = 'insert';
            } elseif (in_array($method, ['PUT', 'PATCH'])) {
                $action = 'update';
            } elseif ($method === 'DELETE') {
                $action = 'delete';
            } else {
                $action = 'view';
            }
        }

        $level = $user->effectiveModulePermission($module, $action);

        if (! in_array($level, ['own', 'team', 'yes', 'all'], true)) {
            abort(403, __('You do not have permission to :action :module.', ['action' => $action, 'module' => $module]));
        }

        return $next($request);
    }
}
