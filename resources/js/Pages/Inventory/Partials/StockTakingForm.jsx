import Select from "react-select";
import Button from "../../../src/components/ui/Button";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import TextInput from "../../../src/components/ui/TextInput";
import { Icon } from "@iconify/react";

export default function StockTakingForm({ items, errors, data, setData, clearErrors }) {
    const { t } = useTranslation();

    // === Tambah baris baru ===
    const addRow = () => {
        setData("items", [
            ...data.items,
            {
                uid: crypto.randomUUID(),
                item_id: null,
                system_stock: "",
                actual_stock: "",
                difference: "",
            },
        ]);
    };

    // === Hapus baris ===
    const removeRow = (index) => {
        const updated = data.items.filter((_, i) => i !== index);
        setData("items", updated);
    };

    // === Handle perubahan field ===
    const handleChange = (index, field, value) => {
        clearErrors(`items.${index}.${field}`);
        const updated = [...data.items];

        updated[index][field] = value;

        // Jika field item_id berubah → isi stok sistem otomatis
        if (field === "item_id") {
            const selectedItem = items.find((i) => i.id === value);
            updated[index].system_stock = selectedItem?.stock || 0;
        }

        // Hitung selisih otomatis, baik system_stock maupun actual_stock berubah
        const system = parseInt(updated[index].system_stock || 0, 10);
        const actual = parseInt(updated[index].actual_stock || 0, 10);
        updated[index].difference = actual - system;

        setData("items", updated);
    };

    return (
        <div className="space-y-5">
            <h6 className="fw-bold mt-3">{t("Item List")}</h6>
            {/* FORM BARANG */}
            <AnimatePresence>
                {data.items.map((row, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="bg-light p-3 rounded-3 mb-3"
                    >
                        <div className="row g-3 align-items-end">
                            {/* ITEM */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-gray-700">
                                    {t("Item")}
                                </label>
                                <Select
                                    options={items}
                                    getOptionLabel={(item) => item.name}
                                    getOptionValue={(item) => item.id}
                                    value={items.find(opt => opt.id === row.item_id) || null}
                                    onChange={(val) => handleChange(index, "item_id", val?.id || null)}
                                    placeholder={t("Select Item")}
                                    isClearable
                                    isSearchable
                                />
                                {errors?.[`items.${index}.item_id`] && (
                                    <small className="text-danger">
                                        {errors[`items.${index}.item_id`]}
                                    </small>
                                )}
                            </div>

                            {/* STOK SISTEM */}
                            <div className="col-md-2">
                                <label className="form-label fw-semibold text-gray-700">
                                    {t("System Stock")}
                                </label>
                                <TextInput
                                    type="number"
                                    value={row.system_stock}
                                    readOnly
                                    className="form-control bg-secondary-subtle text-center"
                                />
                            </div>

                            {/* STOK FISIK */}
                            <div className="col-md-2">
                                <label className="form-label fw-semibold text-gray-700">
                                    {t("Actual Stock")}
                                </label>
                                <TextInput
                                    type="number"
                                    value={row.actual_stock}
                                    onKeyDown={(e) => {
                                        if (["e", "-", "+"].includes(e.key)) e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        let numberOnly = e.target.value.replace(/\D/, "");
                                        handleChange(index, "actual_stock", numberOnly);
                                    }}
                                    className="form-control text-center"
                                    placeholder={t("Enter Attribute", { attribute: t("Actual Stock") })}
                                />
                                {errors?.[`items.${index}.actual_stock`] && (
                                    <small className="text-danger">
                                        {errors[`items.${index}.actual_stock`]}
                                    </small>
                                )}
                            </div>

                            {/* SELISIH */}
                            <div className="col-md-2">
                                <label className="form-label fw-semibold text-gray-700">
                                    {t("Difference")}
                                </label>
                                <TextInput
                                    type="number"
                                    value={row.difference || 0}
                                    readOnly
                                    className={`form-control text-center ${row.difference > 0
                                        ? "text-success"
                                        : row.difference < 0
                                            ? "text-danger"
                                            : ""
                                        }`}
                                />
                            </div>

                            {/* AKSI */}
                            <div className="col-md-2 d-flex gap-2">
                                {index === data.items.length - 1 && (
                                    <Button
                                        type="button"
                                        className="btn btn-primary d-flex align-items-center justify-content-center"
                                        onClick={addRow}
                                    >
                                        <Icon icon="line-md:plus" width="20" height="20" />
                                    </Button>
                                )}
                                {data.items.length > 1 && (
                                    <Button
                                        type="button"
                                        className="btn btn-danger d-flex align-items-center justify-content-center"
                                        onClick={() => removeRow(index)}
                                    >
                                        <Icon icon="line-md:close" width="20" height="20" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
