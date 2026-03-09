// version-push.cjs (Versión Final con Lectura de Versión Basada en Git Tag, Commit Flexible y git add .)
const fs = require('fs')
const { execSync } = require('child_process')
const readline = require('readline')

const packagePath = './package.json'

// 1. VALIDACIÓN: Existencia del package.json
if (!fs.existsSync(packagePath)) {
  console.error('\n❌ ERROR: No se encontró el archivo package.json en el directorio actual.')
  process.exit(1)
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
// Dejamos la lectura del entorno/package.json por si Git no tiene tags.
let currentVersion = process.env.CURRENT_VERSION || packageJson.version

function doesGitTagExist(tagName) {
  try {
    const out = execSync(`git tag -l "${tagName}"`, { encoding: 'utf-8', stdio: 'pipe' }).trim()
    return out === tagName
  } catch (e) {
    return false
  }
}

function deleteGitTagLocal(tagName) {
  execSync(`git tag -d "${tagName}"`, { stdio: 'inherit' })
}

function deleteGitTagRemote(tagName) {
  try {
    execSync(`git push origin ":refs/tags/${tagName}"`, { stdio: 'inherit' })
  } catch (e) {
    // Si no existe en remoto o no hay permisos, no bloqueamos el flujo aquí.
  }
}

// [ ... Función askQuestion y incrementCustomVersion sin cambios ... ]
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans)
    }),
  )
}

function incrementCustomVersion(currentVersion, type) {
  let [P, S, M] = currentVersion.split('.').map(Number)

  if (type === 'P') {
    P += 1
    S = 0
    M = 0
  } else if (type === 'M') {
    if (M < 9) {
      M += 1
    } else {
      M = 0
      if (S < 99) {
        S += 1
      } else {
        S = 0
        P += 1
      }
    }
  } else if (type === 'S') {
    if (S < 99) {
      S += 1
      M = 0
    } else {
      S = 0
      M = 0
      P += 1
    }
  } else {
    throw new Error('Tipo de incremento de versión inválido.')
  }
  return `${P}.${S}.${M}`
}

// Función para estilizar las líneas de git status -s usando RegEx para robustez
function formatGitStatus(statusOutput) {
  const lines = statusOutput
    .trim()
    .split('\n')
    .filter((line) => line.trim().length > 0)
  let formattedStatus = ''

  const statusMap = {
    ' M': '📝 **MODIFICADO**', // Modificado en worktree (no staged)
    'M ': '📝 **MODIFICADO (Staged)**', // Modificado en index (staged)
    'A ': '✨ **NUEVO (Staged)**', // Agregado al index (staged)
    ' D': '🗑️ **ELIMINADO**', // Eliminado en worktree (no staged)
    'D ': '❌ **ELIMINADO (Staged)**', // Eliminado del index (staged)
    '??': '🆕 **SIN SEGUIMIENTO**', // No rastreado
    'R ': '♻️ **RENOMBRADO**', // Renombrado (staged)
    'C ': '🔗 **COPIADO**', // Copiado (staged)
    AM: '📝✨ **AÑADIDO/MODIFICADO**',
    MM: '📝📝 **MODIFICADO/MODIFICADO**',
  }

  const regex = /^\s?([A-Z?]{1,2})\s+(.*)$/

  for (const line of lines) {
    const match = line.match(regex)

    if (match) {
      const code = match[1].padEnd(2, ' ')
      const filePath = match[2].trim()

      const statusType = statusMap[code] || statusMap[code.trim()] || '❓ **OTRO**'

      formattedStatus += `[${code.trim()}] ${statusType}: **${filePath}**\n`
    } else {
      formattedStatus += `[---] ⚠️ **ERROR AL PARSEAR**: ${line.trim()}\n`
    }
  }

  return formattedStatus
}

// Función auxiliar para verificar si hay cambios staged después de git add .
function isAnythingStaged() {
  try {
    // Retorna el nombre de los archivos staged, si no hay, retorna cadena vacía.
    const output = execSync('git diff --staged --name-only', {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim()
    return output.length > 0
  } catch (e) {
    return false
  }
}

async function run() {
  // --- 🛡️ Validaciones Iniciales ---
  console.log('\n--- 🛡️ **Validaciones Pre-Ejecución** ---')

  // 2. VALIDACIÓN: Identidad en Git
  try {
    const name = execSync('git config user.name', { encoding: 'utf8', stdio: 'pipe' }).trim()
    const email = execSync('git config user.email', { encoding: 'utf8', stdio: 'pipe' }).trim()
    if (!name || !email) throw new Error('Identidad incompleta')
  } catch (e) {
    console.error('\n❌ ERROR: Tu identidad de Git (user.name o user.email) no está configurada.')
    console.error('Ejecuta: git config --global user.name "Tu Nombre"')
    console.error('         git config --global user.email "tu@email.com"')
    process.exit(1)
  }

  // 3. VALIDACIÓN: Conexión Remota
  try {
    console.log('🔄 Validando conexión con el remoto origin...')
    execSync('git ls-remote --exit-code origin', { stdio: 'ignore' })
  } catch (e) {
    console.error(
      '\n❌ ERROR: No se pudo conectar con origin. Verifica tu conexión a internet o credenciales SSH/HTTPS.',
    )
    process.exit(1)
  }

  // 4. VALIDACIÓN: Estado del Remoto (Up-to-date)
  try {
    console.log('🔄 Verificando estado respecto al remoto origin...')
    execSync('git fetch origin', { stdio: 'ignore' })
    const status = execSync('git status -uno', { encoding: 'utf8', stdio: 'pipe' })
    if (status.includes('Your branch is behind')) {
      console.error('\n❌ ERROR: Tu rama local está por detrás del remoto (behind origin).')
      console.error('Ejecuta "git pull" para actualizar antes de intentar publicar una versión.')
      process.exit(1)
    }
  } catch (e) {
    // Si falla por ser una rama que no tiene upstream u otro motivo menor, se ignora
  }

  console.log('✅ Validaciones iniciales superadas.\n')

  // 💡 CAPTURA DE VERSIÓN PARA ROLLBACK Y BASE
  const versionToRevertTo = process.env.CURRENT_VERSION || packageJson.version
  let currentVersion = versionToRevertTo

  // ----------------------------------------------------
  // 🔍 ESTADO DE GIT
  // ----------------------------------------------------
  console.log('\n--- 📁 **Control de Versiones** ---')
  console.log('🔍 **Estado Actual de Git** (Archivos pendientes):')
  try {
    const status = execSync('git status -s -u', { encoding: 'utf-8', stdio: 'pipe' })

    if (status.trim()) {
      console.log('--- **Archivos Listos para Commit/Add** ---')
      console.log(formatGitStatus(status))
    } else {
      console.log('✨ **No hay cambios pendientes** en el área de trabajo.')
    }
  } catch (e) {
    console.log('⚠️ No se pudo obtener el estado de Git. ¿Estás en un repositorio?')
  }
  console.log('------------------------------------------------------')

  // 🚀 PASO 1: Sincronizar tags y obtener la versión base más alta de Git
  let baseVersion = '0.0.0'

  try {
    console.log('🔄 Sincronizando tags y obteniendo **versión base**...')
    execSync('git fetch --tags', { stdio: 'inherit' })

    const latestTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim()

    baseVersion = latestTag.startsWith('v') ? latestTag.substring(1) : latestTag
    currentVersion = baseVersion

    console.log(`✅ **Versión base de Git:** ${currentVersion}`)
  } catch (e) {
    console.log(
      `❌ **ADVERTENCIA:** No se encontraron tags en Git. Usando versión inicial: ${currentVersion}`,
    )
  }

  if (!/^\d+\.\d+\.\d+$/.test(currentVersion)) {
    console.error(`❌ El formato de versión actual (${currentVersion}) **no es P.S.M**. Abortando.`)
    process.exit(1)
  }

  // 🆕 MENÚ DE RAMIFICACIÓN DEL FLUJO CON 5 OPCIONES
  console.log('\n======================================================')
  console.log('✨ **Elige el Flujo de Publicación** ✨')
  console.log('  1) 🚀 **Subir Versión (Push/Tag)**')
  console.log('  2) 📤 **Commit y Push**')
  console.log('  3) 💾 **Solo Commit Local**')
  console.log('  4) ⏮️ **Retroceder versión a último Tag remoto**')
  console.log('  5) 🚫 **Cancelar**')
  const flowChoice = await askQuestion('👉 Ingresa el número de la opción (1, 2, 3, 4 o 5): ')
  console.log('======================================================')

  if (flowChoice.trim() === '5') {
    console.log('❌ **Proceso cancelado** por el usuario.')
    return
  }

  if (flowChoice.trim() === '4') {
    // NUEVO FLUJO 4: Rollback de versión
    console.log('\n⏩ **FLUJO SELECCIONADO**: Retroceder versión a último Tag remoto.')
    try {
      console.log('🔄 Consultando último tag del remoto...')
      const remoteTags = execSync('git ls-remote --tags --refs --sort="v:refname" origin', {
        encoding: 'utf8',
        stdio: 'pipe',
      }).trim()

      if (!remoteTags) {
        console.error('❌ No se encontraron tags en el repositorio remoto.')
        process.exit(1)
      }

      const lines = remoteTags.split('\n')
      const lastLine = lines[lines.length - 1]
      const lastTagFull = lastLine.split('\t')[1]
      const lastTag = lastTagFull.replace('refs/tags/', '')

      console.log(`\n🏷️ Último tag remoto encontrado: **${lastTag}**`)
      const confirmRollback = await askQuestion(
        `¿Estás seguro de que deseas retroceder el package.json a esta versión? (y/N): `,
      )

      if (confirmRollback.toLowerCase() === 'y') {
        const strippedVersion = lastTag.startsWith('v') ? lastTag.substring(1) : lastTag
        packageJson.version = strippedVersion
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
        console.log(`\n✅ ¡package.json actualizado exitosamente a la versión ${strippedVersion}!`)
        console.log(
          '💡 La versión ha sido cambiada localmente. Revisa los cambios y haz commit cuando estés listo.',
        )
      } else {
        console.log('⏩ Rollback cancelado.')
      }
      return
    } catch (e) {
      console.error('\n❌ Error al intentar obtener el último tag del remoto origin.')
      process.exit(1)
    }
  }

  if (flowChoice.trim() === '2' || flowChoice.trim() === '3') {
    // ----------------------------------------------------
    // FLUJO 2 Y 3: Commit de código (con o sin push)
    // ESTE FLUJO YA ESTÁ CORREGIDO CON isAnythingStaged()
    // ----------------------------------------------------
    const shouldPush = flowChoice.trim() === '2'

    console.log('\n⏩ **FLUJO SELECCIONADO**: Commiteando cambios pendientes.')

    try {
      console.log('... **Agregando** todos los cambios al stage area (`git add .`)...')
      execSync('git add .', { stdio: 'pipe' })

      const hasStagedChanges = isAnythingStaged()

      if (hasStagedChanges) {
        const nonVersionCommitMessage = await askQuestion(
          '💬 Ingresa un **mensaje** para el Commit (obligatorio): ',
        )

        if (!nonVersionCommitMessage.trim()) {
          console.error('❌ **Mensaje de commit obligatorio**. Abortando.')
          process.exit(1)
        }

        console.log('... **Creando commit **...')
        execSync(`git commit -m "${nonVersionCommitMessage.trim()}"`, { stdio: 'inherit' })
        console.log('✅ **Commit completado exitosamente**.')
      } else {
        console.log(
          'ℹ️ No se detectaron nuevos cambios en el área de trabajo para commitear. Saltando el `git commit`.',
        )
      }

      if (shouldPush) {
        console.log('... **Realizando git push** (enviando todos los commits locales)...')
        execSync('git push', { stdio: 'inherit' })
        console.log('🎉 **ÉXITO**: Commits **pusheados**. Versión no modificada.')
      } else {
        console.log('💾 **Proceso finalizado**. Commit(s) guardado(s) localmente.')
      }
      return
    } catch (error) {
      console.error('\n❌ **ERROR CRÍTICO**: Falló el git add, commit o push del código pendiente.')
      process.exit(1)
    }
  }

  if (flowChoice.trim() === '1') {
    // ----------------------------------------------------
    // FLUJO 1: Versionado y Publicación (Robustez OK, siempre hay package.json modificado)
    // ----------------------------------------------------

    // 5. VALIDACIÓN: Rama de Trabajo
    try {
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
        stdio: 'pipe',
      }).trim()
      const allowedBranches = ['main', 'master', 'develop']
      if (!allowedBranches.includes(currentBranch)) {
        console.error(`\n❌ ERROR: No puedes publicar versiones desde la rama "${currentBranch}".`)
        console.error(`Ramas permitidas: ${allowedBranches.join(', ')}`)
        process.exit(1)
      }
    } catch (e) {
      // Ignorar si falla lectura de rama por estar en detached HEAD, aunque debería fallar el push después.
    }

    // 6. VALIDACIÓN: Área de Trabajo Limpia
    try {
      const statusOut = execSync('git status -s', { encoding: 'utf-8', stdio: 'pipe' }).trim()
      if (statusOut) {
        console.log(
          '\n⚠️ ADVERTENCIA: Tienes archivos modificados o sin seguimiento en tu área de trabajo (ver arriba).',
        )
        const proceed = await askQuestion(
          '¿Seguro que quieres forzarlos TODOS en el commit de la versión? (y/N): ',
        )
        if (proceed.toLowerCase() !== 'y') {
          console.log(
            '\n❌ Proceso cancelado por el usuario. Limpia tu área de trabajo e inténtalo de nuevo.',
          )
          process.exit(0)
        }
      }
    } catch (e) {
      // Ignorar
    }

    // 2-4. Lógica de incremento y escritura de package.json
    const newMajorP = incrementCustomVersion(currentVersion, 'P')
    const newMinorS = incrementCustomVersion(currentVersion, 'S')
    const newPatchM = incrementCustomVersion(currentVersion, 'M')

    console.log(`\n**Selecciona la parte a incrementar** (P.S.M):`)
    console.log(`  1) 🟢 **P** (Producción): ${currentVersion} -> ${newMajorP}`)
    console.log(`  2) 🟡 **S** (Significativo): ${currentVersion} -> ${newMinorS}`)
    console.log(`  3) 🔵 **M** (Pequeños): ${currentVersion} -> ${newPatchM}`)
    const typeChoice = await askQuestion('👉 Ingresa el número (1, 2 o 3): ')

    let type
    switch (typeChoice.trim()) {
      case '1':
        type = 'P'
        break
      case '2':
        type = 'S'
        break
      case '3':
        type = 'M'
        break
      default:
        console.error('❌ **Opción inválida**. Abortando.')
        process.exit(1)
    }

    let newVersion = incrementCustomVersion(currentVersion, type)

    // Actualiza el package.json (ESTO GARANTIZA UN COMMIT VÁLIDO)
    packageJson.version = newVersion
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
    console.log(`\n✅ **Versión actualizada a:** ${newVersion}`)

    // LÓGICA DE COMMIT FLEXIBLE
    const defaultCommitMessage = `chore: Release ${newVersion}`
    const commitHeader = await askQuestion(
      `\n💬 Ingresa el **Encabezado del Commit** (Dejar vacío para usar: "${defaultCommitMessage}"): `,
    )
    const finalCommitMessage = commitHeader.trim() || defaultCommitMessage

    // 5. Commitear
    try {
      // PASO 1: COMMIT DE VERSIÓN
      console.log('... **Creando commit de versionado**...')
      // Agrega TODOS los cambios, incluyendo la actualización de package.json y commits pendientes
      execSync('git add .')
      execSync(`git commit -m "${finalCommitMessage}"`, { stdio: 'inherit' })
      console.log('✅ **Commit del versionado completado**.')

      // ----------------------------------------------------
      // PASO 2: CONFIRMACIÓN DE PUBLICACIÓN SIMPLIFICADA
      // ----------------------------------------------------
      console.log('\n======================================================')
      console.log(`Commit Creado: **${finalCommitMessage}**`)

      const confirmPush = await askQuestion(
        `\n🚀 ¿**Confirmas el Push y Tagueo** (v${newVersion}) para publicar la versión? (y/N): `,
      )
      console.log('======================================================')

      if (confirmPush.toLowerCase() === 'y') {
        // PUSH Y TAGUEAR VERSIÓN
        const tagName = `v${newVersion}`
        const tagExists = doesGitTagExist(tagName)

        if (tagExists) {
          console.log(`\n⚠️ El tag **${tagName}** ya existe.`)
          const overwriteTag = await askQuestion(
            '¿Deseas **sobrescribirlo**? (Esto borrará el tag local y tratará de borrarlo en remoto) (y/N): ',
          )

          if (overwriteTag.toLowerCase() !== 'y') {
            console.log(
              '⏩ Push y tagueo **cancelados** porque el tag ya existe. Commit guardado localmente.',
            )
            return
          }

          deleteGitTagLocal(tagName)
          deleteGitTagRemote(tagName)
        }

        console.log(`... **Creando tag**: ${tagName}...`)
        execSync(`git tag -a ${tagName} -m "Release ${newVersion}"`, { stdio: 'inherit' })

        console.log('\n🚀 **Realizando git push** (enviando commit y tags)...')
        execSync('git push && git push --tags', { stdio: 'inherit' })

        console.log(`\n🎉 **ÉXITO**: Versión ${newVersion} commiteada, **tagueada y pusheada**!`)
      } else {
        // NO HACER PUSH
        console.log('⏩ Push y tagueo **cancelados**. Commit de versión guardado localmente.')
      }
    } catch (error) {
      // ----------------------------------------------------
      // 🛑 Lógica de Reversión (para el Flujo 1)
      // ----------------------------------------------------
      console.error('\n❌ **ERROR CRÍTICO**: Falló la operación de Git (Commit, Tag o Push).')

      if (error.stderr) {
        console.error('Causa de Git/Husky:', error.stderr.toString())
      }

      console.error('Revertiendo **package.json** a la versión anterior para evitar conflictos.')

      // La clave es revertir el package.json que se modificó
      fs.writeFileSync(
        packagePath,
        JSON.stringify({ ...packageJson, version: versionToRevertTo }, null, 2) + '\n',
      )
      process.exit(1)
    }
  } else {
    console.error('❌ **Opción de flujo inválida**. Abortando.')
    process.exit(1)
  }
}

run()
