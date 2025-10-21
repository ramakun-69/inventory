<?php

namespace App\Repositories\SendNotification;

use LaravelEasyRepository\Repository;

interface SendNotificationRepository extends Repository{

    public function sendWhatsappMessage($number, $placeholders,$messageFile);
    public function sendEmailMessageWithAttachment($email, $placeholders, $messageFile, $subject = null,array $attachments = []);
}
