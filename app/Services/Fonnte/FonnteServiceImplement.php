<?php

namespace App\Services\Fonnte;

use LaravelEasyRepository\ServiceApi;
use App\Traits\ResponseOutput;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteServiceImplement extends ServiceApi implements FonnteService
{

  use ResponseOutput;

  protected $apiUrl = 'https://api.fonnte.com/send';
  protected $token;
  public function __construct()
  {
    $this->token = env('FONNTE_TOKEN');
  }
  public function sendMessage($number, $message, array $options = [])
  {
    return $this->safeExecute(function () use ($number, $message, $options) {
      $payload = array_merge([
        'target' => $number,
        'message' => $message,
        'schedule' => 0,
        'typing' => false,
        'delay' => '2',
        'countryCode' => '62',
      ], $options);
      $response = Http::withOption([
        'verify' => false,
      ])->withHeaders([
        'Authorization' => $this->token,
      ])->post($this->apiUrl, $payload);
      // dd($response->body());
      if ($response->successful()) {
        $responseData = $response->json();
        if (isset($responseData['status']) && $responseData['status'] === true) {
          Log::channel('whatsapp')->info('Message sent successfully: ' . json_encode($responseData));
          return $this->responseSuccess($responseData);
        } else {
          Log::channel('whatsapp')->error('Failed to send message: ' . json_encode($responseData));
          return $this->responseFailed($responseData);
        }
      } else {
        Log::channel('whatsapp')->error($response->body());
        return $this->responseFailed($response->body());
      }
    });
  }
}
