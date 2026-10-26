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
