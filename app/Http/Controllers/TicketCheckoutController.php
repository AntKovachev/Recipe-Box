<?php

namespace App\Http\Controllers;

use App\Http\Requests\StartTicketCheckoutRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketCheckoutController extends Controller
{
    public function start(StartTicketCheckoutRequest $request)
    {
        $checkout = [
            'uuid' => (string) Str::uuid(),
            'flight' => $request->validated('flight'),
            'quantity' => 1,
        ];

        $request->session()->put('ticket_checkout', $checkout);

        return response()->json($checkout);
    }

    public function show(Request $request)
    {
        return response()->json(
            $request->session()->get('ticket_checkout')
        );
    }

    public function destroy(Request $request)
    {
        $request->session()->forget('ticket_checkout');

        return response()->noContent();
    }
}
