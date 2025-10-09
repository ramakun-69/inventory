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
export default function ItemRequestReport({ divisions }) {
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
        division_id: '',
    });
    const { start_date: startDate, end_date: endDate, division_id: divisionId } = data;

    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.item-request-report'), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                start_date: startDate,
                end_date: endDate,
                division_id: divisionId,
            },
        }).then((res) => {
            setTableData(res.data.data);
            setTotalRows(res.data.total);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, endDate, divisionId]);
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
      ];

    const handleExport = async () => {
        try {
            setIsExporting(true); // mulai animasi

            const response = await axios.post(route("report.item-requests.export"), {
                start_date: startDate,
                end_date: endDate,
                division_id: divisionId,
            }, {
                responseType: "blob", // penting, letakkan di sini, bukan di body
            });
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${t('Item Request Report')}.xlsx`);
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
            <Breadcrumb title={t('Report')} subtitle={t('Item Request Report')} />
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
                                    <label htmlFor="division_id" className="form-label">{t('Division')}</label>
                                    <Select
                                        id="division_id"
                                        options={divisions.map(d => ({ value: d.id, label: d.name }))}
                                        onChange={(option) => {
                                            setData('division_id', option ? option.value : '');
                                        }}
                                        placeholder={t('Select Division')}
                                        isSearchable={true}
                                        isClearable={true}
                                        value={divisions.map(d => ({ value: d.id, label: d.name }))
                                            .find(option => option.value === divisionId) || null
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