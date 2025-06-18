# Divnex

Divnex es una WebApp local para gestión de proyectos inspirada en ClickUp y Monday. Todo corre directamente en el navegador sin necesidad de backend ni bases de datos externas.

## Uso

1. Clona este repositorio o descarga los archivos.
2. Abre `index.html` en tu navegador preferido.
3. La aplicación guardará los datos en `localStorage` de forma automática.
4. Puedes exportar o importar un archivo JSON como respaldo.
5. Puedes modificar o eliminar cada tarea desde su tarjeta o fila. Los proyectos muestran su nombre con botones para renombrarlos o eliminarlos.

## Estructura

- `index.html` – Entrada principal de la aplicación.
- `divnex.js` – Lógica, modelos de datos y almacenamiento.
- `components/` – Componentes reutilizables como columnas Kanban y tarjetas.
- `styles/` – Estilos básicos.
- `templates/` – Plantillas de proyectos y tareas.

## Novedades

- Las tareas permiten especificar fecha y hora de vencimiento.
- Los adjuntos se almacenan directamente en el proyecto para consultarlos luego.
- Las tareas con fecha se muestran en el calendario de forma automática.

La aplicación incluye datos de ejemplo la primera vez que se abre para mostrar el funcionamiento básico.

## Estilo y temas

Divnex utiliza Tailwind CSS para todas las vistas. Puedes personalizar colores y componentes desde `styles/components.css` y ajustar la configuración en `tailwind.config.js`.

El botón con ícono de sol/luna en el encabezado permite alternar entre modo claro y oscuro. La elección se guarda automáticamente en `localStorage`.
