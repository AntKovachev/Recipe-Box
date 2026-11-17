import { useEffect, useState } from 'react';
import { fetcher } from '../../lib/fetcher';

export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [user, setUser] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [step, setStep] = useState(1);

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
        async function restoreUser() {
            const token = localStorage.getItem('ticket_api_token');

            if (!token) {
                setCheckingAuth(false);
                return;
            }

            try {
                const response = await fetch('/api/auth-test', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    localStorage.removeItem('ticket_api_token');
                    return;
                }

                const data = await response.json();

                setUser(data.user);
            } catch (error) {
                console.error('Failed to restore user:', error);
                localStorage.removeItem('ticket_api_token');
            } finally {
                setCheckingAuth(false);
            }
        }

        restoreUser();
    }, []);

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

        const data = await response.json();

        console.log('Checkout started:', data);

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
            <div className="min-h-screen bg-gray-100 px-4 py-10">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 flex items-center gap-3 text-sm">
                        <span className="font-semibold text-blue-600">
                            1. Flight
                        </span>

                        <span className="text-gray-400">→</span>

                        <span className="text-gray-400">
                            2. Passengers
                        </span>

                        <span className="text-gray-400">→</span>

                        <span className="text-gray-400">
                            3. Review & Payment
                        </span>

                        <span className="text-gray-400">→</span>

                        <span className="text-gray-400">
                            4. Success
                        </span>
                    </div>

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
                                onClick={handleContinue}
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

    if (user && step === 2) {
        return (
            <div className="min-h-screen bg-gray-100 px-4 py-10">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8 flex items-center gap-3 text-sm">
                        <span className="text-green-600">
                            1. Flight
                        </span>

                        <span className="text-gray-400">→</span>

                        <span className="font-semibold text-blue-600">
                            2. Passengers
                        </span>

                        <span className="text-gray-400">→</span>

                        <span className="text-gray-400">
                            3. Review & Payment
                        </span>

                        <span className="text-gray-400">→</span>

                        <span className="text-gray-400">
                            4. Success
                        </span>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-lg">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Passenger details
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Enter the passenger information for this booking.
                        </p>
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
                                onChange={(event) => setEmail(event.target.value)}
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
                                onChange={(event) => setPassword(event.target.value)}
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
