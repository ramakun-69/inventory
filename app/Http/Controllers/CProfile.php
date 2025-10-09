<?php

namespace App\Http\Controllers;

use App\Models\Division;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;

class CProfile extends Controller
{
    use ResponseOutput;
    public function index()
    {
        return inertia('Profile/Index', [
          'division' => Division::select('id', 'name')->get(),
        ]);
    }
}
