<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleTeamSeeder extends Seeder
{
    public function run(): void
    {
        // ── Default Teams ──────────────────────────────────────────────────
        $defaultTeam = Team::firstOrCreate(
            ['name' => 'Default Team'],
            ['description' => 'The default team for all users.']
        );

        $salesTeam = Team::firstOrCreate(
            ['name' => 'Sales'],
            ['description' => 'Sales department team.', 'position_list' => ['Sales Rep', 'Sales Manager', 'Account Executive']]
        );

        $supportTeam = Team::firstOrCreate(
            ['name' => 'Support'],
            ['description' => 'Customer support team.', 'position_list' => ['Support Agent', 'Support Lead']]
        );

        // ── Default Roles ──────────────────────────────────────────────────
        $adminRole = Role::firstOrCreate(
            ['name' => 'Administrator'],
            [
                'description'                   => 'Full access to all system features.',
                'assignment_permission'          => 'all',
                'user_permission'               => 'all',
                'message_permission'            => 'all',
                'export_permission'             => 'yes',
                'mass_update_permission'        => 'yes',
                'data_privacy_permission'       => 'yes',
                'follower_management_permission' => 'yes',
                'audit_permission'              => 'yes',
                'mention_permission'            => 'all',
                'user_calendar_permission'      => 'all',
                'lock_permission'               => 'yes',
                'group_email_account_permission' => 'all',
                'portal_permission'             => 'yes',
                'data' => [
                    'Account'     => ['read' => 'all', 'create' => 'yes', 'edit' => 'all', 'delete' => 'all', 'stream' => 'all'],
                    'Contact'     => ['read' => 'all', 'create' => 'yes', 'edit' => 'all', 'delete' => 'all', 'stream' => 'all'],
                    'Lead'        => ['read' => 'all', 'create' => 'yes', 'edit' => 'all', 'delete' => 'all', 'stream' => 'all'],
                    'Opportunity' => ['read' => 'all', 'create' => 'yes', 'edit' => 'all', 'delete' => 'all', 'stream' => 'all'],
                    'Case'        => ['read' => 'all', 'create' => 'yes', 'edit' => 'all', 'delete' => 'all', 'stream' => 'all'],
                    'Task'        => ['read' => 'all', 'create' => 'yes', 'edit' => 'all', 'delete' => 'all', 'stream' => 'all'],
                ],
            ]
        );

        $managerRole = Role::firstOrCreate(
            ['name' => 'Manager'],
            [
                'description'                   => 'Team-level access. Can manage team records.',
                'assignment_permission'          => 'team',
                'user_permission'               => 'team',
                'message_permission'            => 'team',
                'export_permission'             => 'yes',
                'mass_update_permission'        => 'yes',
                'data_privacy_permission'       => 'no',
                'follower_management_permission' => 'yes',
                'audit_permission'              => 'no',
                'mention_permission'            => 'team',
                'user_calendar_permission'      => 'team',
                'lock_permission'               => 'no',
                'group_email_account_permission' => 'team',
                'portal_permission'             => 'no',
                'data' => [
                    'Account'     => ['read' => 'team', 'create' => 'yes', 'edit' => 'team', 'delete' => 'own', 'stream' => 'team'],
                    'Contact'     => ['read' => 'team', 'create' => 'yes', 'edit' => 'team', 'delete' => 'own', 'stream' => 'team'],
                    'Lead'        => ['read' => 'team', 'create' => 'yes', 'edit' => 'team', 'delete' => 'own', 'stream' => 'team'],
                    'Opportunity' => ['read' => 'team', 'create' => 'yes', 'edit' => 'team', 'delete' => 'own', 'stream' => 'team'],
                    'Task'        => ['read' => 'team', 'create' => 'yes', 'edit' => 'team', 'delete' => 'own', 'stream' => 'team'],
                ],
            ]
        );

        $staffRole = Role::firstOrCreate(
            ['name' => 'Staff'],
            [
                'description'                   => 'Own-record access only.',
                'assignment_permission'          => 'own',
                'user_permission'               => 'own',
                'message_permission'            => 'own',
                'export_permission'             => 'no',
                'mass_update_permission'        => 'no',
                'data_privacy_permission'       => 'no',
                'follower_management_permission' => 'no',
                'audit_permission'              => 'no',
                'mention_permission'            => 'team',
                'user_calendar_permission'      => 'no',
                'lock_permission'               => 'no',
                'group_email_account_permission' => 'no',
                'portal_permission'             => 'no',
                'data' => [
                    'Account'     => ['read' => 'own', 'create' => 'yes', 'edit' => 'own', 'delete' => 'no', 'stream' => 'own'],
                    'Contact'     => ['read' => 'own', 'create' => 'yes', 'edit' => 'own', 'delete' => 'no', 'stream' => 'own'],
                    'Lead'        => ['read' => 'own', 'create' => 'yes', 'edit' => 'own', 'delete' => 'no', 'stream' => 'own'],
                    'Opportunity' => ['read' => 'own', 'create' => 'yes', 'edit' => 'own', 'delete' => 'no', 'stream' => 'own'],
                    'Task'        => ['read' => 'own', 'create' => 'yes', 'edit' => 'own', 'delete' => 'own', 'stream' => 'own'],
                ],
            ]
        );

        // Assign Manager & Staff roles to teams
        $salesTeam->roles()->syncWithoutDetaching([$managerRole->id]);
        $supportTeam->roles()->syncWithoutDetaching([$staffRole->id]);

        $this->command->info('✔ Default teams & roles seeded.');
    }
}
