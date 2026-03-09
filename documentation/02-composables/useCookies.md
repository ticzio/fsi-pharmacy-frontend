# useCookies

Composable para gestionar cookies de forma centralizada y tipada. Facilita leer, escribir, eliminar y sincronizar cookies con refs reactivas.

## Descripción general

- Envuelve la librería `js-cookie`.
- Define opciones por defecto (`expires`, `path`).
- Permite trabajar con valores simples (`string`) o serializados en JSON.
- Incluye un helper reactivo para vincular una cookie a un `Ref` de Vue.

## API

### `useCookies()`

Devuelve un objeto con:

- `getCookie(name: string): string | undefined`  
  Obtiene el valor de la cookie como `string`.

- `getCookieJson<T extends object>(name: string): T | null`  
  Lee la cookie y hace `JSON.parse` al tipo genérico `T`.

- `setCookie(name: string, value: string, options?: CookieOptions): void`  
  Escribe una cookie de texto plano. Mezcla `DEFAULT_OPTIONS` con `options`.

- `setCookieJson(name: string, value: object, options?: CookieOptions): void`  
  Serializa `value` a JSON y lo guarda en la cookie.

- `removeCookie(name: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void`  
  Elimina la cookie. Es importante usar el mismo `path/domain` con el que se creó.

- `useReactiveCookie<T extends SerializableValue>(name: string, defaultValue: T): Ref<T>`  
  Crea un `Ref` cuyo valor se sincroniza bidireccionalmente con la cookie.

## Ejemplos de uso

### Leer y escribir cookies simples

```ts
import { useCookies } from '@/composables/useCookies'

const { getCookie, setCookie, removeCookie } = useCookies()

setCookie('token', 'abc123')

const token = getCookie('token')

removeCookie('token')
```

### Trabajar con objetos (JSON)

```ts
import { useCookies } from '@/composables/useCookies'

const { getCookieJson, setCookieJson } = useCookies()

setCookieJson('user', { id: 1, name: 'Juan' })

const user = getCookieJson<{ id: number; name: string }>('user')
```

### Cookie reactiva

```ts
import { useCookies } from '@/composables/useCookies'

const { useReactiveCookie } = useCookies()

const theme = useReactiveCookie<'light' | 'dark'>('theme', 'light')

// Cambiar el valor actualiza la cookie automáticamente
theme.value = 'dark'
```
