import { useTranslation } from "react-i18next";
import { toDateString } from "../../../helper";


export default function StockEntryDetail({ stockEntry }) {
    const { t } = useTranslation();

    return (
        <div className="container-fluid p-3">
            {/* HEADER */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary">
                    <h5 className="text-white mb-0">{t("Details")}</h5>
                </div>
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Entry Number")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{stockEntry.entry_number}</div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Created By")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{stockEntry?.user?.name}</div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-md-3 fw-semibold">{t("Entry Date")}</div>
                        <div className="col-md-1 text-end">:</div>
                        <div className="col-md-8">{toDateString(stockEntry.entry_date)}</div>
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
                                {stockEntry.items?.length > 0 ? (
                                    stockEntry.items.map((item, index) => (
                                        console.log(item),
                                        <tr key={item.item_id || index}>
                                            <td>{index + 1}</td>
                                            <td>{item.item_name}</td>
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

        </div>
    );
}
