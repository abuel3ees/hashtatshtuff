import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let instance: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> {
    if (!instance) {
        (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

        const csrfToken = document.head
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

        instance = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY as string,
            wsHost: import.meta.env.VITE_REVERB_HOST as string,
            wsPort: parseInt(import.meta.env.VITE_REVERB_PORT ?? '8080'),
            wssPort: parseInt(import.meta.env.VITE_REVERB_PORT ?? '8080'),
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: '/broadcasting/auth',
            auth: { headers: { 'X-CSRF-TOKEN': csrfToken } },
        });
    }
    return instance;
}
