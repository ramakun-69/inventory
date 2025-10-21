<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use App\Broadcasting\WhatsappChannel;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class WhatsappNotification extends Notification
{
    use Queueable;

    protected $message;
    protected $phone;

    public function __construct($message, $phone)
    {
        $this->message = $message;
        $this->phone = $phone;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [WhatsappChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    public function toWhatsApp($notifiable)
    {

        return [
            'number' => $this->phone,
            'message' => $this->message,
        ];
    }
}
