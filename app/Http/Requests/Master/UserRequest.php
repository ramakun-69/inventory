<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{

    protected $fill = [
        'id' => 0,
        'name' => 1,
        'username' => 1,
        'phone' => 1,
        'email' => 1,
        'role' => 1,
        'position' => 1,
        'division_id' => 1,
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
            $dataValidate[$key] = ($this->fill[$key] == 1) ? 'required' : 'nullable';
            switch ($key) {
                case 'email':
                    $dataValidate[$key] .= '|email:dns|unique:users,email,' . ($this->id ?? 'NULL') . ',id';
                    break;
                case 'username':
                    $dataValidate[$key] .= '|unique:users,username,' . ($this->id ?? 'NULL') . ',id';
                    break;
                case 'phone':
                    $dataValidate[$key] .= '|phone:AUTO,ID';
                    break;
            }
        }

        return $dataValidate;
    }

    public function messages(): array
    {
        return [
            'role.required' => __("Select Role First"),
            'division_id.required' => __("Select Division First"),
        ];
    }
        
}
