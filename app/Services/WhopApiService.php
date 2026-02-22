<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhopApiService
{
    private string $apiKey;
    private string $apiUrl;
    private int $maxRetries = 3;
    private array $retryDelays = [1, 2, 4];

    public function __construct()
    {
        $this->apiKey = config('payment.providers.whop.api_key');
        $this->apiUrl = config('payment.providers.whop.api_url');
    }

    /**
     * Cancel a Whop membership immediately
     */
    public function cancelMembership(string $membershipId): bool
    {
        if (empty($this->apiKey)) {
            Log::error('Whop API key is not configured');
            return false;
        }

        if (empty($membershipId)) {
            Log::error('Membership ID is empty');
            return false;
        }

        $endpoint = "{$this->apiUrl}/memberships/{$membershipId}/cancel";

        for ($attempt = 1; $attempt <= $this->maxRetries; $attempt++) {
            try {
                Log::info("Attempting to cancel Whop membership {$membershipId} (Attempt {$attempt}/{$this->maxRetries})");

                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->timeout(10)
                ->post($endpoint, [
                    'cancellation_mode' => 'immediate',
                ]);

                if ($response->successful()) {
                    Log::info("Successfully canceled Whop membership {$membershipId}", [
                        'membership_id' => $membershipId,
                        'response_status' => $response->status(),
                    ]);
                    return true;
                }

                $errorMessage = $this->extractErrorMessage($response);
                Log::warning("Failed to cancel Whop membership {$membershipId} (Attempt {$attempt}/{$this->maxRetries})", [
                    'membership_id' => $membershipId,
                    'status_code' => $response->status(),
                    'error_message' => $errorMessage,
                    'response_body' => $response->body(),
                ]);

                // Don't retry on 4xx errors (except 429 rate limit)
                if ($response->clientError() && $response->status() !== 429) {
                    Log::error("Client error when canceling Whop membership {$membershipId}. Not retrying.", [
                        'membership_id' => $membershipId,
                        'status_code' => $response->status(),
                        'error_message' => $errorMessage,
                    ]);
                    return false;
                }

                if ($attempt < $this->maxRetries) {
                    $delay = $this->retryDelays[$attempt - 1];
                    Log::info("Retrying in {$delay} seconds...");
                    sleep($delay);
                }

            } catch (\Exception $e) {
                Log::error("Exception when canceling Whop membership {$membershipId} (Attempt {$attempt}/{$this->maxRetries})", [
                    'membership_id' => $membershipId,
                    'exception' => $e->getMessage(),
                ]);

                if ($attempt < $this->maxRetries) {
                    $delay = $this->retryDelays[$attempt - 1];
                    Log::info("Retrying in {$delay} seconds...");
                    sleep($delay);
                }
            }
        }

        Log::error("Failed to cancel Whop membership {$membershipId} after {$this->maxRetries} attempts", [
            'membership_id' => $membershipId,
        ]);

        return false;
    }

    private function extractErrorMessage($response): string
    {
        $body = $response->json();

        if (isset($body['error']['message'])) {
            return $body['error']['message'];
        }

        if (isset($body['error'])) {
            return is_string($body['error']) ? $body['error'] : json_encode($body['error']);
        }

        if (isset($body['message'])) {
            return $body['message'];
        }

        return 'Unknown error';
    }
}
