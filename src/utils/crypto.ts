/**
 * Utilidades de criptografía para hashear y deshashear datos
 */

/**
 * Convierte un string a ArrayBuffer
 */
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer
}

/**
 * Convierte un ArrayBuffer a string hexadecimal
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer)
  const hexCodes = [...byteArray].map((value) => {
    const hexCode = value.toString(16)
    const paddedHexCode = hexCode.padStart(2, '0')
    return paddedHexCode
  })
  return hexCodes.join('')
}

/**
 * Convierte un string hexadecimal a ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes.buffer
}

/**
 * Convierte un ArrayBuffer a string
 */
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

/**
 * Genera una clave de cifrado a partir de una contraseña usando PBKDF2
 */
async function generateKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * Hashea (cifra) datos usando AES-GCM con una clave derivada de SHA-256
 * @param data - Datos a hashear (objeto o string)
 * @param password - Contraseña para generar la clave (opcional, usa una por defecto)
 * @returns String hasheado en formato hexadecimal
 */
export async function hashData(
  data: any,
  password: string = 'default_app_key_2024'
): Promise<string> {
  try {
    // Convertir datos a JSON string
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data)

    // Generar salt aleatorio
    const salt = window.crypto.getRandomValues(new Uint8Array(16))

    // Generar IV aleatorio
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    // Generar clave
    const key = await generateKey(password, salt)

    // Cifrar datos
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      stringToArrayBuffer(jsonString)
    )

    // Combinar salt + iv + datos cifrados
    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength)
    combined.set(salt, 0)
    combined.set(iv, salt.length)
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length)

    // Convertir a hexadecimal
    return arrayBufferToHex(combined.buffer)
  } catch (error) {
    console.error('Error al hashear datos:', error)
    throw new Error('Error al hashear datos')
  }
}

/**
 * Deshashea (descifra) datos hasheados
 * @param hashedData - Datos hasheados en formato hexadecimal
 * @param password - Contraseña usada para hashear (opcional, usa la misma por defecto)
 * @returns Datos originales parseados
 */
export async function unhashData(
  hashedData: string,
  password: string = 'default_app_key_2024'
): Promise<any> {
  try {
    // Convertir hex a ArrayBuffer
    const combined = hexToArrayBuffer(hashedData)

    // Extraer salt, iv y datos cifrados
    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 28)
    const encryptedData = combined.slice(28)

    // Generar clave
    const key = await generateKey(password, salt)

    // Descifrar datos
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    )

    // Convertir a string y parsear JSON
    const jsonString = arrayBufferToString(decryptedData)

    try {
      return JSON.parse(jsonString)
    } catch {
      // Si no es JSON válido, retornar como string
      return jsonString
    }
  } catch (error) {
    console.error('Error al deshashear datos:', error)
    throw new Error('Error al deshashear datos')
  }
}

/**
 * Genera un hash SHA-256 simple (solo hash, no cifrado)
 * @param data - Datos a hashear
 * @returns Hash SHA-256 en formato hexadecimal
 */
export async function generateSHA256Hash(data: string): Promise<string> {
  const buffer = stringToArrayBuffer(data)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer)
  return arrayBufferToHex(hashBuffer)
}
