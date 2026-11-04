
function getCsrfToken() {
    if (typeof document === 'undefined') {
        return null;
    }

    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='));

    return cookie
        ? decodeURIComponent(cookie.split('=')[1])
        : null;
}

export async function fetcher(url, options = {}) {
    const method = (options.method ?? 'GET').toUpperCase();

    const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
    };

    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            headers['X-XSRF-TOKEN'] = csrfToken;
        }
    }

    const response = await fetch(url, {
        ...options,
        method,
        headers,
        credentials: 'same-origin',
    });

    if (!response.ok) {
        const info = await response.json().catch(() => null);

        const error = new Error(
            info?.message ?? 'An error occurred while fetching data.'
        );

        error.status = response.status;
        error.info = info;

        throw error;
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
