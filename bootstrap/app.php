<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Middleware\HandleInertiaRequests;
use Spatie\Permission\Middleware\RoleMiddleware;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')
                ->group(base_path('routes/datatable.php'))
                ->group(base_path('routes/trash.php'))
                ->group(base_path('routes/auth.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            $status = $response->getStatusCode();

            // hanya di production / non-local environment
            if (! app()->environment(['local', 'testing']) && in_array($status, [403, 404, 500, 503])) {
                // Render halaman error Inertia
                return Inertia::render('Errors/ErrorPage', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            } elseif ($status === 419) {
                // contoh: halaman expired CSRF → redirect kembali
                return back()->withErrors([
                    'message' => __('The page has expired, please try again.'),
                ]);
            }
            // default: biarkan response normal
            return $response;
        });
    })->create();
