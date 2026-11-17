import { useEffect, useState } from 'react';
import { fetcher } from '../../lib/fetcher';
import CheckoutBreadcrumbs from './components/CheckoutBreadcrumbs';
import FlightStep from './components/FlightStep';
import PassengerStep from './components/PassengerStep';

const emptyPassenger = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    nationality: '',
    document_number: '',
    email: '',
};

export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [user, setUser] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [step, setStep] = useState(1);

    const [quantity, setQuantity] = useState(1);
    const [passengers, setPassengers] = useState([
        { ...emptyPassenger },
    ]);

    const [paymentMethod, setPaymentMethod] = useState('invoice');
    const [confirmedDetails, setConfirmedDetails] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const totalPrice = selectedFlight
        ? selectedFlight.price * quantity
        : 0;

    const [processingPayment, setProcessingPayment] = useState(false);

    const flights = [
        {
            id: 1,
            from: 'Sofia',
            to: 'London',
            date: '2026-11-20',
            time: '08:30',
            price: 89,
        },
        {
            id: 2,
            from: 'Sofia',
            to: 'Berlin',
            date: '2026-11-20',
            time: '11:45',
            price: 75,
        },
        {
            id: 3,
            from: 'Sofia',
            to: 'Rome',
            date: '2026-11-20',
            time: '15:10',
            price: 95,
        },
    ];

    useEffect(() => {
        async function restoreUserAndCheckout() {
            const token = localStorage.getItem('ticket_api_token');

            if (!token) {
                setCheckingAuth(false);
                return;
            }

            try {
                const authResponse = await fetch('/api/auth-test', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                if (!authResponse.ok) {
                    localStorage.removeItem('ticket_api_token');
                    return;
                }

                const authData = await authResponse.json();

                setUser(authData.user);

                const checkoutResponse = await fetch('/tickets/checkout', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                if (checkoutResponse.ok) {
                    const data = await checkoutResponse.json();

                    if (data.checkout) {
                        setSelectedFlight(data.checkout.flight);
                        setQuantity(data.checkout.quantity ?? 1);

                        if (data.checkout.passengers?.length) {
                            setPassengers(data.checkout.passengers);
                        }

                        if (data.checkout.status === 'paid') {
                            setStep(4);
                        } else if (data.checkout.passengers?.length) {
                            setStep(3);
                        } else {
                            setStep(2);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to restore user or checkout:', error);
                localStorage.removeItem('ticket_api_token');
            } finally {
                setCheckingAuth(false);
            }
        }

        restoreUserAndCheckout();
    }, []);

    async function handlePayment() {
        if (!confirmedDetails || !acceptedTerms) {
            return;
        }

        setProcessingPayment(true);

        const token = localStorage.getItem('ticket_api_token');

        try {
            const response = await fetch('/tickets/checkout/pay', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute('content'),
                },
            });

            if (!response.ok) {
                throw new Error('Payment failed.');
            }

            await response.json();

            setStep(4);
        } finally {
            setProcessingPayment(false);
        }
    }

    async function handlePassengersSubmit() {
        const token = localStorage.getItem('ticket_api_token');

        const response = await fetch('/tickets/checkout/passengers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute('content'),
            },
            body: JSON.stringify({
                quantity,
                passengers,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save passenger details.');
        }

        const data = await response.json();

        setQuantity(data.checkout.quantity);
        setPassengers(data.checkout.passengers);
        setStep(3);
    }

    function handlePassengerChange(index, field, value) {
        setPassengers((currentPassengers) =>
            currentPassengers.map((passenger, passengerIndex) =>
                passengerIndex === index
                    ? {
                          ...passenger,
                          [field]: value,
                      }
                    : passenger
            )
        );
    }

    function handleQuantityChange(newQuantity) {
        setQuantity(newQuantity);

        setPassengers((currentPassengers) => {
            const updatedPassengers = [...currentPassengers];

            while (updatedPassengers.length < newQuantity) {
                updatedPassengers.push({
                    ...emptyPassenger,
                });
            }

            return updatedPassengers.slice(0, newQuantity);
        });
    }

    async function handleStartOver() {
        const token = localStorage.getItem('ticket_api_token');

        const response = await fetch('/tickets/checkout', {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute('content'),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to reset checkout.');
        }

        setSelectedFlight(null);
        setQuantity(1);
        setPassengers([{ ...emptyPassenger }]);
        setStep(1);
    }

    async function handleLogin(event) {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const data = await fetcher('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            localStorage.setItem('ticket_api_token', data.token);

            const authTest = await fetch('/api/auth-test', {
                headers: {
                    Authorization: `Bearer ${data.token}`,
                    Accept: 'application/json',
                },
            });

            if (!authTest.ok) {
                throw new Error('Authentication failed.');
            }

            const authTestData = await authTest.json();

            setUser(authTestData.user);
        } catch (error) {
            setError(error.info?.message ?? error.message ?? 'Login failed.');
        } finally {
            setLoading(false);
        }
    }

    async function handleContinue() {
        if (!selectedFlight) {
            return;
        }

        const token = localStorage.getItem('ticket_api_token');

        const response = await fetch('/tickets/checkout/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute('content'),
            },
            body: JSON.stringify({
                flight: selectedFlight,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to start checkout.');
        }

        const checkout = await response.json();

        setQuantity(checkout.quantity ?? 1);
        setStep(2);
    }

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gray-100 px-4 py-12">
                <div className="mx-auto max-w-md">
                    <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
                        <p className="text-gray-500">
                            Checking authentication...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (user && step === 1) {
        return (
            <FlightStep
                user={user}
                flights={flights}
                selectedFlight={selectedFlight}
                setSelectedFlight={setSelectedFlight}
                onContinue={handleContinue}
            />
        );
    }

    if (user && step === 2) {
        return (
            <PassengerStep
                quantity={quantity}
                passengers={passengers}
                onQuantityChange={handleQuantityChange}
                onPassengerChange={handlePassengerChange}
                onContinue={handlePassengersSubmit}
                onStartOver={handleStartOver}
            />
        );
    }

    if (user && step === 3) {
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
                                                setConfirmedDetails(event.target.checked)
                                            }
                                            className="mt-1"
                                        />

                                        <span className="text-sm text-gray-700">
                                            I confirm that all passenger and flight details are correct.
                                        </span>
                                    </label>

                                    <label className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(event) =>
                                                setAcceptedTerms(event.target.checked)
                                            }
                                            className="mt-1"
                                        />

                                        <span className="text-sm text-gray-700">
                                            I accept the booking terms and payment conditions.
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="button"
                                    onClick={handlePayment}
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
                                                    {passenger.first_name} {passenger.last_name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {passenger.email}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Document: {passenger.document_number}
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

    if (user && step === 4) {
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

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-12">
            <div className="mx-auto max-w-md">
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <div className="mb-8">
                        <p className="text-sm font-medium text-blue-600">
                            Flight checkout
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Log in to continue with your ticket purchase.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="tickets@example.com"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
