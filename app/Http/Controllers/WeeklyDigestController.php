<?php

namespace App\Http\Controllers;

use App\Models\WeeklyDigest;
use Inertia\Inertia;
use Inertia\Response;

class WeeklyDigestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Digests/Index', [
            'digests' =>
                WeeklyDigest::query()
                    ->where('user_id', auth()->id())
                    ->latest()
                    ->get()
        ]);
    }
}
