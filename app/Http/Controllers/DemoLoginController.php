<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemoLoginController extends Controller
{
    public function login(Request $request)
    {
        if (! app()->environment('local', 'testing')) {
            abort(403);
        }

        $roleName = $request->input('role');
        $user = null;

        if ($roleName === 'Administrator') {
            $user = User::where('type', 'admin')->first();
            if (! $user) {
                $user = User::factory()->create([
                    'type' => 'admin',
                    'name' => 'Demo Admin',
                    'email' => 'admin@demo.com',
                ]);
                $role = Role::where('name', 'Administrator')->first();
                if ($role) {
                    $user->roles()->attach($role);
                }
            }
        } else {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user = $role->users()->first();
                if (! $user) {
                    $user = User::factory()->create([
                        'name' => 'Demo '.$roleName,
                        'email' => strtolower(str_replace(' ', '', $roleName)).'@demo.com',
                    ]);
                    $user->roles()->attach($role);
                }
            }
        }

        if ($user) {
            Auth::login($user);

            return redirect()->route('dashboard');
        }

        return back();
    }
}
