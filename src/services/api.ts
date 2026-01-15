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

export const getItemBySlug = async (slug: string) => {
    try {
        console.log(`Fetching item by slug: ${slug}`);
        // Ensure API_BASE_URL handles trailing slash correctly as defined at top of file
        const url = `${API_BASE_URL}items/${slug}`;

        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            console.warn(`Failed to fetch item by slug ${slug}: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error getting item by slug:", err);
        return null;
    }
};
// Check if email already exists in newsletter
export const checkSubscription = async (email: string) => {
    try {
        console.log("Checking subscription for email:", email);
        const requestBody = {
            column1: "email",
            value1: email,
            column2: "type",
            value2: "newsletter",
        };

        const response = await fetch(`${API_BASE_URL}items/filter2column`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        return data || [];
    } catch (err) {
        console.error("Error checking subscription:", err);
        return [];
    }
};
// Generic filter function to get items by 2 columns
export const filterItems = async (col1: string, val1: string, col2: string, val2: string) => {
    try {
        console.log(`Filtering items by ${col1}:${val1} and ${col2}:${val2}`);
        const requestBody = {
            column1: col1,
            value1: val1,
            column2: col2,
            value2: val2,
        };

        const response = await fetch(`${API_BASE_URL}items/filter2column`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        return data || [];
    } catch (err) {
        console.error("Error filtering items:", err);
        return [];
    }
};

// Get items by ID
export const getItemsById = async (id: string) => {
    try {
        console.log("Fetching items by ID:", id);
        const response = await fetch(`${API_BASE_URL}items/id/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        return data || [];
    } catch (err) {
        console.error("Error fetching items by ID:", err);
        return [];
    }
};
