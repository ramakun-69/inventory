import { usePage } from "@inertiajs/react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import "../../../css//print.css";
import { toDateString } from "../../helper";
const ItemReceivePrint = forwardRef(({ itemRequest }, ref) => {
    const { t } = useTranslation();
    const { settings } = usePage().props;

    return (
        <div
            ref={ref}
            className="p-5"
            style={{
                fontFamily: "Arial, sans-serif",
                color: "#000",
                fontSize: "14px",
                lineHeight: "1.5",
            }}
        >
            {/* === KOP SURAT RESMI === */}
            <div className="mb-4" style={{ textAlign: "center" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "40px",
                    }}
                >
                    {settings?.logo && (
                        <img
                            src={
                                settings.logo
                                    ? `/storage/${settings.logo}`
                                    : "assets/images/favicon.png"
                            }
                            alt="Logo"
                            style={{
                                height: "90px",
                                width: "90px",
                                objectFit: "contain",
                            }}
                        />
                    )}
                    <div>
                        <h5 style={{ margin: 0, fontWeight: "bold" }}>
                            {settings?.company_name?.toUpperCase() || "NAMA PERUSAHAAN"}
                        </h5>
                        <p style={{ margin: 0, fontSize: "13px" }}>
                            {settings?.address || "Alamat Perusahaan, Kota, Kode Pos"}
                        </p>
                        {settings?.email && (
                            <p style={{ margin: 0, fontSize: "12px" }}>
                                Email: {settings.email}
                            </p>
                        )}
                    </div>
                </div>
                <div
                    style={{
                        borderTop: "2px solid #000",
                        margin: "8px 0 1px 0",
                        width: "100%",
                    }}
                ></div>
                <div
                    style={{
                        borderTop: "1px solid #000",
                        margin: "0 0 15px 0",
                        width: "100%",
                    }}
                ></div>
            </div>

            {/* === JUDUL FORM === */}
            <div className="text-center mb-40">
                <h4 style={{ fontWeight: "bold", textDecoration: "underline" }}>
                    {t("Item Receive Form")}
                </h4>
            </div>

            {/* === DETAIL PERMINTAAN === */}
            <div className="mb-4" style={{ maxWidth: "600px" }}>
                <table style={{ width: "100%" }}>
                    <tbody>
                        <tr>
                            <td style={{ width: "35%", fontWeight: "bold" }}>
                                {t("Request Number")}
                            </td>
                            <td>: {itemRequest.request_number}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>{t("Requested By")}</td>
                            <td>: {itemRequest?.user?.name}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>{t("Division")}</td>
                            <td>: {itemRequest?.user?.division?.name}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>{t("Position")}</td>
                            <td>: {itemRequest?.user?.position}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>{t("Request Date")}</td>
                            <td>: {toDateString(itemRequest.request_date)}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: "bold" }}>{t("Purpose")}</td>
                            <td>: {itemRequest.purpose || "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* === TABEL ITEM === */}
            <table
                className="table table-bordered"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "10px",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>
                        <th style={{ border: "1px solid #000", width: "5%" }}>No</th>
                        <th style={{ border: "1px solid #000" }}>{t("Item")}</th>
                        <th style={{ border: "1px solid #000", width: "15%" }}>
                            {t("Quantity")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {itemRequest.items?.length > 0 ? (
                        itemRequest.items.map((item, i) => (
                            <tr key={item.id}>
                                <td
                                    style={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                    }}
                                >
                                    {i + 1}
                                </td>
                                <td style={{ border: "1px solid #000", paddingLeft: "8px" }}>
                                    {item.name}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid #000",
                                        textAlign: "center",
                                    }}
                                >
                                    {`${item?.quantity} ${item?.unit}`}
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                style={{
                                    border: "1px solid #000",
                                    textAlign: "center",
                                    padding: "10px",
                                }}
                            >
                                {t("No items available")}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* === TANDA TANGAN === */}
            <div
                className="mt-5 d-flex justify-content-end text-center"
                style={{
                    marginTop: "60px",
                }}
            >
                <div style={{ width: "45%" }}>
                    <p>{t("Received By")}</p>
                    <div style={{ height: "60px" }}></div> {/* Ruang tanda tangan */}
                    <p style={{ fontWeight: "bold"}}>
                        .................................
                    </p>
                </div>
            </div>

        </div>
    );
});

export default ItemReceivePrint;
