import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Sesion } from '../tipos.ts';
import { entrar as entrarApi, registrar as registrarApi } from '../servicios/sesion.ts';

const CLAVE_SESION = 'gimnasio.sesion';

interface ValorSesion {
  sesion: Sesion | null;
  entrar: (correo: string, password: string) => Promise<void>;
  registrar: (nombre: string, correo: string, password: string) => Promise<void>;
  salir: () => void;
}

const SesionContext = createContext<ValorSesion | null>(null);

function leerSesion(): Sesion | null {
  const guardada = localStorage.getItem(CLAVE_SESION);
  if (!guardada) return null;

  try {
    return JSON.parse(guardada) as Sesion;
  } catch {
    localStorage.removeItem(CLAVE_SESION);
    return null;
  }
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion);

  function guardar(nuevaSesion: Sesion) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
    setSesion(nuevaSesion);
  }

  async function entrar(correo: string, password: string) {
    guardar(await entrarApi(correo, password));
  }

  async function registrar(nombre: string, correo: string, password: string) {
    guardar(await registrarApi(nombre, correo, password));
  }

  function salir() {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }

  return (
    <SesionContext.Provider value={{ sesion, entrar, registrar, salir }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);

  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de SesionProvider');
  }

  return contexto;
}
