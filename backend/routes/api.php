<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalculatorController;

Route::post('/calculate', [CalculatorController::class, 'calculate']);
