import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { fetcher } from '../../lib/fetcher';
import CheckoutBreadcrumbs from './components/CheckoutBreadcrumbs';
import FlightStep from './components/FlightStep';
import PassengerStep from './components/PassengerStep';
import PaymentStep from './components/PaymentStep';
import SuccessStep from './components/SuccessStep';

const emptyPassenger = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    nationality: '',
    document_number: '',
    email: '',
};

export default function Index() {
    const {
        register,
        handleSubmit,
    } = useForm();
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
    
    const totalPrice = useMemo(() => {
        return selectedFlight
            ? selectedFlight.price * quantity
            : 0;
    }, [selectedFlight, quantity]);
    
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

            const data = await response.json();

            window.location.href = data.url;
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

    const handlePassengerChange = useCallback((index, field, value) => {
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
    }, []);

    const handleQuantityChange = useCallback((newQuantity) => {
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
    }, []);

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

    async function handleLogin(formData) {
        setLoading(true);
        setError(null);

        try {
            const data = await fetcher('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
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
            <PaymentStep
                selectedFlight={selectedFlight}
                quantity={quantity}
                passengers={passengers}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                confirmedDetails={confirmedDetails}
                setConfirmedDetails={setConfirmedDetails}
                acceptedTerms={acceptedTerms}
                setAcceptedTerms={setAcceptedTerms}
                processingPayment={processingPayment}
                totalPrice={totalPrice}
                onPay={handlePayment}
            />
        );
    }

    if (user && step === 4) {
        return (
            <SuccessStep
                selectedFlight={selectedFlight}
                quantity={quantity}
                totalPrice={totalPrice}
            />
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

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required.',
                                })}
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
                                {...register('password', {
                                    required: 'Password is required.',
                                })}
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
