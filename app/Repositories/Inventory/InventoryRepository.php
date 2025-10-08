<?php

namespace App\Repositories\Inventory;

use LaravelEasyRepository\Repository;

interface InventoryRepository extends Repository
{

    public function stockEntry($data);
    public function deleteStockEntry($stockEntry);
    public function itemRequest($data);
    public function confirmItemRequest($itemRequest, $status);
    public function stockTaking($data);
}
