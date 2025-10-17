<?php

namespace App\Http\Requests\Inventory;

use App\Models\Item;
use Illuminate\Foundation\Http\FormRequest;

class ItemRequest extends FormRequest
{
    protected $fill = [
        'id' => 0,
        'items' => 1,
        'purpose' => 1,
    ];

    public function authorize(): bool
    {
        return true;
    }

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
                    $rules["{$key}.*.quantity"] = [
                        'required',
                        'numeric',
                        'min:1',
                        function ($attribute, $value, $fail) {
                            // Ambil index dari "items.X.quantity"
                            $index = explode('.', $attribute)[1];
                            $itemId = $this->input("items.$index.item_id");

                            if ($itemId) {
                                $stock = Item::where('id', $itemId)->value('stock');

                                if ($stock !== null && $value > $stock) {
                                    $fail(__("Quantity cannot exceed available stock (:stock)", ['stock' => $stock]));
                                }
                            }
                        }
                    ];
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
            'items.*.quantity.required' => __("Quantity is required"),
            'items.*.quantity.min' => __("Quantity must be at least 1"),
            'purpose.required' => __("Purpose is required"),
        ];
    }
}
