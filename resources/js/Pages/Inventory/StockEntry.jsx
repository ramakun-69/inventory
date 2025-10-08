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
import Select from "react-select"
import axios from "axios";
import TextInput from "../../src/components/ui/TextInput";
import ErrorMessage from "../../src/components/ui/ErrorMessage";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import EditButton from "../../src/components/datatable/EditButton";
import DeleteButton from "../../src/components/datatable/DeleteButton";
import { toDateString } from "../../helper";
import { confirmAlert } from "../../src/components/ui/SweetAlert";


export default function StockEntry({ items, suppliers }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState({
        show: false,
        title: "",
        onSave: () => { },
        processing: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, processing, errors, clearErrors, reset } = useForm({
        id: null,
        item_id: '',
        supplier_id: '',
        quantity: ''
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
                    <EditButton onClick={() => handleShowModal(row)} isLoading={isLoading} />
                    <DeleteButton onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                </>
            ),
            sortable: true,
        }
    ];

    const handleShowModal = (stock_entry = null) => {
        stock_entry ? setData({ ...stock_entry }) : reset();
        setModal({
            show: true,
            title: stock_entry ? t('Edit Stock Entry') : t('Add Stock Entry'),
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
                    size="lg"
                >
                    <div className="row mb-3">
                        <div className="col-6">
                            <label htmlFor="item_id" className="form-label">{t('Item')}</label>
                            <Select
                                id="item_id"
                                options={items.map(c => ({ value: c.id, label: c.name }))}
                                onChange={(option) => {
                                    clearErrors('item_id');
                                    setData('item_id', option ? option.value : '');
                                }}
                                placeholder={t('Select Item')}
                                isSearchable={true}
                                isClearable={true}
                                value={items.map(c => ({ value: c.id, label: c.name }))
                                    .find(option => option.value === data.item_id) || null
                                }
                            />
                            {errors.item_id && <ErrorMessage message={errors.item_id} />}
                        </div>
                        <div className="col-6">
                            <label htmlFor="supplier_id" className="form-label">{t('Supplier')}</label>
                            <Select
                                id="supplier_id"
                                options={suppliers.map(c => ({ value: c.id, label: c.name }))}
                                onChange={(option) => {
                                    clearErrors('supplier_id');
                                    setData('supplier_id', option ? option.value : '');
                                }}
                                placeholder={t('Select Supplier')}
                                isSearchable={true}
                                isClearable={true}
                                value={suppliers.map(c => ({ value: c.id, label: c.name }))
                                    .find(option => option.value === data.supplier_id) || null
                                }
                            />
                            {errors.supplier_id && <ErrorMessage message={errors.supplier_id} />}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <label htmlFor="quantity" className="form-label">{t('Quantity')}</label>
                            <TextInput
                                id="quantity"
                                type="number"
                                className="form-control"
                                autoComplete="off"
                                min={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    let onlyNums = e.target.value.replace(/[^0-9]/g, '');
                                    setData('quantity', onlyNums);
                                }}
                                placeholder={t('Enter Attribute', { 'attribute': t('Quantity') })}
                                value={data.quantity}
                                errorMessage={errors.quantity} />
                        </div>
                    </div>
                </Modal>
            </AppLayout>
        </>
    )

}