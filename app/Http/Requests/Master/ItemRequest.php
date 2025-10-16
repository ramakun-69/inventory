<?php

namespace App\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;

class ItemRequest extends FormRequest
{

    protected $fill = [
        'id' => 0,
        'item_name' => 1,
        'item_code' => 1,
        'category_id' => 1,
        'unit_id' => 1,
        'stock' => 1,
        'image' => 0,
        'description' => 0,
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
                case 'item_code':
                    $dataValidate[$key] .= '|unique:items,item_code,' . ($this->id ?? 'NULL') . ',id';
                    break;
                case 'stock':
                    $dataValidate[$key] .= '|numeric|min:0';
                    break;
                case 'image':
                    $dataValidate[$key] .= '|image|mimes:jpeg,png,jpg,gif,svg|max:10240';
                    break;
            }
        }

        return $dataValidate;
    }

    public function messages()
    {
        return [
            'category_id.required' => __("Select Category First"),
            'unit_id.required' => __("Select Unit First"),
            'supplier_id.required' => __("Select Supplier First"),
            'stock.numeric' => __("Stock must be a number"),
            'stock.min' => __("Stock must be at least 0"),
            'image.image' => __("File must be an image"),
            'image.mimes' => __("Image must be a file of type: jpeg, png, jpg, gif, svg"),
            'image.max' => __("Image size must be less than 10MB"),
        ];
    }
}
