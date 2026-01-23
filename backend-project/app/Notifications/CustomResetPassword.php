<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPassword extends Notification
{
    use Queueable;

    public $url;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $content = "Click here to reset your password:\n\n{$this->url}\n\nThis link expires in 60 minutes.";
        
        return (new MailMessage)
            ->subject('Password Reset - Impostor Game')
            ->line('You requested a password reset.')
            ->action('Reset Password', $this->url)
            ->line('This link expires in 60 minutes.');
    }
}