<?php

namespace Database\Seeders;

use App\Models\CrmModule;
use Illuminate\Database\Seeder;

class CrmModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = ['Accounts', 'Contacts', 'Leads', 'Tasks', 'Documents', 'Teams', 'Users', 'Roles', 'Activity Logs', 'Email Configurations', 'Calendar'];

        foreach ($modules as $module) {
            CrmModule::firstOrCreate(['name' => $module]);
        }
    }
}
