# Divnex

Divnex es una WebApp local para gestión de proyectos inspirada en ClickUp y Monday. Todo corre directamente en el navegador sin necesidad de backend ni bases de datos externas.

## Uso

1. Clona este repositorio o descarga los archivos.
2. Abre `index.html` en tu navegador preferido.
3. La aplicación guardará los datos en `localStorage` de forma automática.
4. Puedes exportar o importar un archivo JSON como respaldo.
5. Cada proyecto puede renombrarse o eliminarse desde la barra lateral y las tareas incluyen un botón para borrarlas.

## Estructura

- `index.html` – Entrada principal de la aplicación.
- `divnex.js` – Lógica y modelos de datos.
- `components/` – Componentes reutilizables como columnas Kanban y tarjetas.
- `styles/` – Estilos básicos.
- `templates/` – Plantillas de proyectos y tareas.

La aplicación incluye datos de ejemplo la primera vez que se abre para mostrar el funcionamiento básico.