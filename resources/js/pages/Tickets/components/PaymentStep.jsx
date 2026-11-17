import CheckoutBreadcrumbs from './CheckoutBreadcrumbs';

export default function PaymentStep({
    selectedFlight,
    quantity,
    passengers,
    paymentMethod,
    setPaymentMethod,
    confirmedDetails,
    setConfirmedDetails,
    acceptedTerms,
    setAcceptedTerms,
    processingPayment,
    totalPrice,
    onPay,
}) {
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <CheckoutBreadcrumbs currentStep={3} />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl bg-white p-8 shadow-lg">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Payment
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Choose your payment method and confirm the booking.
                            </p>

                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Payment method
                                </h2>

                                <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-blue-500 bg-blue-50 p-5">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="invoice"
                                        checked={paymentMethod === 'invoice'}
                                        onChange={(event) =>
                                            setPaymentMethod(event.target.value)
                                        }
                                    />

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Pay by invoice
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            You will receive an invoice for this booking.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-8 space-y-4">
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={confirmedDetails}
                                        onChange={(event) =>
                                            setConfirmedDetails(
                                                event.target.checked
                                            )
                                        }
                                        className="mt-1"
                                    />

                                    <span className="text-sm text-gray-700">
                                        I confirm that all passenger and flight
                                        details are correct.
                                    </span>
                                </label>

                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(event) =>
                                            setAcceptedTerms(
                                                event.target.checked
                                            )
                                        }
                                        className="mt-1"
                                    />

                                    <span className="text-sm text-gray-700">
                                        I accept the booking terms and payment
                                        conditions.
                                    </span>
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={onPay}
                                disabled={
                                    !confirmedDetails ||
                                    !acceptedTerms ||
                                    processingPayment
                                }
                                className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processingPayment
                                    ? 'Processing payment...'
                                    : 'Pay by invoice'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Booking summary
                            </h2>

                            <div className="mt-6 border-b border-gray-200 pb-5">
                                <p className="font-semibold text-gray-900">
                                    {selectedFlight.from} → {selectedFlight.to}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {selectedFlight.date} · {selectedFlight.time}
                                </p>
                            </div>

                            <div className="border-b border-gray-200 py-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Tickets
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        {quantity}
                                    </span>
                                </div>

                                <div className="mt-2 flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Price per ticket
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        €{selectedFlight.price}
                                    </span>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 py-5">
                                <p className="text-sm font-semibold text-gray-900">
                                    Passengers
                                </p>

                                <div className="mt-3 space-y-3">
                                    {passengers.map((passenger, index) => (
                                        <div key={index}>
                                            <p className="text-sm font-medium text-gray-900">
                                                {passenger.first_name}{' '}
                                                {passenger.last_name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {passenger.email}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Document:{' '}
                                                {passenger.document_number}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-gray-900">
                                        €{totalPrice}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
