import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './componentes/Layout.tsx';
import { RutaProtegida } from './componentes/RutaProtegida.tsx';

const PaginaClases = lazy(() =>
  import('./paginas/PaginaClases.tsx').then((modulo) => ({
    default: modulo.PaginaClases,
  })),
);

const PaginaClase = lazy(() =>
  import('./paginas/PaginaClase.tsx').then((modulo) => ({
    default: modulo.PaginaClase,
  })),
);

const PaginaEntrar = lazy(() => import('./paginas/PaginaEntrar.tsx'));
const PaginaRegistro = lazy(() => import('./paginas/PaginaRegistro.tsx'));

const PaginaMisInscripciones = lazy(() =>
  import('./paginas/PaginaMisInscripciones.tsx').then((modulo) => ({
    default: modulo.PaginaMisInscripciones,
  })),
);

const NoEncontrado = lazy(() =>
  import('./componentes/NoEncontrado.tsx').then((modulo) => ({
    default: modulo.NoEncontrado,
  })),
);

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/clases" replace />} />

        <Route path="clases">
          <Route index element={<PaginaClases />} />
          <Route path=":id" element={<PaginaClase />} />
        </Route>

        <Route element={<RutaProtegida />}>
          <Route path="mis-inscripciones" element={<PaginaMisInscripciones />} />
        </Route>

        <Route path="entrar" element={<PaginaEntrar />} />
        <Route path="registro" element={<PaginaRegistro />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}

export default App;
