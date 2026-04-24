
---

## Instrucciones para el agente

Actúa como un experto desarrollador frontend con Angular 19. Necesito que desarrolles una aplicación web completa para un sistema de inventario de tienda, consumiendo una API REST (backend Spring Boot) que ya existe. El backend tiene los siguientes endpoints (todos en inglés). Debes integrarte exactamente con estos:

### API Endpoints (Backend)

**Categorías**
- `GET /api/categories` → lista de `CategoryDTO`
- `GET /api/categories/{id}` → un objeto
- `POST /api/categories` → envía `{ name, description }`, recibe el mismo + `id`
- `PUT /api/categories/{id}` → actualiza
- `DELETE /api/categories/{id}`

**Productos**
- `GET /api/products` (opcional query param `?categoryId=...`) → lista de `ProductDTO`
- `GET /api/products/{id}`
- `POST /api/products` → envía `{ name, description, price, stock, categoryId }`, recibe el objeto completo con `id`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

**Dashboard**
- `GET /api/dashboard/summary` → devuelve `DashboardSummaryDTO`

### Modelos (interfaces TypeScript)
Debes crear interfaces exactas (en inglés, en archivos `.ts` dentro de `app/models`):

```typescript
interface Category {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;      // el backend lo envía como número (BigDecimal -> JSON number)
  stock: number;
  categoryId: number;
  categoryName?: string; // opcional, si el backend lo incluye
}

interface DashboardSummary {
  totalProducts: number;
  totalCategories: number;
  lowStockProductsCount: number;
  lowStockProducts: Product[];
  totalInventoryValue: number;
  productsPerCategory: { [categoryName: string]: number };
}

Estructura del proyecto Angular
Dentro de src/app/ crear:

models/ (las interfaces)

services/ (servicios HTTP)

components/ (componentes de página completa):

dashboard/

products/ (listado y formulario de producto)

categories/ (listado y formulario de categoría)

product-form/ (reutilizable)

category-form/

shared/ (spinner, alertas, etc.)

interceptors/

app-routing.module.ts con rutas:

/dashboard → DashboardComponent

/products → ProductsComponent (lista)

/products/new → ProductFormComponent (crear)

/products/edit/:id → ProductFormComponent (editar)

/categories → CategoriesComponent

/categories/new → CategoryFormComponent

/categories/edit/:id → CategoryFormComponent

Redirección por defecto a /dashboard

Servicios (inyectables)
CategoryService: métodos getAll(), getById(id), create(data), update(id, data), delete(id). Usa HttpClient.

ProductService: similar, más getByCategory(categoryId?).

DashboardService: getSummary().

Todos los servicios deben manejar errores (mostrar notificación) y usar Observable. Incluir un LoadingService opcional para spinner global.

Diseño y estilos
Paleta de colores de Mercado Libre:

Azul principal: #009ee3

Amarillo: #ffe600

Blanco: #ffffff

Gris claro: #f5f5f5

Gris texto: #666666

Bordes suaves, sombras ligeras.

Minimalista, limpio, intuitivo.

Bootstrap 5 (CDN o instalado vía npm). Úsalo para:

Layout responsivo (container, row, col).

Tarjetas (card), tablas (table), botones (btn), formularios (form-control).

Breakpoints: móvil/tablet/desktop.

Bootstrap Icons (CDN) para acciones: editar (pencil), eliminar (trash), agregar (plus), etc.

Spinners: Usar <div class="spinner-border text-primary"> mientras se cargan datos en cada componente.

Alertas: Usar ngx-toastr o simplemente alertas de Bootstrap (alert alert-success/danger) con *ngIf.

Formularios reactivos (FormGroup, FormBuilder) con validaciones:

name: requerido, mínimo 3 caracteres.

price: requerido, mayor a 0.

stock: requerido, entero >= 0.

categoryId: requerido (para productos).

Funcionalidades por componente
DashboardComponent:

Muestra tarjetas con total de productos, categorías, productos con bajo stock, valor total del inventario (formateado como moneda).

Tabla de productos con stock bajo (si hay).

Gráfico simple (opcional: usar Chart.js) de productos por categoría, o simplemente una lista.

ProductsComponent:

Tabla de productos con columnas: nombre, precio, stock, categoría, acciones.

Botón "Nuevo producto" que navega a /products/new.

Botón de filtro por categoría (dropdown con categorías desde API).

Cada fila tiene botones editar (navega a /products/edit/:id) y eliminar (con confirmación).

Spinner mientras carga.

ProductFormComponent:

Reutilizable para crear y editar (detecta si hay id en la ruta).

Formulario con campos: nombre, descripción, precio, stock, categoría (select desde API de categorías).

Botón "Guardar" (crear o actualizar).

Botón "Cancelar" que vuelve a la lista.

Spinner de envío.

CategoriesComponent:

Tabla de categorías (nombre, descripción, acciones).

Botón "Nueva categoría".

Al eliminar una categoría, si tiene productos asociados, mostrar error (el backend devuelve 409 Conflict). Manejar mensaje amigable.

CategoryFormComponent:

Similar a producto, solo nombre y descripción.

Navbar:

Barra superior con logo (texto "Inventario Tienda") y enlaces a Dashboard, Productos, Categorías.

Usar clases de Bootstrap para que sea responsive (navbar-toggler).

Manejo de errores global
Interceptor HTTP que capture errores 4xx/5xx y muestre un toast o alerta.

Para 404: "Recurso no encontrado".

Para 409: "No se puede eliminar porque tiene productos asociados".

Para 400: mostrar los mensajes de validación.

Consideraciones adicionales
Usar environment.ts para la URL base de la API (por defecto http://localhost:8080/api).

La aplicación debe ser completamente responsive (probar en móvil).

Código limpio, con comentarios en inglés o español (da igual), pero las variables, funciones y clases en inglés.

Asegurar que los tipos TypeScript coincidan exactamente con lo que envía el backend.

El backend maneja BigDecimal como número JSON, así que en Angular usas number y formateas con toFixed(2) o currency.

Entregables
Genera todos los archivos necesarios:

app.module.ts, app-routing.module.ts, app.component.html/ts/scss.

Cada servicio, cada componente, cada interfaz.

El index.html debe incluir CDN de Bootstrap 5, Bootstrap Icons y opcionalmente un CSS personalizado.

Opcional: un loading.interceptor.ts para mostrar spinner en todas las peticiones HTTP.

Ejemplo de consumo de servicio (en CategoryService)
typescript
getAll(): Observable<Category[]> {
  return this.http.get<Category[]>(`${this.apiUrl}/categories`);
}
Estructura de carpetas esperada
text
src/
  app/
    models/
      category.model.ts
      product.model.ts
      dashboard-summary.model.ts
    services/
      category.service.ts
      product.service.ts
      dashboard.service.ts
      loading.service.ts (opcional)
    components/
      dashboard/
        dashboard.component.ts/html/scss
      products/
        products.component.ts/html/scss
      product-form/
        product-form.component.ts/html/scss
      categories/
        categories.component.ts/html/scss
      category-form/
        category-form.component.ts/html/scss
      shared/
        spinner/
        alert/
    interceptors/
      error.interceptor.ts
      loading.interceptor.ts
    app-routing.module.ts
    app.module.ts
    app.component.ts
  environments/
    environment.ts
    environment.prod.ts
Instrucciones finales
Genera el código completo y funcional. Explica cómo ejecutarlo (ng serve), cómo configurar la URL del backend si es diferente. Asegúrate de que todos los imports y módulos estén correctos (HttpClientModule, ReactiveFormsModule, RouterModule). La aplicación debe compilar sin errores y comunicarse correctamente con el backend que ya está corriendo en http://localhost:8080.

El diseño debe ser delicado, minimalista, con bordes redondeados, sombras suaves y espaciado agradable. Prioriza la experiencia de usuario: spinners en cada carga, mensajes claros, confirmación antes de eliminar.