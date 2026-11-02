import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { useClase } from '../hooks/useClase.ts';
import { useSesion } from '../sesion/SesionContext.tsx';
import { inscribirse } from '../servicios/gimnasio.ts';
import { mensajeDeError, urlImagen } from '../servicios/api.ts';
import { useInscripcionesStore } from '../store/useInscripcionesStore.ts';

export function PaginaClase() {
  const { id } = useParams();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const { sesion } = useSesion();
  const idClase = Number(id);
  const { clase, cargando, error, reintentar } = useClase(idClase);

  const inscripciones = useInscripcionesStore((estado) => estado.inscripciones);
  const cargarInscripciones = useInscripcionesStore((estado) => estado.cargar);

  const [aviso, setAviso] = useState<string | null>(null);
  const [errorInscripcion, setErrorInscripcion] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<number | null>(null);

  async function inscribir(horarioId: number) {
    if (!sesion) {
      navegar('/entrar', {
        state: { desde: ubicacion.pathname },
      });
      return;
    }

    setAviso(null);
    setErrorInscripcion(null);
    setEnviando(horarioId);

    try {
      await inscribirse(horarioId);
      await cargarInscripciones();
      setAviso('Inscripción realizada correctamente.');
      reintentar();
    } catch (e) {
      setErrorInscripcion(
        mensajeDeError(e, 'No se pudo realizar la inscripción.'),
      );
    } finally {
      setEnviando(null);
    }
  }

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />;
  if (!clase) return null;

  return (
    <>
      <Link to="/clases" className="detalle__volver">
        ← Todas las clases
      </Link>

      {aviso && <p className="aviso aviso--exito">{aviso}</p>}
      {errorInscripcion && (
        <p className="aviso aviso--error">{errorInscripcion}</p>
      )}

      <article className="detalle">
        <img
          className="detalle__imagen"
          src={urlImagen(clase.imagen)}
          alt={clase.nombre}
        />

        <div className="detalle__datos">
          <span className={`etiqueta etiqueta--${clase.categoria}`}>
            {clase.categoria}
          </span>

          <h1>{clase.nombre}</h1>
          <p className="pagina__bajada">
            {clase.descripcion} · {clase.duracionMin} min
          </p>

          <h2>Horarios</h2>
          <ul className="horarios">
            {clase.horarios.map((horario) => {
              const inscrito = inscripciones.some(
                (inscripcion) =>
                  inscripcion.estado === 'confirmada' &&
                  inscripcion.horario.id === horario.id,
              );

              return (
                <li className="horario" key={horario.id}>
                  <div>
                    <div className="horario__dia">
                      {horario.dia} · {horario.horaInicio}
                    </div>
                    <div className="horario__meta">
                      {horario.entrenador} · {horario.disponibles} de{' '}
                      {horario.cupoMaximo} lugares
                    </div>
                  </div>

                  {inscrito ? (
                    <span className="horario__inscrito">Inscrito</span>
                  ) : horario.disponibles === 0 ? (
                    <span className="horario__lleno">Lleno</span>
                  ) : (
                    <button
                      className="boton boton--chico"
                      disabled={enviando === horario.id}
                      onClick={() => void inscribir(horario.id)}
                    >
                      {enviando === horario.id ? 'Inscribiendo…' : 'Inscribirme'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </>
  );
}
