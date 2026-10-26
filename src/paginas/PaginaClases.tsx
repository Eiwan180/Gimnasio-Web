import { Link } from 'react-router';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { useClases } from '../hooks/useClases.ts';
import { urlImagen } from '../servicios/api.ts';

export function PaginaClases() {
  const { clases, cargando, error, reintentar } = useClases();

  if (cargando) return <Cargando />;

  if (error) {
    return (
      <MensajeError
        mensaje={error}
        onReintentar={reintentar}
      />
    );
  }

  return (
    <>
      <section className="pagina__encabezado">
        <h1>Clases</h1>

        <p className="pagina__bajada">
          Elige una clase para ver sus horarios e inscribirte.
        </p>
      </section>

      <div className="rejilla">
        {clases.map((clase) => (
          <Link
            key={clase.id}
            to={`/clases/${clase.id}`}
            className="tarjeta-clase"
          >
            <img
              className="tarjeta-clase__imagen"
              src={urlImagen(clase.imagen)}
              alt={clase.nombre}
            />

            <div className="tarjeta-clase__cuerpo">
              <span
                className={`etiqueta etiqueta--${clase.categoria}`}
              >
                {clase.categoria}
              </span>

              <span className="tarjeta-clase__titulo">
                {clase.nombre}
              </span>

              <span className="tarjeta-clase__meta">
                {clase.duracionMin} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}