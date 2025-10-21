import Select from "react-select";
import Button from "../../../src/components/ui/Button";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import TextInput from "../../../src/components/ui/TextInput";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ItemRequestForm({ items, errors, data, setData, clearErrors }) {
    const { t } = useTranslation();
    // Tambah baris baru
    const addRow = () => {
        setData("items", [...data.items, { uid: crypto.randomUUID(), item_id: null, quantity: "" }]);
    };

    // Hapus baris
    const removeRow = (index) => {
        const updated = data.items.filter((_, i) => i !== index);
        setData("items", updated);
    };

    // Handle perubahan field
    const handleChange = (index, field, value) => {
        clearErrors(`items.${index}.${field}`);
        const updated = [...data.items];
        updated[index][field] = value;
        setData("items", updated);
    };
    return (
        <div className="space-y-5">
            {/* PURPOSE */}
            <div className="mb-4">
                <label className="form-label fw-semibold">{t("Purpose")}</label>
                <TextInput
                    type="text"
                    value={data.purpose}
                    onChange={(e) => setData("purpose", e.target.value)}
                    className="form-control"
                    placeholder={t("Enter Attribute", { attribute: t("Purpose") })}
                    errorMessage={errors?.purpose}
                />
            </div>

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
                        <div className="row">
                            {/* ITEM */}
                            <div className="col-md-5">
                                <label className="form-label text-gray-600">{t("Item")}</label>
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
                                    <small className="text-danger">{errors[`items.${index}.item_id`]}</small>
                                )}
                            </div>

                            {/* JUMLAH */}
                            <div className="col-md-4">
                                <label className="form-label text-gray-600">{t("Quantity")}</label>
                                <TextInput
                                    type="number"
                                    value={row.quantity}
                                    onKeyDown={(e) => {
                                        if (["e", "-", "+"].includes(e.key)) e.preventDefault();
                                    }}

                                    onChange={(e) => {
                                        const num = Number(e.target.value);
                                        const selectedItem = items.find(opt => opt.id === row.item_id);
                                        const maxStock = selectedItem?.stock ?? Infinity;

                                        // batasi agar tidak melebihi stok
                                        const safeValue = num > maxStock ? maxStock : num;
                                        handleChange(index, "quantity", safeValue);
                                    }}
                                    className="form-control"
                                    placeholder={t("Enter Attribute", { attribute: t("Quantity") })}
                                    min="1"
                                    errorMessage={errors?.[`items.${index}.quantity`]}
                                />
                            </div>

                            {/* TOMBOL AKSI */}
                            <div className={`col-md-3 d-flex gap-2 align-items-center ${index > 0 ? 'mt-40' : 'mt-40'}`}>
                                {index === data.items.length - 1 && (
                                    <Button
                                        type="button"
                                        className="btn btn-primary d-flex align-items-center justify-content-center"
                                        onClick={addRow}
                                    >
                                        <Icon icon="line-md:plus" width="20" height="20" />
                                    </Button>
                                )}
                                {index > 0 && (
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
