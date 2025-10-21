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
import CheckBoxInput from "../../src/components/ui/CheckBoxInput";
import ErrorMessage from "../../src/components/ui/ErrorMessage";


export default function User({ divisions, roles }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [modal, setModal] = useState({
        show: false,
        title: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, processing, errors, clearErrors, reset } = useForm({
        id: null,
        email: '',
        username: '',
        name: '',
        position: '',
        division_id: '',
        phone: '',
        role: ''
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
        axios.get(route('datatable.users'), {
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
            name: t('Name'),
            selector: row => row.name,
            sortable: true,
        },
        {
            name: t('Email'),
            selector: row => row.email,
            sortable: true,
        },
        {
            name: t('Username'),
            selector: row => row.username,
            sortable: true,
        },
        {
            name: t('Phone'),
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: t('Position'),
            selector: row => row?.position,
            sortable: true,
        },
        {
            name: t('Division'),
            selector: row => row?.division?.name,
            sortable: true,
        },
        {
            name: t('Role'),
            selector: row => t(row?.roles[0]?.name),
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

    const handleShowModal = (user = null) => {
        user ? setData({ ...user, role: user.roles[0]?.name }) : reset();
        setModal({
            show: true,
            title: user ? t('Edit User') : t('Add New User'),
        });
    }
    const handleCloseModal = () => {
        clearErrors();
        setModal(prev => ({ ...prev, show: false }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('master-data.users.store'), {
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
            destroy(route('master-data.users.destroy', id), {
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
            <Breadcrumb title={t('User')} subtitle={t('User Management')} />
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                        <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                        {t('Add New User')}
                    </Button>
                    <Link href={route('trash.users')} className="btn btn-sm btn-danger ms-2">
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
                size="lg"
            >
                <div className="row">
                    <div className="col-6 mb-3">
                        <label htmlFor="email" className="form-label">{t('Email')}</label>
                        <TextInput
                            id="email"
                            type="email"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Email') })}
                            value={data.email}
                            errorMessage={errors.email} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="username" className="form-label">{t('Username')}</label>
                        <TextInput
                            id="username"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Username') })}
                            value={data.username}
                            errorMessage={errors.username} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="name" className="form-label">{t('Name')}</label>
                        <TextInput
                            id="name"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Name') })}
                            value={data.name}
                            errorMessage={errors.name} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="phone" className="form-label">{t('Phone')}</label>
                        <TextInput
                            id="phone"
                            type="text"
                            inputMode="numeric"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/\D/g, '');
                                setData('phone', onlyNums);
                            }}
                            placeholder={t('Enter Attribute', { 'attribute': t('Phone') })}
                            value={data.phone}
                            errorMessage={errors.phone} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="position" className="form-label">{t('Position')}</label>
                        <TextInput
                            id="position"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => {
                                setData('position', e.target.value);
                                clearErrors('position');
                            }}
                            placeholder={t('Enter Attribute', { 'attribute': t('Position') })}
                            value={data.position}
                            errorMessage={errors.position} />
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="division_id" className="form-label">{t('Division')}</label>
                        <Select
                            id="division_id"
                            options={divisions.map(d => ({ value: d.id, label: d.name }))}
                            onChange={(option) => {
                                clearErrors('division_id');
                                setData('division_id', option ? option.value : '');
                            }}
                            placeholder={t('Select Division')}
                            isSearchable={true}
                            isClearable={true}
                            value={
                                divisions
                                    .map(d => ({ value: d.id, label: d.name }))
                                    .find(option => option.value === data.division_id) || null
                            }
                        />
                        {errors.division_id && <ErrorMessage message={errors.division_id} />}

                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="role" className="form-label">{t('Role')}</label>
                        <div className="form-check style-check d-flex align-items-center">
                            {roles.map(role => (
                                <CheckBoxInput
                                    type="radio"
                                    key={`role_${role.id}`}
                                    id={`role_${role.id}`}
                                    label={t(role.name)}
                                    checked={data.role === role.name} // hanya true kalau cocok
                                    onChange={() => {
                                        clearErrors('role');
                                        setData('role', role.name); // langsung set nilai tunggal
                                    }}
                                />
                            ))}

                        </div>
                        {errors.role && <ErrorMessage message={errors.role} />}
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}