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

class ItemReport implements FromCollection, WithHeadings, WithTitle, WithStyles, ShouldAutoSize, WithEvents
{
    protected $items;

    public function __construct($items)
    {
        $this->items = $items;
    }

    public function collection()
    {
        return $this->items->map(fn($item, $index) => [
            'No' => $index + 1,
            'Kode_barang' => $item->item_code,
            'Nama' => $item->name,
            'Kategori' => $item->category?->name,
            'Stok' => "{$item->stock} {$item?->unit?->name}",
        ]);
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode Barang',
            'Nama',
            'Kategori',
            'Stok',
        ];
    }

    public function title(): string
    {
        return 'Item Report';
    }

    /**
     * Style header (bold, background)
     */
    public function styles(Worksheet $sheet)
    {
        // Header row tebal dan background abu-abu
        $sheet->getStyle('A1:F1')->applyFromArray([
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
                $rowCount = $this->items->count() + 1;

                $event->sheet->getStyle("A1:F{$rowCount}")
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
