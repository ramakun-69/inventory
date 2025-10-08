import { useForm } from "@inertiajs/react";
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
import EditButton from "../../src/components/datatable/EditButton";
import DeleteButton from "../../src/components/datatable/DeleteButton";
import { toDateString } from "../../helper";
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import StockTakingForm from "./Partials/StockTakingForm";


export default function StockTaking({ items }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState({
        show: false,
        title: "",
        onSave: () => { },
        detail: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, processing, errors, clearErrors, reset } = useForm({
        id: null,
        items: [{ item_id: '', system_stock: 0, actual_stock: 0, difference: 0 }],
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
        axios.get(route('datatable.stock-takings'), {
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
            name: t('Stock Taking Number'),
            selector: row => row.stock_taking_number,
            sortable: true,
        },
        {
            name: t('Stock Taking Date'),
            selector: row => toDateString(row?.date),
            sortable: true,
        },

        {
            name: t('Conducted By'),
            selector: row => row?.user?.name,
            sortable: true,
        },

        {
            name: t('Actions'),
            cell: (row) => (
                <>
                    <EditButton onClick={() => handleShowModal(row)} isLoading={isLoading} />
                    <DeleteButton onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                </>
            ),
            sortable: true,
        }
    ];

    const handleShowModal = (stock_taking = null, detail = false) => {
        setData({
            id: stock_taking?.id ?? null,
            stock_taking_number: stock_taking?.stock_taking_number ?? "",
            stock_taking_date: stock_taking?.stock_taking_date ?? "",
            user: stock_taking?.user ?? null,
            items: stock_taking?.details?.length > 0 ? stock_taking.details.map(detail => ({
                item_id: detail.item_id,
                item_name: detail.item?.name,
                system_stock: detail.system_stock,
                actual_stock: detail.actual_stock,
                difference: detail.difference,
            })) : [{ item_id: '', system_stock: 0, actual_stock: 0, difference: 0 }]
        });
        console.log(detail);
        setModal({
            show: true,
            title: detail
                ? t("Stock Taking Detail")
                : stock_taking
                    ? t("Edit Stock Taking")
                    : t("Add Stock Taking"),
            detail,
        });
    }
    const handleCloseModal = () => {
        setData({
            id: null,
            items: [{ item_id: '', system_stock: 0, actual_stock: 0, difference: 0 }],
        });
        clearErrors();
        setModal(prev => ({ ...prev, show: false }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('inventory.stock-takings.store'), {
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
            destroy(route('inventory.stock-takings.destroy', id), {
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
                <Breadcrumb title={t('Stock Taking')} subtitle={t('Stock Taking Management')} />
                <div className="container">
                    <div className="d-flex justify-content-end mb-3">
                        <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                            <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                            {t('Add Stock Taking')}
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
                    size="lg"
                >
                    {modal.detail ? (
                        ""
                    ) : (
                        <StockTakingForm
                            items={items}
                            errors={errors}
                            data={data}
                            setData={setData}
                            clearErrors={clearErrors}
                        />

                    )}
                </Modal>
            </AppLayout>
        </>
    )

}