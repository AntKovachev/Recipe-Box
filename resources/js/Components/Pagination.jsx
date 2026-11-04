import { router } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div className="flex gap-2 mt-6">
            {links.map((link, index) => (
                <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => router.visit(link.url)}
                    dangerouslySetInnerHTML={{
                        __html: link.label,
                    }}
                    className={`px-3 py-2 rounded border ${
                        link.active
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700'
                    }`}
                />
            ))}
        </div>
    );
}
