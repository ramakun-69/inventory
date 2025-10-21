<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Admin', 'guard_name' => 'web'],
            ['name' => 'User', 'guard_name' => 'web'],
            ['name' => 'Warehouse', 'guard_name' => 'web'],
        ];
        foreach ($roles as $role) {
           Role::updateOrCreate(['name' => $role['name']], $role);
        }
    }
}
