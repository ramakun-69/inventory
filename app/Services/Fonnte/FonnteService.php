<?php

namespace App\Services\Fonnte;

use LaravelEasyRepository\BaseService;

interface FonnteService extends BaseService
{

    public function sendMessage($number, $message);
}
