# Práctica 16 - El gimnasio: Sesión con contexto y JWT

## 📋 Preguntas y Respuestas de la Práctica

### **Ejercicio 1: El contexto de sesión**

#### **1. ¿Por qué se usa un contexto y no props para la sesión?**
* **Respuesta:**  
  Se utiliza un **Contexto (`React.Context`)** en lugar de *props* para evitar el problema conocido como **Prop Drilling** (pasar datos manualmente a través de múltiples niveles de componentes intermedios que no necesitan esa información).
  npm run prisma:generate
  La sesión del usuario (token, datos del usuario, estado de autenticación) es un estado global que necesitan componentes ubicados en distintos puntos del árbol de la aplicación (como el encabezado/Navbar, rutas protegidas, botones de perfil o de cierre de sesión). Con Context, cualquier componente hijo puede acceder directamente a los datos de la sesión y a las funciones de inicio/cierre de sesión sin importar qué tan profundo esté en la jerarquía.

---

#### **2. ¿Qué pasa si un componente usa la sesión fuera del proveedor (`Provider`)?**
* **Respuesta:**  
  Si un componente llama al hook personalizado (por ejemplo, `useAuth()` o `useSession()`) estando fuera del envoltorio del `<SessionProvider>` (o `<AuthProvider>`):

  1. **Valor por defecto:** Recibirá el valor inicial con el que fue creado el contexto mediante `createContext(defaultValue)`. Si no se especificó un valor por defecto, retornará `undefined` o `null`.
  2. **Errores en tiempo de ejecución:** Si el hook intenta acceder a propiedades o métodos destructurados del contexto (ejemplo: `const { user, logout } = useSession()`), la aplicación lanzará un error tipo `TypeError: Cannot destructure property 'user' of 'useSession(...)' as it is undefined` y la pantalla se romperá.
  3. **Buenas prácticas:** Por esta razón, se suele programar dentro del hook personalizado una validación como la siguiente para detectar el problema tempranamente:
     ```javascript
     if (!context) {
       throw new Error("useSession debe ser utilizado dentro de un SessionProvider");
     }
     ```

---

### **Ejercicio 2: Entrar y mandar el token**

#### **3. ¿Dónde se guarda el token y qué riesgo tiene ese lugar?**
* **Respuesta:**  
  * **Dónde se guarda:** El token JWT se almacena en el **`localStorage`** del navegador (o alternativamente en `sessionStorage`).
  * **Riesgos asociados:**
    * **Vulnerabilidad a ataques XSS (Cross-Site Scripting):** `localStorage` es accesible mediante cualquier código JavaScript que se ejecute en el mismo dominio. Si un atacante logra inyectar un script malicioso en la aplicación (a través de dependencias de terceros desactualizadas, inputs no sanitizados, etc.), puede leer directamente `localStorage.getItem('token')` y robar el JWT del usuario.
    * **Falta de expiración automática local:** A diferencia de las cookies con atributo `Expires` o `Max-Age`, los datos guardados en `localStorage` persisten indefinidamente hasta que sean eliminados explícitamente mediante código o por el usuario.
  * **Mitigación recomendada:** En entornos de alta seguridad, la mejor alternativa es almacenar el token JWT en una **Cookie HttpOnly y Secure**, la cual no es accesible desde JavaScript y previene la extracción directa del token mediante scripts.

---

# Práctica 17 - El Gimnasio: Rutas Protegidas e Inscripciones

---

## Ejercicio 1: Mis inscripciones, sólo con sesión

### ¿La ruta protegida hace segura la aplicación? ¿Qué es lo que de verdad protege los datos?

**No, la ruta protegida en el frontend no hace totalmente segura la aplicación por sí sola.**

* **En el Frontend:** La protección de rutas en el cliente (como una redirección a `/entrar` si no hay token) es principalmente una medida de **UX (Experiencia de Usuario)**. Evita que el usuario navegue a vistas que no le corresponden, pero cualquier persona con conocimientos técnicos podría manipular el código del navegador o inspeccionar las peticiones.
* **Lo que de verdad protege los datos es el Backend (API):** La seguridad real recae en la validación del **JSON Web Token (JWT)** o token de sesión en el servidor. Cada vez que el cliente realiza una petición HTTP (por ejemplo, `GET /inscripciones/mias`), el backend verifica que el token sea válido, no haya expirado y pertenezca a un usuario autenticado. Si no hay token o es inválido, la API responde con un código de estado `401 Unauthorized` y deniega el acceso a los datos.

---

## Ejercicio 2: Inscribirse y el 401

### ¿Por qué no se manda el `miembroId` al inscribirse?

El `miembroId` no se envía explícitamente en el cuerpo (body) ni en la URL de la petición por razones de **seguridad y diseño RESTful**:

1. **Autenticación implícita mediante Token:** Al enviar la petición con el encabezado de autorización (`Authorization: Bearer <token>`), el backend decodifica el token JWT y extrae de forma segura la identidad del usuario (incluyendo su `miembroId`).
2. **Prevención de Suplantación de Identidad (Spoofing):** Si el frontend enviara el `miembroId` manualmente en el cuerpo del mensaje, un usuario malintencionado podría modificar ese ID para inscribir a otras personas sin su consentimiento. Extraer el ID directamente del token firmado garantiza que la acción la realiza estrictamente el usuario autenticado.

---

### ¿Qué diferencia hay entre un 401 y un 403?

Ambos son códigos de estado HTTP de error del cliente en cuanto a acceso, pero tienen significados distintos:

* **`401 Unauthorized` (No autenticado / Token inválido):**
  * **Significado:** El servidor no sabe quién es el usuario. Ocurre cuando no se envía un token de sesión, el token expiró o es inválido/falso.
  * **Acción habitual:** El cliente debe redirigir al usuario al formulario de inicio de sesión (`/entrar`) para identificarse.

* **`403 Forbidden` (No autorizado / Sin permisos):**
  * **Significado:** El servidor **sí sabe quién es el usuario**, pero este **no tiene los permisos requeridos** para realizar la acción o acceder al recurso.
  * **Ejemplo en la práctica:** Un usuario autenticado con rol de *Visitante* o *Entrenador* intenta realizar una acción reservada exclusivamente para la cuenta de un *Miembro* del gimnasio.
  * **Acción habitual:** Mostrar un mensaje de error notificando al usuario que no cuenta con el perfil o los permisos suficientes para esta operación (sin necesidad de cerrar la sesión).

---

## Ejecutar el proyecto

Backend:

```bash
cd backend
npx prisma generate
npx prisma db seed
npm run start:dev
```

Frontend:

```bash
npm install
npm run dev
```
