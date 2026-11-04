import { Link } from '@inertiajs/react';
import FlashMessage from '@/components/FlashMessage';

export default function AppLayout({ children }) {
    return (
        <div>
            <nav>
                <Link href="/recipes">Recipes</Link>
                {' | '}
                <Link href="/collections">Collections</Link>
                {' | '}
                <Link href="/digests">Weekly Digests</Link>
            </nav>

            <FlashMessage />

            <main>
                {children}
            </main>
        </div>
    );
}
