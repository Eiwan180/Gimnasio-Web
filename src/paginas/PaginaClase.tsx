import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { useClase } from '../hooks/useClase.ts';
import { urlImagen, estadoDeError } from '../servicios/api.ts';
import { useSesion } from '../sesion/SesionContext.tsx';
import { useState } from 'react';

interface Aviso {
  mensaje: string;
  tipo: 'exito' | 'error';
}

export function PaginaClase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idClase = Number(id);
  const { clase, cargando, error, reintentar } = useClase(idClase);

  const navegar = useNavigate();

  const ubicacion = useLocation();

  const usuario = useSesion();

  const [aviso, setAviso] = useState<Aviso | null>(null);

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />;
  if (!clase) return null;

  async function inscribir(horarioId: number) {
    if (!usuario) {
      setAviso({ mensaje: 'Necesitas iniciar sesión para inscribirte.', tipo: 'error' });
      return;
    }

    try {
      await inscribir(horarioId);
      navegar('/mis-inscripciones');
    }catch (e) {
      if (estadoDeError(e) === 409) {
        setAviso({ tipo: 'error', mensaje: 'Ya te encuentras inscrito en esta clase.' });
      }else {
        setAviso({ tipo: 'error', mensaje: 'No se pudo completar la inscripcion' });
      }
    }
  }

  return (
    <>
      <Link to="/clases" className="detalle__volver">   
        ← Todas las clases
      </Link>

      <article className="detalle">
        {aviso && <p role="status">{aviso.mensaje}</p>}
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
          {aviso && <p className={`aviso aviso--${aviso.tipo}`}>{aviso.mensaje}</p>}
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
                    onClick={() => inscribir(horario.id)}
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
