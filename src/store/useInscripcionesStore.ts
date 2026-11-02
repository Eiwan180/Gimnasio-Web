import { create } from 'zustand';
import type { Inscripcion } from '../tipos.ts';
import { traerMisInscripciones } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';

interface EstadoInscripciones {
  inscripciones: Inscripcion[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  vaciar: () => void;
}

export const useInscripcionesStore = create<EstadoInscripciones>((set) => ({
  inscripciones: [],
  cargando: false,
  error: null,

  cargar: async () => {
    set({ cargando: true, error: null });

    try {
      const inscripciones = await traerMisInscripciones();
      set({ inscripciones, cargando: false });
    } catch (e) {
      set({
        inscripciones: [],
        cargando: false,
        error: mensajeDeError(e, 'No se pudieron cargar tus inscripciones.'),
      });
    }
  },

  vaciar: () => {
    set({ inscripciones: [], cargando: false, error: null });
  },
}));
