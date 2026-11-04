import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import AppLayout from './Layouts/AppLayout';
import { hydrateRoot } from 'react-dom/client';

createInertiaApp({
    resolve: async name => {
        const page = await resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx')
        );

        page.default.layout ??= page => (
            <AppLayout>{page}</AppLayout>
        );

        return page;
    },

    setup({ el, App, props }) {
        hydrateRoot(el).render(
            <App {...props} />
        );
    },
});
