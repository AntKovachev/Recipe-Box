
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import AppLayout from './Layouts/AppLayout';

createServer(page => createInertiaApp({
    page,
    render: renderToString,

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

    setup: ({ App, props }) => <App {...props} />,
}));
