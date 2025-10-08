import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import Search from "../../src/components/datatable/Search";
import Loading from "../../src/components/datatable/Loading";
import Button from "../../src/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import { confirmAlert } from "../../src/components/ui/SweetAlert";

export default function Item({ ...props }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, processing, reset } = useForm({
        ids: [],
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
        axios.get(route('datatable.trash.items'), {
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
            name: t('Supplier'),
            selector: row => row.supplier.name,
            sortable: true,
        },
        {
            name: t('Stock'),
            selector: row => `${row.stock} ${row?.unit?.name}`,
            sortable: true,
        }
    ];
    const handleDelete = () => {
        confirmAlert(t('Are You Sure?'), t('delete_description'), 'warning', () => {
            destroy(route('master-data.items.delete'), {
                onSuccess: (page) => {
                    reset();
                    const error = page.props?.flash?.error;
                    const success = page.props?.flash?.success;
                    if (error) {
                        notifyError(error, 'bottom-center');
                    } else {
                        notifySuccess(success, 'bottom-center');
                        loadTableData();
                    }
                },
            });
        });
    };
    const handleRestore = () => {
        confirmAlert(t('Are You Sure?'), t('restore_description'), 'warning', () => {
            post(route('master-data.items.restore'), {
                onSuccess: (page) => {
                    reset();
                    const error = page.props?.flash?.error;
                    const success = page.props?.flash?.success;
                    if (error) {
                        notifyError(error, 'bottom-center');
                    } else {
                        notifySuccess(success, 'bottom-center');
                        loadTableData();
                    }
                },
            });
        });
    };

    const handleSelectedRowsChange = (state) => {
        setData({ ids: state.selectedRows.map(row => row.id) });
    }
    return (
        <AppLayout>
            <Breadcrumb title={t('Item')} subtitle={t('Item Management')} />
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <Button type="button" className="btn btn-sm btn-success me-3" onClick={handleRestore} disabled={processing || data.ids.length === 0}>
                        <Icon icon="line-md:backup-restore" className="me-2" width="20" height="20" />
                        {t('Restore')}
                    </Button>
                    <Button type="button" className="btn btn-sm btn-danger me-3" onClick={handleDelete} disabled={processing || data.ids.length === 0}>
                        <Icon icon="line-md:document-delete" className="me-2" width="20" height="20" />
                        {t('Delete')}
                    </Button>
                    <Link href={route('master-data.items.index')} className="btn btn-sm btn-secondary" >
                        <Icon icon="line-md:arrow-left" className="me-2" width="20" height="20" />
                        {t('Back')}
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
                                    selectableRows
                                    onSelectedRowsChange={handleSelectedRowsChange}
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
        </AppLayout>
    );
}
