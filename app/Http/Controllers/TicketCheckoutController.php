<?php

namespace App\Http\Controllers;

use App\Http\Requests\StartTicketCheckoutRequest;
use App\Http\Requests\StoreTicketPassengersRequest;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Cashier\Cashier;

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
        return response()->json([
            'checkout' => $request->session()->get('ticket_checkout'),
        ]);
    }

    public function destroy(Request $request)
    {
        $request->session()->forget('ticket_checkout');

        return response()->noContent();
    }

    public function storePassengers(StoreTicketPassengersRequest $request)
    {
        $checkout = $request->session()->get('ticket_checkout');

        if (!$checkout) {
            return response()->json([
                'message' => 'Checkout not found.',
            ], 404);
        }

        $checkout['quantity'] = $request->validated('quantity');
        $checkout['passengers'] = $request->validated('passengers');

        $request->session()->put('ticket_checkout', $checkout);

        return response()->json([
            'checkout' => $checkout,
        ]);
    }

    public function pay(Request $request)
    {
        $checkout = $request->session()->get('ticket_checkout');

        if (!$checkout) {
            return response()->json([
                'message' => 'Checkout not found.',
            ], 404);
        }

        $booking = Booking::create([
            'uuid' => (string) Str::uuid(),
            'user_id' => $request->user()->id,
            'flight' => $checkout['flight'],
            'passengers' => $checkout['passengers'],
            'quantity' => $checkout['quantity'],
            'total_price' => $checkout['flight']['price'] * $checkout['quantity'],
            'status' => 'pending',
            'payment_method' => 'stripe',
        ]);

        $cashierCheckout = $request->user()->checkout(
            [
                config('services.stripe.flight_price_id') => $checkout['quantity'],
            ],
            [
                'success_url' => route('tickets.checkout.stripe.success')
                    . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('tickets.index'),
                'metadata' => [
                    'booking_id' => $booking->id,
                ],
            ]
        );

        return response()->json([
            'url' => $cashierCheckout->asStripeCheckoutSession()->url,
        ]);
    }

    public function stripeSuccess(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return redirect()->route('tickets.index');
        }

        $session = Cashier::stripe()
            ->checkout
            ->sessions
            ->retrieve($sessionId);

        if ($session->payment_status !== 'paid') {
            return redirect()->route('tickets.index');
        }

        $bookingId = $session['metadata']['booking_id'] ?? null;

        $booking = Booking::findOrFail($bookingId);

        $booking->update([
            'status' => 'paid',
            'stripe_checkout_session_id' => $session->id,
            'stripe_payment_intent_id' => $session->payment_intent,
            'paid_at' => now(),
        ]);

        $checkout = $request->session()->get('ticket_checkout');

        if ($checkout) {
            $checkout['status'] = 'paid';
            $checkout['payment_method'] = 'stripe';

            $request->session()->put('ticket_checkout', $checkout);
        }

        return redirect()->route('tickets.index');
    }
}
