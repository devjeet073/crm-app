<?php

namespace App\Services;

use App\Models\User;

class NavigationService
{
    /**
     * Get the dynamic menu tree for a given user filtered by permissions and roles.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getMenuForUser(?User $user): array
    {
        if (! $user) {
            return [];
        }

        $rawGroups = [
            [
                'title' => 'Overview',
                'items' => [
                    [
                        'title' => 'Dashboard',
                        'href' => '/dashboard',
                        'icon' => 'LayoutGrid',
                    ],
                    [
                        'title' => 'Calendar',
                        'href' => '/calendar',
                        'icon' => 'CalendarDays',
                    ],
                    [
                        'title' => 'Automations & Compliance',
                        'href' => '/automations',
                        'icon' => 'Sparkles',
                    ],
                ],
            ],
            [
                'title' => 'CRM & Sales',
                'items' => [
                    [
                        'title' => 'Accounts',
                        'href' => '/accounts',
                        'icon' => 'Building2',
                        'permission' => 'Accounts',
                    ],
                    [
                        'title' => 'Leads',
                        'href' => '/leads',
                        'icon' => 'UserPlus',
                        'permission' => 'Leads',
                    ],
                    [
                        'title' => 'Tasks',
                        'href' => '/tasks',
                        'icon' => 'ListTodo',
                        'permission' => 'Tasks',
                    ],
                    [
                        'title' => 'Documents',
                        'href' => '/documents',
                        'icon' => 'FileText',
                        'permission' => 'Documents',
                    ],
                ],
            ],
            [
                'title' => 'Administration',
                'adminOnly' => true,
                'items' => [
                    [
                        'title' => 'Users',
                        'href' => '/users',
                        'icon' => 'UserCog',
                        'adminOnly' => true,
                    ],
                    [
                        'title' => 'Teams',
                        'href' => '/teams',
                        'icon' => 'UsersRound',
                        'adminOnly' => true,
                    ],
                    [
                        'title' => 'Roles',
                        'href' => '/roles',
                        'icon' => 'Shield',
                        'adminOnly' => true,
                    ],
                    [
                        'title' => 'Email Configurations',
                        'href' => '/email-configurations',
                        'icon' => 'Mail',
                        'adminOnly' => true,
                    ],
                    [
                        'title' => 'Activity Logs',
                        'href' => '/activity-logs',
                        'icon' => 'Activity',
                        'adminOnly' => true,
                    ],
                ],
            ],
        ];

        $filteredGroups = [];

        foreach ($rawGroups as $group) {
            // Check group-level admin restriction
            if (! empty($group['adminOnly']) && ! $user->isAdmin()) {
                continue;
            }

            $filteredItems = [];
            foreach ($group['items'] as $item) {
                if (! $this->canAccessItem($user, $item)) {
                    continue;
                }

                // Filter nested sub-items if present
                if (! empty($item['items'])) {
                    $subItems = [];
                    foreach ($item['items'] as $subItem) {
                        if ($this->canAccessItem($user, $subItem)) {
                            $subItems[] = $subItem;
                        }
                    }
                    $item['items'] = $subItems;
                }

                $filteredItems[] = $item;
            }

            if (! empty($filteredItems)) {
                $group['items'] = $filteredItems;
                $filteredGroups[] = $group;
            }
        }

        return $filteredGroups;
    }

    /**
     * Check if user has permission to access a menu item.
     */
    protected function canAccessItem(User $user, array $item): bool
    {
        // Admin restriction
        if (! empty($item['adminOnly']) && ! $user->isAdmin()) {
            return false;
        }

        // Admin bypasses module permission check
        if ($user->isAdmin()) {
            return true;
        }

        // Module permission check
        if (! empty($item['permission'])) {
            return $user->canViewModule($item['permission']);
        }

        return true;
    }
}
