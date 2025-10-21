<?php

namespace App\Http\Requests\Auth;

use App\Rules\EmailOrUsername;
use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{

    protected $fill = [
        'identity' => 1
    ];
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    protected function prepareForValidation()
    {
        $trimmed = [];

        foreach ($this->fill as $key) {
            if ($this->has($key)) {
                $trimmed[$key] = is_string($this->input($key)) ? trim($this->input($key)) : $this->input($key);
            }
        }

        $this->merge($trimmed);
    }
    public function rules(): array
    {
        $dataValidate = [];
        foreach (array_keys($this->fill) as $key) {
            switch ($key) {
                case 'identity':
                    $dataValidate[$key] = [
                        ($this->fill[$key] == 1) ? 'required' : 'nullable',
                        'string',
                        new EmailOrUsername(),
                    ];
                    break;
            }
        }
        return $dataValidate;
    }

    public function messages(): array
    {
        return [
            'identity.required' => __('Username or Email is required.'),
        ];
    }
}
