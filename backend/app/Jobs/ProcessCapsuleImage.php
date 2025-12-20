<?php

namespace App\Jobs;

use App\Models\Capsule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class ProcessCapsuleImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The capsule instance.
     *
     * @var \App\Models\Capsule
     */
    protected $capsule;

    /**
     * Create a new job instance.
     */
    public function __construct(Capsule $capsule)
    {
        $this->capsule = $capsule;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (!$this->capsule->image_url) {
            return;
        }

        // Prepare payload for Python AI Worker
        $payload = json_encode([
            'capsule_id' => $this->capsule->id,
            'image_path' => $this->capsule->image_url,
            'timestamp' => now()->toIso8601String()
        ]);

        // Push to 'ai_processing' queue in Redis
        // This assumes Redis is configured as the default or a named connection
        Redis::publish('ai_processing_channel', $payload); // Pub/Sub for immediate handling
        // OR standard queue push if using a worker list
        Redis::rpush('ai_processing_queue', $payload);
    }
}
