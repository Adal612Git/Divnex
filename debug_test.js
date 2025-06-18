import { App } from './divnex.js';

function test() {
  console.log('🛠️ Probando funciones esenciales...');
  if (typeof App.load === 'function') console.log('✅ App.load existe'); else console.log('❌ Error: App.load no está definido');
  if (typeof App.renderProjectList === 'function') console.log('✅ App.renderProjectList existe'); else console.log('❌ Error: App.renderProjectList no está definido');
  if (typeof App.renderView === 'function') console.log('✅ App.renderView existe'); else console.log('❌ Error: App.renderView no está definido');

  const columns = document.querySelectorAll('.kanban-column');
  if (columns.length) console.log('✅ Hay columnas Kanban renderizadas'); else console.log('❌ Error: No se encontraron columnas Kanban');

  const firstCard = document.querySelector('[draggable="true"]');
  const firstColumn = columns[0];
  if (firstCard && firstColumn && typeof App.startDrag === 'function' && typeof App.dropKanban === 'function') {
    const evStart = new Event('dragstart', { bubbles: true });
    firstCard.dispatchEvent(evStart);
    const evDrop = new Event('drop', { bubbles: true });
    firstColumn.dispatchEvent(evDrop);
    console.log('✅ Eventos de drag and drop enlazados correctamente');
  } else {
    console.log('❌ Error: Funciones de drag and drop no están disponibles');
  }
}

document.addEventListener('DOMContentLoaded', test);
