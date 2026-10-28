import { useSesion } from "../sesion/SesionContext";
import { Navigate , Outlet, useLocation } from "react-router";


export function RutaProtegida(){
    const usuario = (useSesion);

    const ubicacion = useLocation();

    if(!usuario){
        return <Navigate to="/entrar" replace state={{ desde: ubicacion.pathname }} />;
    }

    return <Outlet />;
}