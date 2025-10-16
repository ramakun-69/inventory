import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import Search from "../../src/components/datatable/Search";
import Loading from "../../src/components/datatable/Loading";
import EditButton from "../../src/components/datatable/EditButton";
import DeleteButton from "../../src/components/datatable/DeleteButton";
import Button from "../../src/components/ui/Button";
import { useEffect, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import TextInput from "../../src/components/ui/TextInput";
import Modal from "../../src/components/ui/Modal";
import Select from 'react-select'
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import ErrorMessage from "../../src/components/ui/ErrorMessage";
import TextAreaInput from "../../src/components/ui/TextAreaInput";
import SingleFileUpload from "../../src/components/ui/SingleFileUpload";

export default function Item({ categories, units, suppliers }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [modal, setModal] = useState({
        show: false,
        title: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, processing, errors, clearErrors, reset } = useForm({
        id: null,
        item_code: '',
        item_name: '',
        category_id: '',
        unit_id: '',
        stock: '',
        description: '',
        image: null,
        image_url: null,
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
        axios.get(route('datatable.items'), {
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
            name: t('Image'),
            cell: (row) => (
                row.image_url ? (
                    <img src={row.image_url} alt={row.name} className="img-thumbnail" style={{ width: '50px', height: '50px' }} />
                ) : null
            ),
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

        {
            name: t('Actions'),
            cell: (row) => (
                <>
                    <EditButton onClick={() => handleShowModal(row)} isLoading={isLoading} />
                    {row.id !== auth.user.id && (
                        <DeleteButton onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                    )}
                </>
            ),
            sortable: true,
        }
    ];

    const handleShowModal = (item = null) => {
        item ? setData({ ...item, item_name: item.name }) : reset();
        console.log(item);
        setModal({
            show: true,
            title: item ? t('Edit Item') : t('Add New Item'),
        });
    }
    const handleCloseModal = () => {
        clearErrors();
        setModal(prev => ({ ...prev, show: false }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('master-data.items.store'), {
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
            destroy(route('master-data.items.destroy', id), {
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
        <AppLayout>
            <Breadcrumb title={t('Item')} subtitle={t('Item Management')} />
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                        <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                        {t('Add New Item')}
                    </Button>
                    <Link href={route('trash.items')} className="btn btn-sm btn-danger ms-2">
                        <Icon icon="line-md:trash" className="me-2" width="20" height="20" />
                        {t('Trash')}
                    </Link>
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


            {/* MODAL */}
            <Modal
                show={modal.show}
                onClose={handleCloseModal}
                title={modal.title}
                onSave={handleSubmit}
                processing={processing}
                size="xl"
                fullscreen={true}
            >
                <div className="row">
                    <div className="col-6 mb-3">
                        <label htmlFor="item_code" className="form-label">{t('Item Code')}</label>
                        <TextInput
                            id="item_code"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('item_code', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Item Code') })}
                            value={data.item_code}
                            errorMessage={errors.item_code} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="item_name" className="form-label">{t('Item Name')}</label>
                        <TextInput
                            id="item_name"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('item_name', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Item Name') })}
                            value={data.item_name}
                            errorMessage={errors.item_name} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="category_id" className="form-label">{t('Category')}</label>
                        <Select
                            id="category_id"
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                            onChange={(option) => {
                                clearErrors('category_id');
                                setData('category_id', option ? option.value : '');
                            }}
                            placeholder={t('Select Category')}
                            isSearchable={true}
                            isClearable={true}
                            value={categories.map(c => ({ value: c.id, label: c.name }))
                                .find(option => option.value === data.category_id) || null
                            }
                        />
                        {errors.category_id && <ErrorMessage message={errors.category_id} />}
                    </div>

                    <div className="col-6 mb-3">
                        <label htmlFor="stock" className="form-label">{t('Stock')}</label>
                        <TextInput
                            id="stock"
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            min={0}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === '+') {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                                setData('stock', onlyNums);
                            }}
                            placeholder={t('Enter Attribute', { 'attribute': t('Stock') })}
                            value={data.stock}
                            errorMessage={errors.stock} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="unit_id" className="form-label">{t('Unit')}</label>
                        <Select
                            id="unit_id"
                            options={units.map(u => ({ value: u.id, label: u.name }))}
                            onChange={(option) => {
                                clearErrors('unit_id');
                                setData('unit_id', option ? option.value : '');
                            }}
                            placeholder={t('Select Unit')}
                            isSearchable={true}
                            isClearable={true}
                            value={
                                units
                                    .map(u => ({ value: u.id, label: u.name }))
                                    .find(option => option.value === data.unit_id) || null
                            }
                        />
                        {errors.unit_id && <ErrorMessage message={errors.unit_id} />}
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor="description" className="form-label">{t('Description')}</label>
                        <TextAreaInput
                            id="description"
                            className="form-control"
                            autoComplete="off"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Description') })}
                            errorMessage={errors.description}
                            height="150px"
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor="image" className="form-label">{t('Image')}</label>
                        <SingleFileUpload
                            id="image"
                            name="image"
                            label={t('Upload Image')}
                            initialFileUrl={data.image_url}
                            onFileChange={(file) => {
                                console.log(file);
                                setData('image', file)
                            }
                            }
                            onFileRemove={() => setData('image', null)}
                            allowedFileTypes={['image/*']}
                            height={300}
                            errorMessage={errors.image}
                        />
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}