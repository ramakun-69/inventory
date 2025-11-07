import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AppLayout from "../Layouts/AppLayout";
import Breadcrumb from "../src/components/ui/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Loading from './../src/components/datatable/Loading';

export default function Index({ ...props }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const barChartOptions = {
        chart: { type: "bar", toolbar: { show: false } },
        xaxis: {
            categories: [
                t("Jan"), t("Feb"), t("Mar"), t("Apr"), t("May"), t("Jun"),
                t("Jul"), t("Aug"), t("Sep"), t("Oct"), t("Nov"), t("Dec")
            ],
        },
        colors: ["#3B82F6"],
        dataLabels: { enabled: false },
        title: { text: t("Item Requests Chart"), align: "left" },
        grid: { strokeDashArray: 4 },
    };
    const barChartSeries = [
        { name: t("Requests"), data: props.monthlyRequests || [] }
    ];

    const pieChartOptions = {
        labels: props.popularItems?.map((i) => i.name) || [],
        legend: { position: "bottom" },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        title: { text: t("Most Requested Items"), align: "left" },
    };
    const pieChartSeries = props.popularItems?.map((i) => i.count) || [];

    const [isLoading, setIsLoading] = useState(false);
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
    ];

    return (
        <AppLayout >
            <Breadcrumb title={t("Dashboard")} />
            <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-1 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">{t("Total Users")}</p>
                                    <h6 className="mb-0">{`${props.users.length} ${t("Users")}`}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="gridicons:multiple-users"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-2 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">
                                        {t("Total Items")}
                                    </p>
                                    <h6 className="mb-0">{`${props.items.length} ${t("Items")}`}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="mdi:package-variant-closed"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-3 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">
                                        {t("Total Suppliers")}
                                    </p>
                                    <h6 className="mb-0">{`${props.suppliers.length} ${t("Suppliers")}`}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="mdi:truck-delivery"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-4 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">{t("Total Categories")}</p>
                                    <h6 className="mb-0">{`${props.categories.length} ${t("Categories")}`}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="mdi:view-grid"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-5 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">{t("Total Item Requests")}</p>
                                    <h6 className="mb-0">{`${props.itemRequests.length} ${t("Requests")}`}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon
                                        icon="mdi:package-up"
                                        className="text-white text-2xl mb-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* card end */}
                </div>
            </div>
            <div className="row mt-5 gy-4">
                {/* Bar Chart */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <Chart
                                options={barChartOptions}
                                series={barChartSeries}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <Chart
                                options={pieChartOptions}
                                series={pieChartSeries}
                                type="pie"
                                height={350}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5 gy-4">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">{t('Low Stock Items')}</div>
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
        </AppLayout >
    );
}