Reto: Navegador de países (REST Countries) + similares
Alcance:
Lista
Tabla de busqueda
3 paises recomendados por similitud
Storage: github pages
IA: gemini

. Arquitectura y Dependencias
La aplicación sigue un patrón de Arquitectura de Componentes basada en servicios para el manejo de datos asíncronos.

Módulos: Arquitectura modular sencilla (AppModule).

Servicios: CountryService centraliza las llamadas a REST Countries API y World Bank API usando HttpClient.

Rutas: Navegación basada en parámetros para detalles de país (ej. /country/:code).

Dependencias Clave: Lucide-Angular (iconos), Angular Common/Http.

Modelo de Datos
Aunque el consumo es de APIs externas, el modelo se normaliza localmente:

Interfaces: Country (datos geográficos) y GDPData (indicadores económicos).

Firebase: En esta fase se usa Hosting. Si se añade Firestore:

Colección users: Para guardar favoritos (id, uid, saved_countries[]).

Reglas: allow read, write: if request.auth != null.

Estado y Navegación
Estrategia de Estado: Estado local reactivo. Se utiliza un Subject o BehaviorSubject para emitir los cambios del país seleccionado a los componentes hijos.

Navegación: Uso de Router para cambios de URL.

Lazy Loading: Implementado en la ruta de "Detalles" para reducir el bundle inicial, cargando el módulo de gráficas solo cuando es necesario.

Decisiones Técnicas
CSS Puro para Gráficas: Se evitó Chart.js o D3 para mantener el First Contentful Paint (FCP) bajo y evitar dependencias pesadas.

RxJS lastValueFrom: Uso de Promesas en la lógica de comparación de PIB para manejar múltiples peticiones secuenciales/paralelas de forma más legible.

OnPush Change Detection: Optimización para que Angular solo renderice cuando los datos de la API cambien.

Escalabilidad y Mantenimiento
Crecimiento: Implementación de un Pattern Repository para que, si mañana cambia la API de países, solo se modifique el servicio y no los componentes.

Migrabilidad: Separación estricta entre la lógica de negocio (servicios) y la UI (componentes presentacionales).

Seguridad y Validaciones

Sanitización: Uso del pipe Async y protección nativa de Angular contra XSS en los inputs de búsqueda.

Rendimiento
Caché: Uso de LocalStorage para persistir el último país consultado y evitar llamadas redundantes a la API.

Llamadas Agrupadas: Uso de forkJoin de RxJS para disparar las peticiones de PIB de los países similares simultáneamente.

Accesibilidad (A11y)
Teclado: Gestión de foco en el buscador y navegación mediante tabindex.

Contraste: Paleta de colores validada bajo estándares WCAG AA para las barras de la gráfica.

Aria-labels: Etiquetas descriptivas en las banderas y botones de comparación.

. Uso de IA (Gemini)
Dónde: Generación de lógica compleja para el filtrado por rango de población y diseño de la estructura CSS de las barras.

Prompts: "Crea una función en TS que compare dos valores y devuelva un porcentaje máximo de 100 para una barra de progreso".

Riesgos: Alucinaciones en rutas de API. Mitigación: Verificación manual en la documentación oficial de REST Countries.

Limitaciones y Siguientes Pasos
Limitación: La API del Banco Mundial puede tener latencia alta.

Próximo Paso 1: Implementar NGRX para un manejo de estado global más robusto.

Próximo Paso 2: Añadir Modo Oscuro automático basado en las preferencias del sistema.