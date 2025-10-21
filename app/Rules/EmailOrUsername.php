<?php

namespace App\Rules;

use Closure;
use Illuminate\Support\Facades\Validator;
use Illuminate\Contracts\Validation\ValidationRule;

class EmailOrUsername implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (str_contains($value, '@')) {
            $validator = Validator::make(
                [$attribute => $value],
                [$attribute => 'email:dns'] 
            );

            if ($validator->fails()) {
                $fail(__('validation.email', ['attribute' => $attribute]));
            }
        }
    }
}
