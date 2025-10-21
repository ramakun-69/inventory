<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StockTakingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    protected $fill = [
        'id' => 0,
        'items' => 1,
    ];
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

        foreach ($this->fill as $key => $isRequired) {
            if ($this->has($key)) {
                $trimmed[$key] = is_string($this->input($key))
                    ? trim($this->input($key))
                    : $this->input($key);
            }
        }

        $this->merge($trimmed);
    }

    public function rules(): array
    {
        $rules = [];

        foreach ($this->fill as $key => $isRequired) {
            $rules[$key] = $isRequired ? 'required' : 'nullable';

            switch ($key) {
                case 'items':
                    // validasi array items
                    $rules[$key] .= '|array|min:1';
                    $rules["{$key}.*.item_id"] = 'required|exists:items,id';
                    $rules["{$key}.*.actual_stock"] = 'required|numeric|min:0';
                    break;
            }
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'items.required' => __("Please add at least one item"),
            'items.min' => __("Please add at least one item"),
            'items.*.item_id.required' => __("Item is required"),
            'items.*.actual_stock.required' => __("Actual stock is required"),
            'items.*.actual_stock.min' => __("Actual stock must be at least 0"),
            'purpose.required' => __("Purpose is required"),
        ];
    }
}
