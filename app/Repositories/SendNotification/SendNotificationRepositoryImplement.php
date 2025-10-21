<?php

namespace App\Repositories\SendNotification;

use App\Models\SendNotification;
use Illuminate\Support\Facades\File;
use App\Notifications\EmailNotification;
use App\Notifications\WhatsappNotification;
use Illuminate\Support\Facades\Notification;
use LaravelEasyRepository\Implementations\Eloquent;

class SendNotificationRepositoryImplement extends Eloquent implements SendNotificationRepository
{

    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     * @property Model|mixed $model;
     */
    public function sendWhatsappMessage($number, $placeholders, $messageFile)
    {
        $message = $this->buildMessage($placeholders, $messageFile);
        Notification::route('whatsapp', $number)->notifyNow(new WhatsappNotification($message, $number));
    }
    public function sendEmailMessageWithAttachment($user, $placeholders, $messageFile, $subject = null, array $attachments = [])
    {
        $message = $this->buildMessage($placeholders, $messageFile);

        Notification::route('mail', $user->email)
            ->notifyNow(new EmailNotification($message, $user, $subject, $attachments));
    }

    private function buildMessage($placeholders, $messageFile)
    {
        $message = File::get(public_path("notification-message/$messageFile"));
        foreach ($placeholders as $key => $value) {
            $message = str_replace("#" . strtoupper($key) . "#", $value, $message);
        }
        return $message;
    }
}
