
import { Head, Link } from '@inertiajs/react';

export default function Error({ status }) {
    const errors = {
        403: {
            title: 'Forbidden',
            message: "Sorry, you don't have permission to access this page.",
        },
        404: {
            title: 'Page Not Found',
            message: "Sorry, the page you're looking for doesn't exist.",
        },
        500: {
            title: 'Server Error',
            message: 'Something went wrong on our side.',
        },
        503: {
            title: 'Service Unavailable',
            message: "We're currently performing maintenance. Please try again later.",
        },
        //
    };

    const error = errors[status] || errors[500];

    return (
        <>
            <Head title={`${status} - ${error.title}`} />

            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">
                    {status}
                </h1>

                <h2 className="text-2xl font-semibold mb-3">
                    {error.title}
                </h2>

                <p className="text-gray-600 mb-6">
                    {error.message}
                </p>

                <Link
                    href="/recipes"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    Back to recipes
                </Link>
            </div>
        </>
    );
}
