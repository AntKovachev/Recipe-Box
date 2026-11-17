import CheckoutBreadcrumbs from './CheckoutBreadcrumbs';

export default function SuccessStep({
    selectedFlight,
    quantity,
    totalPrice,
}) {
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="mx-auto max-w-4xl">
                <CheckoutBreadcrumbs currentStep={4} />

                <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
                    <div className="text-5xl">
                        ✓
                    </div>

                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                        Booking successful
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Your flight booking has been completed successfully.
                    </p>

                    <div className="mt-8 rounded-xl bg-gray-50 p-6 text-left">
                        <p className="font-semibold text-gray-900">
                            {selectedFlight.from} → {selectedFlight.to}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            {selectedFlight.date} · {selectedFlight.time}
                        </p>

                        <p className="mt-4 text-sm text-gray-600">
                            Tickets: {quantity}
                        </p>

                        <p className="text-sm text-gray-600">
                            Total: €{totalPrice}
                        </p>

                        <p className="text-sm text-gray-600">
                            Payment method: Invoice
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
