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
- `styles/` – Hojas CSS y utilidades de componentes.
- `templates/` – Plantillas de proyectos y tareas.

## Novedades

- Las tareas permiten especificar fecha y hora de vencimiento.
- Los adjuntos se almacenan directamente en el proyecto para consultarlos luego.
- Las tareas con fecha se muestran en el calendario de forma automática.

La aplicación incluye datos de ejemplo la primera vez que se abre para mostrar el funcionamiento básico.

## Estilos y personalización

El diseño utiliza **Tailwind CSS** con soporte para modo oscuro. Los estilos comunes se encuentran en `styles/components.css` donde se definen clases reutilizables (`btn`, `modal`, `task-card`, etc.).

Para cambiar colores o agregar nuevos botones puedes editar ese archivo o aplicar utilidades de Tailwind directamente en el HTML. El tema (claro u oscuro) se guarda en `localStorage` y puede modificarse desde el botón con icono de sol/luna en la esquina superior derecha.
