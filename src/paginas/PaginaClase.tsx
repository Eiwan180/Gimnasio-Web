import { Link, useNavigate, useParams } from 'react-router';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { useClase } from '../hooks/useClase.ts';
import { urlImagen } from '../servicios/api.ts';

export function PaginaClase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idClase = Number(id);
  const { clase, cargando, error, reintentar } = useClase(idClase);

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />;
  if (!clase) return null;

  return (
    <>
      <Link to="/clases" className="detalle__volver">
        ← Todas las clases
      </Link>

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
            {clase.horarios.map((horario) => (
              <li className="horario" key={horario.id}>
                <div>
                  <div className="horario__dia">
                    {horario.dia} · {horario.horaInicio}
                  </div>
                  <div className="horario__meta">
                    {horario.entrenador} · {horario.disponibles} de {horario.cupoMaximo} lugares
                  </div>
                </div>

                {horario.disponibles === 0 ? (
                  <span className="horario__lleno">Lleno</span>
                ) : (
                  <button
                    className="boton boton--chico"
                    onClick={() => navigate('/entrar')}
                  >
                    Inscribirme
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
