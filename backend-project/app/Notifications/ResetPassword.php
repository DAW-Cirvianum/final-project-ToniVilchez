<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPassword extends Notification
{
    use Queueable;
    public $tokenOrUrl;
    public function __construct($tokenOrUrl)
    {
        $this->tokenOrUrl = $tokenOrUrl;
    }
    public function via($notifiable): array
    {
        return ['mail'];
    }
    public function toMail($notifiable): MailMessage
    {
        if (str_starts_with($this->tokenOrUrl, 'http')) {
            $url = $this->tokenOrUrl;
        } else {
            $url = url(route('password.reset', [
                'token' => $this->tokenOrUrl,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));
        }
        
        return (new MailMessage)
            ->subject(__('Reset Password Notification'))
            ->line(__('You are receiving this email because we received a password reset request for your account.'))
            ->action(__('Reset Password'), $url)
            ->line(__('This password reset link will expire in :count minutes.', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')]))
            ->line(__('If you did not request a password reset, no further action is required.'));
    }
}