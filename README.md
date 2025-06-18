@@ -6,25 +6,33 @@ Divnex es una WebApp local para gestión de proyectos inspirada en ClickUp y Mon

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

Divnex utiliza **Tailwind CSS**. Los estilos comunes se definen en `styles/components.css` y el archivo `tailwind.config.js` habilita el modo oscuro por clase.

- Para modificar colores o fuentes edita `tailwind.config.js`.
- Puedes agregar más botones reutilizando las clases `btn`, `btn-primary`, `btn-outline` o `btn-danger`.
- El modo claro/oscuro se cambia con el botón de sol/luna en el encabezado y se recuerda usando `localStorage`.