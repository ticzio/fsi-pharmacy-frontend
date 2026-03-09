// renameScript.js
import fs from 'fs'
import path from 'path'

/**
 * Recorre de forma recursiva todos los directorios y subdirectorios desde una ruta inicial
 * y los renombra a su versión en minúsculas.
 * @param {string} currentPath - La ruta del directorio a procesar.
 */
function renameDirsToLowercase(currentPath) {
  const items = fs.readdirSync(currentPath)

  for (const item of items) {
    const oldPath = path.join(currentPath, item)
    const stats = fs.statSync(oldPath)

    if (stats.isDirectory()) {
      const newName = item.toLowerCase()
      const newPath = path.join(currentPath, newName)

      // Primero, procesa los subdirectorios antes de renombrar el directorio actual.
      renameDirsToLowercase(oldPath)

      if (oldPath !== newPath) {
        try {
          console.log(`Renombrando: '${oldPath}' -> '${newPath}'`)
          fs.renameSync(oldPath, newPath)
        } catch (error) {
          console.error(`Error al renombrar el directorio ${oldPath}:`, error)
        }
      }
    }
  }
}

// --- INSTRUCCIONES DE USO ---
// 1. Guarda este script en la raíz de tu proyecto (fuera de la carpeta 'src').
// 2. Asegúrate de que la ruta 'src/views/' es correcta.
// 3. Configura tu package.json para usar módulos ES (o cambia el 'import' por 'require').
// 4. Ejecuta el script desde la terminal.

const viewsDirectory = path.join(process.cwd(), 'src', 'views')

if (fs.existsSync(viewsDirectory)) {
  console.log(`Iniciando el proceso en: ${viewsDirectory}`)
  renameDirsToLowercase(viewsDirectory)
  console.log('\n¡Proceso completado! 🎉 Todos los directorios han sido renombrados a minúsculas.')
} else {
  console.error(
    `Error: El directorio '${viewsDirectory}' no fue encontrado. Asegúrate de que la ruta sea correcta.`
  )
}
