import { Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import Button from "../../src/components/ui/Button";
import DataTable from "react-data-table-component";
import Search from "../../src/components/datatable/Search";
import Modal from "../../src/components/ui/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import Loading from "../../src/components/datatable/Loading";
import axios from "axios";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import ShowButton from "../../src/components/datatable/ShowButton";
import DeleteButton from "../../src/components/datatable/DeleteButton";
import { toDateString } from "../../helper";
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import StockEntryForm from "./Partials/StockEntryForm";
import StockEntryDetail from "./Partials/StockEntryDetail";


export default function StockEntry({ items, suppliers }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState({
        show: false,
        title: "",
        onSave: () => { },
        processing: false,
        detail: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, processing, errors, clearErrors, reset } = useForm({
        id: null,
        items: [{ item_id: null, supplier_id: null, quantity: 0 }],
    });
    const [tableData, setTableData] = useState([]);
    // Pagination states
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Search state
    const [search, setSearch] = useState('');
    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.stock-entries'), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                search: search,
            },
        }).then((res) => {
            setTableData(res.data.data);
            setTotalRows(res.data.total);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, search]);
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
            selector: row => row.entry_number,
            sortable: true,
        },
        {
            name: t('Entry Date'),
            selector: row => toDateString(row?.entry_date),
            sortable: true,
        },

        {
            name: t('Added By'),
            selector: row => row?.user?.name,
            sortable: true,
        },

        {
            name: t('Actions'),
            cell: (row) => (
                <>
                    <ShowButton onClick={() => handleShowModal(row, true)} isLoading={isLoading} />
                    <DeleteButton onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                </>
            ),
            sortable: true,
        }
    ];

    const handleShowModal = (stock_entry = null, detail = false) => {
        setData({
            id: stock_entry?.id ?? null,
            entry_number: stock_entry?.entry_number ?? null,
            user: stock_entry?.user ?? null,
            entry_date: stock_entry?.entry_date ?? "",
            items:stock_entry?.details?.length > 0 ? stock_entry.details.map(detail => ({
                    id: detail?.id ?? null,
                    item_id: detail?.item_id ?? null,
                    item_name : detail?.item?.name,
                    quantity: detail?.quantity ?? 0,
                    unit : detail?.item?.unit?.name ?? "",
                    supplier_id: detail?.supplier_id ?? null,
                }))
                : [{ item_id: null, quantity: "", supplier_id: null }],
        });

        setModal({
            show: true,
            title: detail
                ? t("Stock Entry Detail")
                : stock_entry
                    ? t("Edit Stock Entry")
                    : t("Add Stock Entry"),
            detail,
        });
    }
    const handleCloseModal = () => {
        clearErrors();
        setModal(prev => ({ ...prev, show: false }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('inventory.stock-entries.store'), {
            onSuccess: (page) => {
                const error = page.props?.flash?.error;
                const success = page.props?.flash?.success;
                reset();
                handleCloseModal();
                if (error) notifyError(error, 'bottom-center');
                notifySuccess(success, 'bottom-center');
                loadTableData();

            },
        });
    }

    const handleDelete = (id) => {
        confirmAlert(t('Are You Sure?'), t('delete_description'), 'warning', () => {
            destroy(route('inventory.stock-entries.destroy', id), {
                onSuccess: (page) => {
                    const error = page.props?.flash?.error;
                    const success = page.props?.flash?.success;
                    if (error) notifyError(error, 'bottom-center');
                    notifySuccess(success, 'bottom-center');
                    loadTableData();

                },
            });
        });
    }
    return (
        <>
            <AppLayout>
                <Breadcrumb title={t('Stock Entry')} subtitle={t('Stock Entry Management')} />
                <div className="container">
                    <div className="d-flex justify-content-end mb-3">
                        <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                            <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                            {t('Add Stock Entry')}
                        </Button>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 d-flex justify-content-end">
                                    <div className="col-md-4">
                                        <Search search={search} setSearch={setSearch} />
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
                                        ) : search && tableData.length === 0 ? (
                                            t('datatable.zeroRecords')
                                        ) : (
                                            t('datatable.emptyTable')
                                        )
                                        }
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

                <Modal
                    show={modal.show}
                    onClose={handleCloseModal}
                    title={modal.title}
                    onSave={handleSubmit}
                    processing={processing}
                    size="xl"
                >
                    {modal.detail ? (
                        <StockEntryDetail stockEntry={data} />
                    ) : (
                        <StockEntryForm items={items} suppliers={suppliers} data={data} setData={setData} errors={errors} clearErrors={clearErrors} />
                    )}
                </Modal>
            </AppLayout>
        </>
    )

}