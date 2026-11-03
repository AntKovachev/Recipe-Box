<?php

namespace App\Http\Controllers;

use App\Models\WeeklyDigest;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\WeeklyDigestResource;

class WeeklyDigestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Digests/Index', [
            'digests' => WeeklyDigestResource::collection(
                WeeklyDigest::query()
                    ->where('user_id', auth()->id())
                    ->latest()
                    ->get()
            ),
        ]);
    }
}
