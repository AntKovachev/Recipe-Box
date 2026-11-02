<?php

namespace App\Http\Controllers;

use App\Models\WeeklyDigest;
use Inertia\Inertia;
use Inertia\Response;

class WeeklyDigestController extends Controller
{
    public function index(): Response
    {
        $digests = WeeklyDigest::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Digests/Index', [
            'digests' => $digests,
        ]);
    }
}
