<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Call;
use App\Models\Lead;
use App\Models\Meeting;
use App\Models\Reminder;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CrmDemoSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::query()->count() > 0
            ? User::all()
            : User::factory(5)->create();

        $accounts = Account::factory(15)
            ->recycle($users)
            ->create();

        $accounts->each(function (Account $account) use ($users) {
            Call::factory(random_int(0, 3))
                ->recycle($users)
                ->create(['account_id' => $account->id])
                ->each(fn (Call $call) => $call->users()->attach(
                    $users->random(min($users->count(), random_int(1, 3)))->pluck('id'),
                    ['status' => 'Accepted'],
                ));

            Meeting::factory(random_int(0, 3))
                ->recycle($users)
                ->create(['account_id' => $account->id])
                ->each(fn (Meeting $meeting) => $meeting->users()->attach(
                    $users->random(min($users->count(), random_int(1, 3)))->pluck('id'),
                    ['status' => 'Accepted'],
                ));

            Task::factory(random_int(0, 4))
                ->recycle($users)
                ->create(['account_id' => $account->id]);
        });

        Lead::factory(25)
            ->recycle($users)
            ->create()
            ->each(function (Lead $lead, int $index) use ($accounts) {
                if ($index % 3 === 0) {
                    $lead->update([
                        'status' => 'Converted',
                        'converted_at' => now(),
                        'created_account_id' => $accounts->random()->id,
                    ]);
                }
            });

        Reminder::factory(20)
            ->recycle($users)
            ->create();
    }
}
