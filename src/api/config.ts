// URL base del servidor API
// En desarrollo: usa VITE_API_URL del .env
// En producción (Docker): usa URL relativa (nginx hace el proxy)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Versión de la API
export const API_VERSION = 'v1';

// URL completa de la API
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// URLs específicas por módulo
export const API_ENDPOINTS = {
  auth: `${API_URL}`,
  carrito: `${API_URL}/carrito`,
  catalogo: `${API_URL}/catalogo`,
  cliente: `${API_URL}/clientes`,
  configuracion: `${API_URL}/configuracion`,
  correo: `${API_URL}/correo`,
  cotizaciones: `${API_URL}/cotizaciones`,
  descargas: `${API_URL}/descargas/documentos`,
  documentos: `${API_URL}/documentos`,
  facturacion: `${API_URL}/facturacion`,
  historial: `${API_URL}/historial`,
  images: `${API_URL}/images`, 
  ordenes: `${API_URL}/ordenes`,
  pedidos: `${API_URL}/pedidos`,
  token: `${API_URL}/token`,
  logo: `${API_URL}/logo`,
} as const;
