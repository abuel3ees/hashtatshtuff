import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let instance: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> {
    if (!instance) {
        (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

        const csrfToken = document.head
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

        const isSecure = window.location.protocol === 'https:';
        instance = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY as string,
            wsHost: window.location.hostname,
            wsPort: isSecure ? 443 : 80,
            wssPort: 443,
            forceTLS: isSecure,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: '/broadcasting/auth',
            auth: { headers: { 'X-CSRF-TOKEN': csrfToken } },
        });
    }
    return instance;
}
