<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingsRequest extends FormRequest
{

    protected $fill = [
        'company_name' => 1,
        'email' => 1,
        'phone' => 1,
        'address' => 1,
        'logo' => 0,
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
                case 'logo':
                    $dataValidate[$key] .= '|image|max:10248';
                    break;
                case 'phone':
                    $dataValidate[$key] .= '|phone:AUTO,ID';
                    break;
                case 'email':
                    $dataValidate[$key] .= '|email:dns';
                    break;
            }
        }
        return $dataValidate;
    }
}
