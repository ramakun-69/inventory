<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{

    protected $fill = [
        'name' => 1,
        'email' => 1,
        'phone' => 1,
        'password' => 0,
        'password_confirmation' => 0,
        'photo' => 0,
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
        if ($this->password || $this->password_confirmation) {
            $this->fill['password'] = 1;
            $this->fill['password_confirmation'] = 1;
        }
        foreach (array_keys($this->fill) as $key) {
            $dataValidate[$key] = ($this->fill[$key] == 1) ? 'required' : 'nullable';
            switch ($key) {
                case 'password':
                    $dataValidate[$key] .= '|min:8|confirmed';
                    break;
                case 'photo':
                    $dataValidate[$key] .= '|image|max:10248';
                    break;
                case 'phone':
                    $dataValidate[$key] .= '|phone:AUTO,ID';
                    break;
                case 'email':
                    $dataValidate[$key] .= '|email:dns|unique:users,email,' . (Auth::id() ?? 'NULL') . ',id';
                    break;
            }
        }
        return $dataValidate;
    }
}
