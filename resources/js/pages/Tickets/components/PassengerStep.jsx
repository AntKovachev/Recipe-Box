import CheckoutBreadcrumbs from './CheckoutBreadcrumbs';

export default function PassengerStep({
    quantity,
    passengers,
    onQuantityChange,
    onPassengerChange,
    onContinue,
    onStartOver,
}) {
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <CheckoutBreadcrumbs currentStep={2} />

                <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Passenger details
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Enter the details for everyone travelling.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onStartOver}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Start over
                        </button>
                    </div>

                    <div className="mt-8">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Number of tickets
                        </label>

                        <select
                            value={quantity}
                            onChange={(event) =>
                                onQuantityChange(Number(event.target.value))
                            }
                            className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-3"
                        >
                            <option value={1}>1 ticket</option>
                            <option value={2}>2 tickets</option>
                            <option value={3}>3 tickets</option>
                            <option value={4}>4 tickets</option>
                        </select>
                    </div>

                    <div className="mt-8 space-y-6">
                        {passengers.map((passenger, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-gray-200 p-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Passenger {index + 1}
                                </h2>

                                <div className="mt-5 grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            First name
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            value={passenger.first_name}
                                            onChange={(event) =>
                                                onPassengerChange(
                                                    index,
                                                    'first_name',
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Last name
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            value={passenger.last_name}
                                            onChange={(event) =>
                                                onPassengerChange(
                                                    index,
                                                    'last_name',
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Date of birth
                                        </label>

                                        <input
                                            type="date"
                                            required
                                            value={passenger.date_of_birth}
                                            onChange={(event) =>
                                                onPassengerChange(
                                                    index,
                                                    'date_of_birth',
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Nationality
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            value={passenger.nationality}
                                            onChange={(event) =>
                                                onPassengerChange(
                                                    index,
                                                    'nationality',
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Passport / document number
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            value={passenger.document_number}
                                            onChange={(event) =>
                                                onPassengerChange(
                                                    index,
                                                    'document_number',
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            required
                                            value={passenger.email}
                                            onChange={(event) =>
                                                onPassengerChange(
                                                    index,
                                                    'email',
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={onContinue}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Continue to payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
