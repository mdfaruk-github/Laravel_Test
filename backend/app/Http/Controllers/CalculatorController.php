<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalculatorController extends Controller
{
    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'num1'     => ['required', 'numeric'],
            'num2'     => ['required', 'numeric'],
            'operator' => ['required', 'in:+,-,*,/'],
        ]);

        $num1     = (float) $validated['num1'];
        $num2     = (float) $validated['num2'];
        $operator = $validated['operator'];

        if ($operator === '/' && $num2 == 0) {
            return response()->json([
                'data'    => null,
                'message' => 'Cannot divide by zero',
                'error'   => ['num2' => ["Division by zero is not allowed."]],
            ], 422);
        }

        $result = match ($operator) {
            '+'     => $num1 + $num2,
            '-'     => $num1 - $num2,
            '*'     => $num1 * $num2,
            '/'     => $num1 / $num2,
        };

        return response()->json([
            'data'    => ['result' => $result],
            'message' => 'Success',
            'error'   => null,
        ]);
    }
}
