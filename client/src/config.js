export const IS_DEVELOPMENT = !import.meta.env.PROD;
export const API_ENDPOINT = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
export const DEBOUNCE_DELAY = 500;
export const AVAILABLE_STORES = { Shopify: ['HeavenStore'], Vtex: ['MagicStore'] };
