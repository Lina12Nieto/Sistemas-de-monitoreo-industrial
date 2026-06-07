# Decisiones tecnicas

## 1. ¿Cómo modelaste la relación entre sensores y zonas y por qué?

Teniendo en cuenta lo descrito en los requerimeintos de los proyectos la relacion entre sensores y zonas la modele como una relacion muchos a muchos mediante una tabla intermedia llamada monitorings.

Esta decision la tome porque un sensor puede monitorear varias zonas y una zona puede tener varios sensores activos al mismo tiempo. Ademas, la relacion no era simplemente una union entre dos tablas, sino que tambien necesitaba guardar informacion propia, como:

- Fecha de instalacion.
- Tipo de lectura.
- Valor umbral.
- Estado del monitoreo.
- Valor actual simulado para poder mostrar alertas visuales.

Por esa razon, monitorings funciona como una entidad propia dentro del sistema, no solo como una tabla puente. Esto permite consultar, crear y actualizar cada asignacion de forma independiente.

Ademas de esto también agregue una restricción UNIQUE(sensor_id, zone_id) que evitar que el mismo sensor sea asignado más de una vez a la misma zona, esto permite que no hallan duplicados.

## 2. ¿Qué validación o restricción consideras más importante en tu solución y por qué?

La restriccion mas importante es evitar duplicados en la asignacion entre sensor y zona mediante UNIQUE(sensor_id, zone_id).

Esta validacion es importante porque mantiene la consistencia de la informacion. Si el mismo sensor pudiera asignarse varias veces a la misma zona, el sistema podria mostrar conteos incorrectos, alertas duplicadas o monitoreos contradictorios con distintos umbrales y estados.

Ademas de la restriccion en base de datos, tambien se valida desde el backend antes de crear un monitoreo. Si ya existe una asignacion, la API responde con un error `400` y un mensaje descriptivo. Esto mejora la experiencia del usuario y evita que los errores llegen de maner generica desde la base de datos.

## 3. ¿Cómo organizaste la estructura de tu backend (capas, servicios, controladores, etc.) y por qué elegiste esa organización?

Organice el backend en capas separadas:

- middelware/: manejo de errores globales
- models/: contiene los modelos ORM de SQLAlchemy.
- schemas/: contiene los schemas de Pydantic para validar entradas y definir respuestas.
- services/: contiene la logica de negocio.
- routers/: contiene los endpoints REST.
- database.py: centraliza la conexion a PostgreSQL y la sesion de base de datos.
- main.py: configura la aplicacion FastAPI, CORS y registra los routers.

Elegir esta estructura me permitio tener el proyecto mas ordenado y facil de mantener. Los routers no contienen toda la logica directamente; solo reciben la peticion, llaman al servicio correspondiente y devuelven la respuesta.

La logica de negocio queda en services/, por ejemplo:

- Validar si un sensor existe.
- Validar si una zona existe.
- Evitar asignaciones duplicadas.
- Filtrar monitoreos por estado.
- Recalcular si un monitoreo esta en alerta.

Esta separacion permite que el codigo sea mas claro y que sea mas sencillo agregar nuevas funcionalidades sin mezclar responsabilidades.

## 4. Si tuvieras un día adicional para mejorar el proyecto, ¿qué funcionalidad o mejora técnica implementarías primero y por qué?

## 4. Si tuvieras un día adicional para mejorar el proyecto, ¿qué funcionalidad o mejora técnica implementarías primero y por qué?

Si tuviera un día adicional, implementaría primero un sistema de historial de lecturas para cada monitoreo.

## 4. Si tuvieras un día adicional para mejorar el proyecto, ¿qué funcionalidad o mejora técnica implementarías primero y por qué?

Si tuviera un día adicional, implementaría primero un sistema de notidicaciones automatizadas.

Hoy el valor actual de cada sensor se actualiza manualmente. esta seria una funcionalidad porque actualmente el sistema muestra las alertas dentro de la aplicación, pero en un entorno industrial real una alerta crítica debe llegar rápidamente a la persona responsable, incluso si no está mirando el dashboard en ese momento.
cada sensor enviaría su lectura automáticamente cada ciertos segundos. Para demostrarlo en una prueba sin hardware físico, crearía un script que simule ese comportamiento — generando valores aleatorios dentro del rango de cada tipo de sensor y enviándolos al sistema periódicamente, igual que lo haría un sensor real. Así el dashboard se actualizaría solo, las alertas aparecerían y desaparecerían en tiempo real, y el sistema podría ver el sistema funcionando como lo haría en una planta industrial real. Adicioanal a esto haria un sistema de notificaciones no solo desde el dashboard del sistema sino que por medio de mensajes via sms, correo o whatsapp.Teniendo en cuenta esto, debería añadir un registro de usuarios o contactos responsables para que se puedan enviar las notificaciones y asi esten informados si ocurre un evento "Superar el valor del umbral en una zona" sin estar visualizando siempre el sistema.  

También implementaria roles básicos dentro del sistema, como administrador, supervisor y operador. El administrador podría gestionar sensores, zonasy configuraciones de alerta; el supervisor podría recibir notificaciones y revisar el estado de las zonas asignadas; y el operador podría consultar el dashboard y actualizar estados de monitoreo.