import config from '../config.json';

const isClient = typeof window !== 'undefined';
const API_BASE_URL = isClient
    ? '/api-proxy/'
    : config.service_url_prod.endsWith('/') ? config.service_url_prod : `${config.service_url_prod}/`;

export const getItemsByType = async (type: string) => {
    try {
        console.log(`Fetching items of type: ${type}`);
        const response = await fetch(`${API_BASE_URL}itemsbytype/${type}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch items: ${response.statusText}`);
        }

        const data = await response.json();

        return data || [];
    } catch (err) {
        console.error("Error getting items:", err);
        return [];
    }
};

export const saveItem = async (data: any) => {
    try {
        console.log("Saving item:", data);
        const response = await fetch(`${API_BASE_URL}items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to save item: ${response.statusText}`);
        }
        console.log("Item saved successfully");
        return true;
    } catch (err) {
        console.error("Error saving item:", err);
        throw err;
    }
};

export const deleteItem = async (id: string) => {
    try {
        console.log(`Deleting item: ${id}`);
        const response = await fetch(`${API_BASE_URL}removeitem/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete item.");
        }
        console.log("Item deleted successfully:", id);
        return true;
    } catch (err) {
        console.error("Error deleting item:", err);
        throw err;
    }
};

export const getSecrets = async () => {
    try {
        // Using service_url_prod from config as base
        // User sample: config.aws_service_url + "getsecrets"
        // I'll assume API_BASE_URL covers it.
        const response = await fetch(`${API_BASE_URL}getsecrets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Get Secrets" }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch secrets: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Failed to fetch secrets:", err);
        throw err;
    }
};
