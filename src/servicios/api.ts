import axios from 'axios';
import type { Sesion } from '../tipos.ts';

export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: URL_API,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const guardada = localStorage.getItem('gimnasio.sesion');

  if (guardada) {
    try {
      const sesion = JSON.parse(guardada) as Sesion;
      config.headers.Authorization = `Bearer ${sesion.token}`;
    } catch {
      localStorage.removeItem('gimnasio.sesion');
    }
  }

  return config;
});

export interface Sobre<T> {
  data: T;
}

export function urlImagen(ruta: string): string {
  return `${URL_API}${ruta}`;
}

export function mensajeDeError(e: unknown, generico: string): string {
  if (axios.isAxiosError(e)) {
    if (e.response?.status === 401 && e.config?.url !== '/auth/login') {
      return 'Tu sesión terminó. Vuelve a entrar.';
    }

    const mensaje = e.response?.data?.message;
    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string') return mensaje;
  }

  return generico;
}

export function estadoDeError(e: unknown): number | undefined {
  return axios.isAxiosError(e) ? e.response?.status : undefined;
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      window.dispatchEvent(new Event('sesion-terminada'));
    }

    return Promise.reject(error);
  }
)