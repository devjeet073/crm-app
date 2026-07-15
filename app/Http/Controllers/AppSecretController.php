<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppSecretRequest;
use App\Http\Requests\UpdateAppSecretRequest;
use App\Models\AppSecret;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppSecretController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;

        $appSecrets = AppSecret::query()
            ->when($search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('app-secrets/index', [
            'appSecrets' => $appSecrets,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('app-secrets/create');
    }

    public function store(StoreAppSecretRequest $request): RedirectResponse
    {
        $secret = AppSecret::create($request->validated() + [
            'created_by_id' => $request->user()->id,
            'modified_by_id' => $request->user()->id,
            'delete_id' => '0',
        ]);

        return redirect()->route('app-secrets.index');
    }

    public function edit(AppSecret $appSecret): Response
    {
        return Inertia::render('app-secrets/edit', [
            'appSecret' => $appSecret,
        ]);
    }

    public function update(UpdateAppSecretRequest $request, AppSecret $appSecret): RedirectResponse
    {
        $appSecret->update($request->validated() + [
            'modified_by_id' => $request->user()->id,
        ]);

        return redirect()->route('app-secrets.index');
    }

    public function destroy(AppSecret $appSecret): RedirectResponse
    {
        $appSecret->delete();

        return redirect()->route('app-secrets.index');
    }
}
