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
export default function ItemReport({ categories }) {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    // Pagination states
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isExporting, setIsExporting] = useState(false)
    const { data, setData } = useForm({
        category_id: '',
    });
    const { category_id: categoryId } = data;

    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.item-report'), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                category_id: categoryId,
            },
        }).then((res) => {
            setTableData(res.data.data);
            setTotalRows(res.data.total);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, categoryId]);
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
            name: t('Item Code'),
            selector: row => row.item_code,
            sortable: true,
        },
        {
            name: t('Name'),
            selector: row => row.name,
            sortable: true,
        },
        {
            name: t('Category'),
            selector: row => row.category.name,
            sortable: true,
        },
        {
            name: t('Stock'),
            selector: row => `${row.stock} ${row?.unit?.name}`,
            sortable: true,
        },
    ];

    const handleExport = async () => {
        try {
            setIsExporting(true); // mulai animasi

            const response = await axios.post(route("report.items.export"), {
                category_id: categoryId,
            }, {
                responseType: "blob", // penting, letakkan di sini, bukan di body
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${t('Item Report')}.xlsx`);
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
            <Breadcrumb title={t('Report')} subtitle={t('Item Report')} />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 d-flex justify-content-start mb-50 gap-3">
                                <div className="col-md-4">
                                    <label htmlFor="category_id" className="form-label">{t('Category')}</label>
                                    <Select
                                        id="category_id"
                                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                                        onChange={(option) => {
                                            setData('category_id', option ? option.value : '');
                                        }}
                                        placeholder={t('Select Category')}
                                        isSearchable={true}
                                        isClearable={true}
                                        value={categories.map(c => ({ value: c.id, label: c.name }))
                                            .find(option => option.value === categoryId) || null
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