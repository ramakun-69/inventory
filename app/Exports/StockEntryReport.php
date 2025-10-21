<?php

namespace App\Exports;

use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StockEntryReport implements FromCollection, WithHeadings, WithTitle, WithStyles, ShouldAutoSize, WithEvents
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $stockEntry;

    public function __construct($stockEntry)
    {
        $this->stockEntry = $stockEntry;
    }
    public function collection()
    {
        return $this->stockEntry->map(fn($entry, $index) => [
            'No' => $index + 1,
            'Tanggal_masuk' => $entry?->entry?->entry_date,
            'Kode_masuk' => $entry?->entry?->entry_number,
            'Nama_barang' => $entry?->item?->name,
            'Jumlah' => "{$entry->quantity} {$entry?->item?->unit?->name}",
            'Supplier' => $entry?->supplier?->name,
            'Petugas' => $entry?->entry?->user?->name,
        ]);
    }

    public function headings(): array
    {
        return [
            'No',
            'Tanggal Masuk',
            'Kode Masuk',
            'Nama Barang',
            'Jumlah',
            'Supplier',
            'Petugas',
        ];
    }

    public function title(): string
    {
        return 'Stock Entry Report';
    }

    public function styles(Worksheet $sheet)
    {
        // Header row tebal dan background abu-abu
        $sheet->getStyle('A1:G1')->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['argb' => 'FFEFEFEF'],
            ],
        ]);
    }

    /**
     * Tambahkan border ke semua sel
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Hitung jumlah baris data (termasuk header)
                $rowCount = $this->stockEntry->count() + 1;

                $event->sheet->getStyle("A1:G{$rowCount}")
                    ->applyFromArray([
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => Border::BORDER_THIN,
                                'color' => ['argb' => 'FF000000'],
                            ],
                        ],
                    ]);
            },
        ];
    }
}
