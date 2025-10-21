import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import DataTable from "react-data-table-component";
import Loading from "../../src/components/datatable/Loading";
import axios from "axios";
import Select from "react-select";
import { useForm } from "@inertiajs/react";
import Button from "../../src/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { notifyError } from "../../src/components/ui/Toastify";
import TextInput from "../../src/components/ui/TextInput";
import { toDateString } from "../../helper";
export default function StockEntryReport({ suppliers }) {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    // Pagination states
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isExporting, setIsExporting] = useState(false)
    const { data, setData } = useForm({
        start_date: '',
        end_date: '',
        supplier_id: '',
    });
    const { start_date: startDate, end_date: endDate, supplier_id: supplierId } = data;

    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.stock-entry-report'), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                start_date: startDate,
                end_date: endDate,
                supplier_id: supplierId,
            },
        }).then((res) => {
            setTableData(res.data.data);
            setTotalRows(res.data.total);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, endDate, supplierId]);
    const COLUMN = [
        {
            name: 'No',
            cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            sortable: true,
            width: '100px',
            style: {
                textAlign: 'center',
            },
        },
        {
            name: t('Entry Number'),
            selector: row => row?.entry?.entry_number,
            sortable: true,
        },
        {
            name: t('Item'),
            selector: row => row?.item?.name,
            sortable: true,
        },

        {
            name: t('Quantity'),
            selector: row => row.quantity,
            sortable: true,
        },

        {
            name: t('Supplier'),
            selector: row => row?.supplier?.name,
            sortable: true,
        },
        {
            name: t('Entry Date'),
            selector: row => toDateString(row?.entry?.entry_date),
            sortable: true,
        },

        {
            name: t('Added By'),
            selector: row => row?.entry?.user?.name,
            sortable: true,
        },
    ];

    const handleExport = async () => {
        try {
            setIsExporting(true); // mulai animasi

            const response = await axios.post(route("report.stock-entries.export"), {
                start_date: startDate,
                end_date: endDate,
                supplier_id: supplierId,
            }, {
                responseType: "blob", // penting, letakkan di sini, bukan di body
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${t('Stock Entry Report')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            notifyError(error.response?.data?.message || error.message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AppLayout>
            <Breadcrumb title={t('Report')} subtitle={t('Stock Entry Report')} />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 d-flex justify-content-start mb-50 gap-3">
                                <div className="col-md-3">
                                    <label htmlFor="start_date" className="form-label">{t('From')}</label>
                                    <TextInput
                                        type="date"
                                        id="start_date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setData('start_date', e.target.value);
                                        }}
                                        placeholder={t('Enter Start Date')}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="end_date" className="form-label">{t('To')}</label>
                                    <TextInput
                                        type="date"
                                        id="end_date"
                                        value={endDate}
                                        disabled={!startDate}
                                        onChange={(e) => {
                                            setData('end_date', e.target.value);
                                        }}
                                        placeholder={t('Enter End Date')}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="supplier_id" className="form-label">{t('Supplier')}</label>
                                    <Select
                                        id="supplier_id"
                                        options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                                        onChange={(option) => {
                                            setData('supplier_id', option ? option.value : '');
                                        }}
                                        placeholder={t('Select Supplier')}
                                        isSearchable={true}
                                        isClearable={true}
                                        value={suppliers.map(s => ({ value: s.id, label: s.name }))
                                            .find(option => option.value === supplierId) || null
                                        }
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <Button type="button" className="btn btn-primary btn-sm mb-1" onClick={handleExport} isLoading={isExporting} >
                                        <Icon icon="mdi:file-excel" className="me-2" width="20" height="20" />
                                        {t('Export')}
                                    </Button>
                                </div>
                            </div>
                            <div className="col-12">
                                <DataTable
                                    className="table-responsive"
                                    columns={COLUMN}
                                    data={tableData}
                                    progressPending={isLoading}
                                    noDataComponent={isLoading ? (
                                        <Loading />
                                    ) : tableData.length === 0 ? (
                                        t('datatable.zeroRecords')
                                    ) : (
                                        t('datatable.emptyTable')
                                    )}
                                    searchable
                                    defaultSortField="name"
                                    progressComponent={<Loading />}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    paginationPerPage={rowsPerPage}
                                    onChangePage={page => setCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setRowsPerPage(newPerPage);
                                        setCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    persistTableHead
                                    striped />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}