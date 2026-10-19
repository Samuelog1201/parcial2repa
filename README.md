# Pre parcial práctico 2

Proyecto inicial de **Library API**. La consigna está en [Notion](https://app.notion.com/p/3fafaf11db058136a0e0c16bf0527181). Este README también permite identificar qué viene terminado y qué se debe completar.

Alcance ajustado para una sesión de hasta **dos horas**: completar dos endpoints y tres pruebas cortas. No crear otro proyecto ni instalar librerías adicionales. No se incluye autenticación, autorización, JWT, Passport ni frontend.

## 1. Iniciar

Requisitos: Node.js compatible (20.19+ en la rama 20, 22.13+ en la rama 22, o 24.11+ en la rama 24), Docker Desktop abierto y Postman.

Extraer **toda** la carpeta del ZIP y abrirla en el editor. Desde la carpeta que contiene `package.json`:

```bash
npm ci
docker compose up -d --wait
npm run start:dev
```

El segundo comando espera a que PostgreSQL esté listo. Mantener la última terminal abierta mientras se realizan peticiones. No ejecutar los comandos dentro del ZIP sin extraerlo.

- API: `http://localhost:3002/api`
- PostgreSQL local: puerto `5435`, base `library_practice`, usuario y contraseña locales `postgres`.
- No hace falta crear un `.env`: los valores locales ya están configurados. `.env.example` es únicamente una referencia.

Los puertos son diferentes a los predeterminados de Coffee Orders e Inventory API. Si ya están ocupados, detener la copia anterior de **este** proyecto o solicitar ayuda; no eliminar contenedores de otros ejercicios.

### Primera comprobación

Enviar `GET http://localhost:3002/api/categories` y `GET http://localhost:3002/api/books`. Deben responder `200`.

La primera ejecución sobre una base completamente vacía crea:

| Libro | Categoría | Copias disponibles |
| --- | --- | --- |
| Clean Code | Technology | 3 |
| The Pragmatic Programmer | Technology | 1 |
| The Little Prince | Literature | 0 |

Consultar los IDs reales en las respuestas. Los cambios se conservan al reiniciar. Los datos de ejemplo no se vuelven a cargar sobre una base que ya tiene categorías o libros.

## 2. Lo que ya funciona

- `GET /api`: mensaje de la aplicación.
- `GET /api/categories`: categorías existentes.
- `GET /api/books`: libros con su categoría.
- `GET /api/books/search`: búsqueda con filtros y validación de query; se entrega resuelta como referencia y no es una tarea.
- `GET /api/books/:id`: libro existente o `404`.
- `PATCH /api/books/:id`: actualización general de título o copias, con validación.
- `DELETE /api/books/:id`: eliminación general.

También está terminado `BooksService.create()`: busca la categoría, devuelve `404` si no existe y crea y guarda el libro relacionado. Solo falta conectar este método al POST y validar su body.

No modificar los métodos resueltos ni sus DTO. Tampoco cambiar entidades, relaciones, configuración, seeder ni el pipe compartido.

Las rutas POST de creación y PATCH de préstamo están pendientes a propósito; antes de implementarlas, no se espera que funcionen.

## 3. Archivos que se deben completar

Buscar `TODO` en estos siete archivos:

1. `src/books/dto/create-book.dto.ts`
2. `src/books/books.controller.ts`
3. `src/books/books.service.ts`
4. `src/books/book-rules.service.ts`
5. `src/books/books.module.ts`
6. `src/books/book-rules.service.spec.ts`
7. `src/books/books.service.spec.ts`

Los imports de apoyo ya están disponibles. Una importación sin uso al comenzar no es un error que se deba resolver borrándola.

## 4. Bloque 1: crear un libro

Completar `CreateBookDto` y el método de `BooksController` para `POST /api/books`. Delegar en `BooksService.create()`, que ya está implementado y no debe modificarse.

| Campo | Condición |
| --- | --- |
| `title` | Obligatorio; texto diferente de `""`, máximo 80 caracteres. |
| `availableCopies` | Obligatorio; número entero entre 0 y 20. |
| `categoryId` | Obligatorio; número entero mayor o igual a 1. |

Aplicar `requestValidationPipe` al body. Rechazar propiedades adicionales y números escritos como texto. No convertir los números del body.

El servicio proporcionado ya busca la categoría, rechaza con `NotFoundException` si no existe y guarda el libro relacionado si existe. El campo de la entidad se llama `category`; no agregar una columna `categoryId` ni repetir esta lógica en el controlador.

Respuesta válida: `201` con el libro y su categoría. Entrada inválida: `400`. Categoría inexistente: `404`.

## 5. Bloque 2: prestar una copia

Implementar `PATCH /api/books/:id/borrow`, sin body, con `ParseIntPipe` para el ID.

- `BookRulesService.ensureCanBorrow(book)` permite la operación si hay copias; si hay 0, lanza `ConflictException`.
- Registrar el servicio de reglas en `BooksModule` e inyectarlo en `BooksService`; no crearlo con `new` dentro del servicio principal.
- En `borrow(id)`, buscar usando el `findOne()` terminado, llamar a la regla antes de modificar, restar exactamente 1, guardar y devolver el resultado guardado.
- Si la regla rechaza, no cambiar el objeto ni guardar. Si no existe el libro, conservar el `404` del método ya terminado.

Con 3 copias debe quedar en 2. Con 1 debe quedar en 0. Sin copias debe responder `409`; ID `abc`: `400`; ID entero inexistente: `404`.

El préstamo solo descuenta disponibilidad. No se requieren usuarios ni un historial. Las peticiones se realizarán una a la vez.

## 6. Bloque 3: únicamente tres pruebas

Ejecutar desde otra terminal:

```bash
npm test
```

**Al descargar el proyecto, las tres pruebas fallan intencionalmente** con mensajes `TODO TEST`. La configuración ya está terminada. Sustituir cada `throw new Error('TODO TEST ...')` por las comprobaciones del caso; no borrar el `it` ni dejarlo vacío.

| Prueba | Archivo | Comportamiento que debe comprobarse |
| --- | --- | --- |
| 1 | `book-rules.service.spec.ts` | La regla real rechaza un libro con 0 copias mediante `ConflictException`. |
| 2 | `books.service.spec.ts` | Con repositorios y regla simulados, `borrow()` consulta, llama a la regla, guarda 2 copias a partir de 3 y devuelve lo que retorna `save()`. |
| 3 | `books.service.spec.ts` | Si la regla simulada lanza `ConflictException`, `borrow()` rechaza, conserva las copias y no llama a `save()`. |

Los mocks son nuevos en cada `beforeEach`. Preparar sus respuestas en cada prueba. Las pruebas unitarias no necesitan Docker ni PostgreSQL. No importar `AppModule` ni conectarse a la base desde los tests.

Al terminar deben ejecutarse y pasar exactamente los tres casos. No utilizar `skip`, `todo`, `only` ni sustituir comportamientos por `toBeDefined()`.

## 7. Comprobación y entrega

Usar `requests.http` como referencia para copiar peticiones en Postman; no exige instalar extensiones. Modificar los IDs de ejemplo por los reales.

Comprobar por HTTP creación válida con 0 copias, propiedades adicionales, texto donde se necesita un número, categoría inexistente y préstamo con y sin disponibilidad. Comprobar también IDs inválidos o inexistentes. Consultar el libro después para comprobar que el descuento se guardó.

Completar `practice-results.md`. Entregar el proyecto sin `node_modules`, `dist`, contraseñas ni archivos `.env` privados. Conservar nombres de código y rutas en inglés.

Para acotar el ejercicio, los casos con `null` quedan por fuera. No se pide implementar ni modificar búsquedas, filtros, límites o validación de query. No se pide rehacer el CRUD ni añadir librerías o pipes personalizados. El despliegue es un repaso posterior opcional, fuera de las dos horas.

## Comandos de apoyo

```bash
npm run build
npm run typecheck
```

El proyecto inicial debe compilar aunque tenga `TODO`. Compilar no equivale a haber terminado la práctica.

Para detener solo la base de este ejercicio conservando sus datos, ejecutar `docker compose stop` desde esta carpeta. No utilizar `down -v` para solucionar errores: eliminaría los datos del volumen de la práctica.

La sincronización automática de tablas está habilitada solo para esta base local descartable. Nunca conectar este proyecto de práctica a una base con información real. Si se realiza el repaso opcional de despliegue, desactivarla después del primer inicio mediante `DB_SYNC=false` y no publicar credenciales.
