import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div>
            {flash.success && (
                <div className="bg-green-100 text-green-800 p-3 rounded">
                    {flash.success}
                </div>
            )}

            {flash.error && (
                <div className="bg-red-100 text-red-800 p-3 rounded">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
