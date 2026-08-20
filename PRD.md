# PRD: Catálogo de Los Simpson con API

## 1. Resumen

Este proyecto transforma la maqueta inicial en una aplicación web de una sola página para explorar personajes y episodios de *Los Simpson*. La información se carga en tiempo real desde The Simpsons API y se presenta en un catálogo visual, adaptable a dispositivos móviles y en español.

## 2. Problema

La versión inicial tenía secciones estáticas y referencias a módulos JavaScript que no existían en el repositorio. Por ello, los controles de búsqueda y los espacios destinados a personajes y episodios no podían cargar ni mostrar datos.

## 3. Objetivo

Ofrecer una interfaz clara y temática que permita:

- Consultar personajes y episodios desde una API pública.
- Explorar los resultados por páginas.
- Buscar coincidencias por nombre dentro de la página consultada.
- Entender los estados de carga, resultados vacíos y errores de conexión.

## 4. Usuarios objetivo

- Estudiantes que consumen y presentan datos de una API REST.
- Personas interesadas en el universo de Los Simpson.
- Personas que consultan el catálogo desde computadora o teléfono.

## 5. Alcance funcional

### Inicio y navegación

- Se añadió una portada con llamadas a la acción para ir a Personajes o Episodios.
- La barra de navegación usa enlaces ancla con desplazamiento suave.
- El enlace activo recibe una apariencia diferenciada al seleccionarlo.

### Catálogo de personajes

- Se consulta `GET https://thesimpsonsapi.com/api/characters?page={n}`.
- Se renderizan tarjetas con retrato, nombre, ocupación, una frase y estado del personaje.
- Los retratos se obtienen desde `https://cdn.thesimpsonsapi.com/500`.
- Se muestra el total de registros proporcionado por la API.
- Los botones Anterior y Siguiente cargan la página correspondiente de resultados.
- El formulario permite filtrar por nombre dentro de los 20 resultados de la página actual.
- El botón Limpiar elimina el texto de búsqueda y restaura la página consultada.

### Catálogo de episodios

- Se consulta `GET https://thesimpsonsapi.com/api/episodes?page={n}`.
- Se renderizan tarjetas con imagen, temporada, número, título, sinopsis y fecha de emisión.
- Incluye búsqueda por título dentro de la página actual, limpieza y paginación.

### Estados y tolerancia a errores

- Mientras una petición está en curso se muestra “Cargando datos de Springfield…”.
- Si no existen coincidencias, se informa al usuario sin dejar la sección vacía.
- Si la API o la red fallan, se muestra un mensaje de error y una tarjeta de estado.
- Los datos mostrados se escapan antes de insertarse en HTML para evitar inyectar contenido recibido desde la API.

## 6. Alcance visual

- Se creó `css/styles.css` con una paleta inspirada en la serie: amarillo, azul Springfield, rosa y azul profundo.
- Se integraron las fuentes web **Luckiest Guy** y **Nunito** para acercar los títulos y el texto al tono visual de Los Simpson.
- El diseño usa tarjetas, botones, estados hover y una dona decorativa creada con CSS.
- Las rejillas se adaptan a pantallas pequeñas mediante una media query para dispositivos con ancho menor a 700 px.
- Se añadieron etiquetas y roles accesibles a los formularios de búsqueda y mensajes de estado.

## 7. Cambios por archivo

| Archivo | Cambio |
| --- | --- |
| `index.html` | Nueva estructura semántica, navegación, hero, formularios de búsqueda, contenedores para resultados y paginación. |
| `css/styles.css` | Hoja de estilos completa y responsive con la identidad visual de la aplicación. |
| `main.js` | Integración de API, renderizado de tarjetas, búsqueda local por página, paginación, manejo de estados y errores. |

## 8. Fuera de alcance actual

- La búsqueda no consulta todas las páginas del API: filtra únicamente la página que el usuario tiene cargada.
- No se mantiene historial, favoritos ni detalles individuales de cada resultado.
- La sección de ubicaciones de la maqueta original no se implementó porque el alcance solicitado se centró en personajes y capítulos.

## 9. Criterios de aceptación

1. Al abrir la página con conexión a internet, se cargan personajes y episodios.
2. Cada catálogo muestra información proveniente de su endpoint correspondiente.
3. Los botones de paginación cambian los resultados consultando la siguiente o anterior página.
4. Las búsquedas y el botón Limpiar funcionan en ambos catálogos.
5. Si falla la API, la interfaz muestra un error comprensible y no falla silenciosamente.
6. La interfaz se mantiene usable en pantallas de escritorio y móviles.
7. HTML, CSS y JavaScript están organizados en líneas legibles y sin errores de sintaxis de JavaScript.

## 10. Verificación realizada

- Se validó la sintaxis con `node --check main.js`.
- Se comprobó que los endpoints de personajes y episodios responden.
- Se comprobó que la URL de retratos del CDN devuelve una imagen válida.
- Se revisó el diff con `git diff --check`.
