<?php

namespace App\Exports;

use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ItemRequestReport implements FromCollection, WithHeadings, WithStyles, WithEvents, ShouldAutoSize
{
    protected $requests;

    public function __construct($requests)
    {
        $this->requests = $requests;
    }

    public function collection()
    {
        $rows = collect();

        foreach ($this->requests as $index => $request) {
            $items = $request->items;

            if ($items->isEmpty()) {
                // Jika tidak ada item
                $rows->push([
                    'No' => $index + 1,
                    'Nomor Permintaan' => $request->request_number,
                    'Tanggal Permintaan' => $request->request_date,
                    'Diajukan Oleh' => $request->user?->name,
                    'Divisi' => $request->user?->division?->name ?? '-',
                    'Keperluan' => $request->purpose,
                    'Status' => __($request->status),
                    'Nama Barang' => '-',
                    'Jumlah' => '-',
                    'Satuan' => '-',
                ]);
            } else {
                foreach ($items as $i => $item) {
                    $rows->push([
                        'No' => $i === 0 ? $index + 1 : '', // Kosong untuk baris berikutnya
                        'Nomor Permintaan' => $i === 0 ? $request->request_number : '',
                        'Tanggal Permintaan' => $i === 0 ? $request->request_date : '',
                        'Diajukan Oleh' => $i === 0 ? $request->user?->name : '',
                        'Divisi' => $i === 0 ? ($request->user?->division?->name ?? '-') : '',
                        'Keperluan' => $i === 0 ? $request->purpose : '',
                        'Status' => $i === 0 ? __($request->status) : '',
                        'Nama Barang' => $item->name,
                        'Jumlah' => $item->pivot->quantity ?? '-',
                        'Satuan' => $item->unit?->name ?? '-',
                    ]);
                }

                // Tambahkan baris kosong pemisah antar request
                $rows->push(['No' => '', 'Nomor Permintaan' => '', 'Tanggal Permintaan' => '', 'Diajukan Oleh' => '', 'Divisi' => '', 'Keperluan' => '', 'Status' => '', 'Nama Barang' => '', 'Jumlah' => '', 'Satuan' => '']);
            }
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'No',
            'Nomor Permintaan',
            'Tanggal Permintaan',
            'Diajukan Oleh',
            'Divisi',
            'Keperluan',
            'Status',
            'Nama Barang',
            'Jumlah',
            'Satuan',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Header bold + background abu
        $sheet->getStyle('A1:J1')->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['argb' => 'FFEFEFEF'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ])->getAlignment()->setWrapText(true);

        return [];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $highestRow = $event->sheet->getHighestRow();
                $highestCol = $event->sheet->getHighestColumn();

                // Border semua cell
                $event->sheet->getStyle("A1:{$highestCol}{$highestRow}")
                    ->applyFromArray([
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => Border::BORDER_THIN,
                                'color' => ['argb' => 'FF000000'],
                            ],
                        ],
                        'alignment' => [
                            'horizontal' => Alignment::HORIZONTAL_CENTER,
                            'vertical' => Alignment::VERTICAL_CENTER,
                        ],
                    ]);

                // Auto-size semua kolom
                foreach (range('A', 'J') as $col) {
                    $event->sheet->getDelegate()->getColumnDimension($col)->setAutoSize(true);
                }
            },
        ];
    }
}
