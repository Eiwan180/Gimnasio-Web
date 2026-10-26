import { api, type Sobre } from './api.ts';
import type { Sesion, Usuario } from '../tipos.ts';

interface RespuestaToken {
  access_token: string;
  usuario: Usuario;
}

export async function entrar(correo: string, password: string): Promise<Sesion> {
  const respuesta = await api.post<Sobre<RespuestaToken>>('/auth/login', {
    correo,
    password,
  });

  return {
    token: respuesta.data.data.access_token,
    usuario: respuesta.data.data.usuario,
  };
}

export async function registrar(
  nombre: string,
  correo: string,
  password: string,
): Promise<Sesion> {
  const respuesta = await api.post<Sobre<RespuestaToken>>('/auth/registro', {
    nombre,
    correo,
    password,
  });

  return {
    token: respuesta.data.data.access_token,
    usuario: respuesta.data.data.usuario,
  };
}
