<?php

use Inertia\Testing\AssertableInertia as Assert;

test('locale defaults to english and shares translations with inertia', function () {
    $this->get('/')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'en')
            ->has('locales')
            ->has('translations')
        );
});

test('switching locale via post /locale updates session and sets locale', function () {
    $response = $this->post('/locale', ['locale' => 'es']);

    $response->assertRedirect();
    $response->assertSessionHas('locale', 'es');
    expect(session('locale'))->toBe('es');
});

test('locale set in cookie is respected on request', function () {
    $this->withUnencryptedCookie('locale', 'es')
        ->get('/')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'es')
            ->where('translations.Dashboard', 'Panel de Control')
        );
});
