import { Link } from 'react-router';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { urlImagen } from '../servicios/api.ts';
import { useInscripcionesStore } from '../store/useInscripcionesStore.ts';

export function PaginaMisInscripciones() {
  const inscripciones = useInscripcionesStore((estado) => estado.inscripciones);
  const cargando = useInscripcionesStore((estado) => estado.cargando);
  const error = useInscripcionesStore((estado) => estado.error);
  const cargar = useInscripcionesStore((estado) => estado.cargar);

  if (cargando) return <Cargando />;

  if (error) {
    return (
      <MensajeError
        mensaje={error}
        onReintentar={() => void cargar()}
      />
    );
  }

  return (
    <>
      <section className="pagina__encabezado">
        <h1>Mis inscripciones</h1>
        <p className="pagina__bajada">
          {inscripciones.length === 0
            ? 'Todavía no tienes clases inscritas.'
            : `${inscripciones.length} clase(s) inscrita(s).`}
        </p>
      </section>

      {inscripciones.length === 0 ? (
        <div className="vacio">
          <p>No tienes inscripciones por el momento.</p>
          <Link to="/clases" className="boton">
            Ver clases
          </Link>
        </div>
      ) : (
        <ul className="inscripciones">
          {inscripciones.map((inscripcion) => (
            <li className="inscripcion" key={inscripcion.id}>
              <img
                className="inscripcion__imagen"
                src={urlImagen(inscripcion.clase.imagen)}
                alt={inscripcion.clase.nombre}
                loading="lazy"
              />

              <div>
                <Link
                  to={`/clases/${inscripcion.clase.id}`}
                  className="inscripcion__clase"
                >
                  {inscripcion.clase.nombre}
                </Link>

                <div className="inscripcion__meta">
                  {inscripcion.horario.dia} · {inscripcion.horario.horaInicio} ·{' '}
                  {inscripcion.horario.entrenador}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
