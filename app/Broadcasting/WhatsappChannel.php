<?php

namespace App\Broadcasting;

use App\Models\User;
use App\Services\Fonnte\FonnteService;
use App\Notifications\WhatsappNotification;

class WhatsappChannel
{

    protected $fonnteService;
    /**
     * Create a new channel instance.
     */
    public function __construct(FonnteService $fonnteService)
    {
        $this->fonnteService = $fonnteService;
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function send($notifiable, WhatsappNotification $notification)
    {
        if (method_exists($notification, 'toWhatsApp')) {
            $messageData = $notification->toWhatsApp($notifiable);

            $this->fonnteService->sendMessage(
                $messageData['number'],
                $messageData['message']
            );
        }
    }
}
