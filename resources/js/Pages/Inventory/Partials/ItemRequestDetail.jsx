import { useTranslation } from "react-i18next";
import { toDateString } from "../../../helper";
import Button from "../../../src/components/ui/Button";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ItemRequestPrint from "../../Print/ItemRequestPrint";
import ItemReceivePrint from "../../Print/ItemReceivePrint";

export default function ItemRequestDetail({ itemRequest }) {
    const { t } = useTranslation();
    const printRef = useRef();

    // Satu state untuk data + tipe dokumen
    const [printConfig, setPrintConfig] = useState({
        type: null,
        data: null,
    });

    // satu handler print universal
    const handlePrint = (type) => (e) => {
        e.preventDefault();
        setPrintConfig({ type, data: itemRequest });
    };

    // useReactToPrint cukup satu kali
    const printHandler = useReactToPrint({
        contentRef: printRef,
        documentTitle: () => {
            const prefix =
                printConfig.type === "request"
                    ? t("Item Request Form")
                    : t("Item Receive Form");
            return `${prefix} - ${itemRequest.request_number}`;
        },
        onAfterPrint: () => setPrintConfig({ type: null, data: null }),
    });

    // ketika printConfig berubah dan sudah ada data + ref, langsung cetak
    useEffect(() => {
        if (printConfig.data && printRef.current) {
            printHandler();
        }
    }, [printConfig]);

    return (
        <div className="container-fluid p-3">
            {/* HEADER */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary">
                    <h5 className="text-white mb-0">{t("Details")}</h5>
                </div>
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Request Number")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{itemRequest.request_number}</div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Requested By")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{itemRequest?.user?.name}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Division")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{itemRequest?.user?.division?.name}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Position")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{itemRequest?.user?.position}</div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Request Date")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{toDateString(itemRequest.request_date)}</div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Status")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">
                            <span
                                className={`badge ${itemRequest.status === "Pending"
                                        ? "bg-warning text-dark"
                                        : itemRequest.status === "Approved"
                                            ? "bg-success"
                                            : itemRequest.status === "Rejected"
                                                ? "bg-danger"
                                                : "bg-secondary"
                                    }`}
                            >
                                {t(itemRequest.status ?? "-")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ITEM TABLE */}
            <div className="card shadow-sm mt-3">
                <div className="card-header bg-secondary">
                    <h6 className="mb-0 text-white">{t("Items List")}</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "50px" }}>#</th>
                                    <th>{t("Item Name")}</th>
                                    <th style={{ width: "150px" }}>{t("Quantity")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemRequest.items?.length > 0 ? (
                                    itemRequest.items.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{`${item?.quantity} ${item?.unit || ""}`}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center text-muted">
                                            {t("No items found")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="d-flex flex-wrap align-items-center gap-3 mt-40">
                <Button
                    type="button"
                    onClick={handlePrint("request")}
                    className="btn btn-sm btn-secondary radius-8 px-20 py-11 d-flex align-items-center gap-2"
                >
                    <Icon icon="mdi:printer" /> {t("Print Item Request Form")}
                </Button>

                <Button
                    type="button"
                    onClick={handlePrint("receive")}
                    className="btn btn-sm btn-success radius-8 px-20 py-11 d-flex align-items-center gap-2"
                >
                    <Icon icon="mdi:printer-check" /> {t("Print Item Receive Form")}
                </Button>
            </div>

            {/* HIDDEN PRINT AREA */}
            <div style={{ position: "absolute", top: "-9999px", visibility: "hidden" }}>
                {printConfig.type === "request" && (
                    <ItemRequestPrint ref={printRef} itemRequest={printConfig.data} />
                )}
                {printConfig.type === "receive" && (
                    <ItemReceivePrint ref={printRef} itemRequest={printConfig.data} />
                )}
            </div>
        </div>
    );
}
