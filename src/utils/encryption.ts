export const SECRET_KEY = "TsalaStudioSecureKey2025"; // In a real app, use env var, but this works for client-side obfuscation.

export const encryptParams = (data: Record<string, string>): string => {
    try {
        const jsonStr = JSON.stringify(data);
        // Simple XOR encryption
        let result = '';
        for (let i = 0; i < jsonStr.length; i++) {
            result += String.fromCharCode(jsonStr.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        // Base64 encode to make it URL safe
        return btoa(result);
    } catch (e) {
        console.error("Encryption failed", e);
        return "";
    }
};

export const decryptParams = (token: string): Record<string, string> | null => {
    try {
        // Base64 decode
        const encrypted = atob(token);
        // XOR decrypt
        let result = '';
        for (let i = 0; i < encrypted.length; i++) {
            result += String.fromCharCode(encrypted.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
        }
        return JSON.parse(result);
    } catch (e) {
        console.error("Decryption failed", e);
        return null;
    }
};
