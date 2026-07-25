<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmailConfigurationRequest;
use App\Http\Requests\UpdateEmailConfigurationRequest;
use App\Models\EmailConfiguration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailConfigurationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        $configs = EmailConfiguration::query()
            ->when($search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('email-configurations/index', [
            'configs' => $configs,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('email-configurations/create', [
            'mailers' => ['smtp'],
            'encryptionOptions' => ['tls', 'ssl'],
        ]);
    }

    public function store(StoreEmailConfigurationRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->boolean('is_active')) {
            EmailConfiguration::query()->update(['is_active' => false]);
        }

        $config = EmailConfiguration::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Email configuration created.')]);

        return to_route('email-configurations.show', $config);
    }

    public function show(EmailConfiguration $emailConfiguration): Response
    {
        return Inertia::render('email-configurations/show', [
            'config' => $emailConfiguration,
            'mailers' => ['smtp'],
            'encryptionOptions' => ['tls', 'ssl'],
        ]);
    }

    public function edit(EmailConfiguration $emailConfiguration): Response
    {
        return Inertia::render('email-configurations/edit', [
            'config' => $emailConfiguration,
            'mailers' => ['smtp'],
            'encryptionOptions' => ['tls', 'ssl'],
        ]);
    }

    public function update(UpdateEmailConfigurationRequest $request, EmailConfiguration $emailConfiguration): RedirectResponse
    {
        $data = $request->validated();

        if ($request->boolean('is_active')) {
            EmailConfiguration::query()->where('id', '!=', $emailConfiguration->id)->update(['is_active' => false]);
        }

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $emailConfiguration->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Email configuration updated.')]);

        return to_route('email-configurations.show', $emailConfiguration);
    }

    public function destroy(EmailConfiguration $emailConfiguration): RedirectResponse
    {
        $emailConfiguration->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Email configuration deleted.')]);

        return to_route('email-configurations.index');
    }
}
