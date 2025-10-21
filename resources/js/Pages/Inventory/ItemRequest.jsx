import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EditButton from "../../src/components/datatable/EditButton";
import DeleteButton from "../../src/components/datatable/DeleteButton";
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import Search from "../../src/components/datatable/Search";
import DataTable from "react-data-table-component";
import Loading from "../../src/components/datatable/Loading";
import Modal from "../../src/components/ui/Modal";
import { useForm } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import Button from "../../src/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRole } from "../../src/hook/useRole";
import ItemRequestForm from "./Partials/ItemRequetsForm";
import ItemRequestDetail from "./Partials/ItemRequestDetail";
export default function ItemRequest({ items }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState({
        show: false,
        title: "",
        onSave: () => { },
        detail: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, put, processing, errors, clearErrors, reset, transform } = useForm({
        id: null,
        purpose: "",
        items: [{ item_id: "", quantity: "" }],
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
        axios.get(route('datatable.item-requests'), {
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
    const { hasAnyRole } = useRole();
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
            name: t('Request Number'),
            selector: row => row.request_number,
            sortable: true,
        },
        {
            name: t('Requested By'),
            selector: row => row?.user?.name,
            sortable: true,
        },
        {
            name: t('Purpose'),
            selector: row => row?.purpose,
            sortable: true,
        },
        {
            name: t('Status'),
            selector: row => {
                const status = row.status ?? '-';
                if (status === 'Pending') {
                    return <span className="badge bg-warning">{t('Pending')}</span>;
                } else if (status === 'Approved') {
                    return <span className="badge bg-success">{t('Approved')}</span>;
                } else if (status === 'Rejected') {
                    return <span className="badge bg-danger">{t('Rejected')}</span>;
                } else {
                    return <span className="badge bg-secondary">{status}</span>;
                }
            },
            sortable: true,
        },
        {
            name: t('Actions'),
            cell: (row) => {
                const viewButton = (
                    <Button
                        type="button"
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleShowModal(row, { detail: true })}
                    >
                        <Icon icon="mdi:eye" width="20" height="20" className="me-2" />
                    </Button>
                );

                const actionButtons = [];

                // User yang Pending bisa edit & delete
                if (hasAnyRole('User') && row.status === 'Pending') {
                    actionButtons.push(
                        <EditButton key="edit" onClick={() => handleShowModal(row)} isLoading={isLoading} />,
                        <DeleteButton key="delete" onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                    );
                }

                // Admin/Manager yang Pending bisa approve/reject
                if (hasAnyRole(['Admin', 'Manager']) && row.status === 'Pending') {
                    actionButtons.push(
                        <Button
                            key="approve"
                            type="button"
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleConfirmation(row.id, 'Approved')}
                        >
                            <Icon icon="mdi:check" className="me-2" width="20" height="20" />
                        </Button>,
                        <Button
                            key="reject"
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleConfirmation(row.id, 'Rejected')}
                        >
                            <Icon icon="mdi:close" width="20" height="20" />
                        </Button>
                    );
                }

                return (
                    <>
                        {viewButton}
                        {actionButtons}
                    </>
                );
            },
            sortable: true,
        }
    ];


    const handleShowModal = (itemRequest = null, detail = false) => {
        setData({
            id: itemRequest?.id ?? null,
            purpose: itemRequest?.purpose ?? "",
            status: itemRequest?.status ?? "Pending",
            request_number: itemRequest?.request_number ?? null,
            user: itemRequest?.user ?? null,
            request_date: itemRequest?.request_date ?? "",
            items: Array.isArray(itemRequest?.items)
                ? itemRequest.items.map(item => ({
                    id: item.id ?? null,
                    item_id: item.item_id ?? item.id ?? null,
                    name: item.name ?? "",
                    quantity: item.quantity ?? item.pivot?.quantity ?? "",
                    unit: item?.unit?.name ?? "-",
                }))
                : [{ item_id: null, quantity: "" }],
        });

        setModal({
            show: true,
            title: detail
                ? t("Item Request Detail")
                : itemRequest
                    ? t("Edit Item Request")
                    : t("Add Item Request"),
            detail,
        });
    };

    const handleCloseModal = () => {
        setData({
            id: null,
            purpose: "",
            items: [{ item_id: null, quantity: "" }],
        });
        clearErrors();
        setModal(prev => ({ ...prev, show: false }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('inventory.item-requests.store'), {
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
            destroy(route('inventory.item-requests.destroy', id), {
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

    const handleConfirmation = (id, status) => {
        confirmAlert(t('Are You Sure?'), t('confirm_description'), 'warning', () => {
            transform(data => ({ ...data, id, status }));
            put(route('inventory.item-requests.confirm', id), {
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
                <Breadcrumb title={t('Item Requests')} subtitle={t('Item Request List')} />
                <div className="container">
                    {hasAnyRole('User') && (
                        <div className="d-flex justify-content-end mb-3">
                            <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                                <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                                {t('Add Item Request')}
                            </Button>
                        </div>
                    )}
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
                    <div className="row mb-3">
                        {modal.detail ? (
                            <ItemRequestDetail itemRequest={data} />
                        ) : (
                            <ItemRequestForm
                                items={items}
                                errors={errors}
                                data={data}
                                setData={setData}
                                clearErrors={clearErrors}
                            />

                        )}
                    </div>

                </Modal>
            </AppLayout>
        </>
    );
}