import CheckoutBreadcrumbs from './CheckoutBreadcrumbs';

export default function FlightStep({
    user,
    flights,
    selectedFlight,
    setSelectedFlight,
    onContinue,
}) {
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <CheckoutBreadcrumbs currentStep={1} />

                <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <div className="mb-8">
                        <p className="text-sm font-medium text-blue-600">
                            Flight checkout
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Choose your flight
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Logged in as {user.email}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {flights.map((flight) => (
                            <button
                                key={flight.id}
                                type="button"
                                onClick={() => setSelectedFlight(flight)}
                                className={`w-full rounded-xl border p-5 text-left transition ${
                                    selectedFlight?.id === flight.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {flight.from} → {flight.to}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {flight.date} · {flight.time}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">
                                            €{flight.price}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            per ticket
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={onContinue}
                            disabled={!selectedFlight}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
