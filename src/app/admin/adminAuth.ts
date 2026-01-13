export const ADMIN_PASSWORD = 'tsalaadmin';
const AUTH_KEY = 'tsala_admin_auth';
const EXPIRY_HOURS = 24;

interface AuthData {
    token: string;
    expiry: number;
}

export const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
        const now = new Date();
        const expiry = now.getTime() + EXPIRY_HOURS * 60 * 60 * 1000;
        const data: AuthData = {
            token: 'authenticated', // Simple token
            expiry: expiry
        };
        // Simple encryption/encoding (Base64) just to not store plain text "authenticated"
        // Note: Client-side "security" is never truly secure against determined access, 
        // but sufficient for basic admin gating as requested.
        localStorage.setItem(AUTH_KEY, btoa(JSON.stringify(data)));
        return true;
    }
    return false;
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;

    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;

    try {
        const data: AuthData = JSON.parse(atob(stored));
        const now = new Date().getTime();

        if (now > data.expiry) {
            logout();
            return false;
        }

        return data.token === 'authenticated';
    } catch (e) {
        logout();
        return false;
    }
};
