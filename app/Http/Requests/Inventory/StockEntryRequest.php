<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StockEntryRequest extends FormRequest
{
    protected $fill =
    [
        'id' => 0,
        'item_id' => 1,
        'supplier_id' => 1,
        'quantity' => 1,

    ];
    /**
     * Determine if the user is authorized to make this request.
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
                case 'quantity':
                    $dataValidate[$key] .= '|numeric|min:1';
                    break;
            }
        }

        return $dataValidate;
    }

    public function messages()
    {
        return [
            'item_id.required' => __("Select Item First"),
            'supplier_id.required' => __("Select Supplier First"),
            'quantity.numeric' => __("Quantity must be a number"),
            'quantity.min' => __("Quantity must be at least 1"),
        ];
    }
}
