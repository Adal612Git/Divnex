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
## Temas

Puedes cambiar entre el tema claro y uno inspirado en VS Code desde el menú superior. El ajuste se guarda en `localStorage`.

## Estilo y personalización

Divnex utiliza **Tailwind CSS** con soporte para modo oscuro mediante la clase `dark`.
Los componentes reutilizan clases definidas en `styles/tailwind.css` como `btn`, `btn-primary` y `task-card`.
Puedes modificar colores o añadir variantes editando ese archivo o extendiendo `tailwind.config` en el bloque de configuración incluido en `index.html`.

Para agregar más botones o ajustar animaciones, simplemente aplica las clases utilitarias de Tailwind o crea nuevas reglas dentro de `styles/tailwind.css`.
