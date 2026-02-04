# Base de Datos - Sistema de Abordajes Comunitarios

## 🚀 Configuración Inicial

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto (copia desde `.env.local.example`):

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=bd_sistema_abordajes
```

### 2. Crear la Base de Datos en MySQL

Asegúrate de tener MySQL instalado y corriendo. Luego crea la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS `bd_sistema_abordajes`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
```

### 3. Generar y Aplicar Migraciones

```bash
# Generar archivos de migración desde el esquema
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:migrate
```

## 📚 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run db:generate` | Genera archivos de migración SQL desde los esquemas TypeScript |
| `npm run db:migrate` | Aplica las migraciones a la base de datos |
| `npm run db:push` | Sincroniza el esquema directamente sin migraciones (⚠️ solo desarrollo) |
| `npm run db:studio` | Abre Drizzle Studio para explorar la BD visualmente |
| `npm run db:seed` | Puebla la base de datos con datos de ejemplo iniciales |

## 🏗️ Estructura del Esquema

El esquema de base de datos está organizado en:

### Tablas Base
- **`responsable`** - Responsables de comunidades
- **`tejedores`** - Voluntarios de la organización
- **`especialidades`** - Catálogo de especialidades médicas
- **`enfermedades`** - Catálogo de enfermedades

### Tablas Principales
- **`comunidades`** - Comunidades atendidas
- **`pacientes`** - Pacientes registrados
- **`abordaje`** - Eventos de abordaje comunitario
- **`medicamentos`** - Inventario de medicamentos
- **`organismos`** - Organismos asociados

### Tablas de Relación
- **`medicos`** - Médicos (tejedores con especialidad)
- **`antecedentes`** - Historial médico de pacientes
- **`consultas`** - Consultas médicas realizadas

### Tablas Puente (Many-to-Many)
- **`abordaje_comunidad`** - Relación abordajes ↔ comunidades
- **`tejedores_abordaje`** - Relación tejedores ↔ abordajes
- **`consultas_enfermedades`** - Relación consultas ↔ enfermedades
- **`medicamentos_pacientes`** - Entrega de medicamentos a pacientes

## 💻 Uso en el Código

### Importar la Base de Datos

```typescript
import { db, schema } from '@/db';
```

### Ejemplos de Queries

#### SELECT - Leer datos

```typescript
// Obtener todos los tejedores
const allTejedores = await db.select().from(schema.tejedores);

// Obtener un paciente específico
const paciente = await db.select()
  .from(schema.pacientes)
  .where(eq(schema.pacientes.cedulaPaciente, '12345678'))
  .limit(1);
```

#### INSERT - Crear registros

```typescript
// Crear un nuevo responsable
await db.insert(schema.responsable).values({
  cedulaResponsable: '12345678',
  nombreResponsable: 'Juan',
  apellidoResponsable: 'Pérez',
  direccionResponsable: 'Av. Principal',
  telefonoResponsable: '04121234567',
  correoResponsable: 'juan@example.com',
  cargo: 'Presidente'
});
```

#### UPDATE - Actualizar registros

```typescript
import { eq } from 'drizzle-orm';

// Actualizar existencia de medicamento
await db.update(schema.medicamentos)
  .set({ existencia: 50 })
  .where(eq(schema.medicamentos.codigoMedicamento, 'MED-001'));
```

#### DELETE - Eliminar registros

```typescript
// Eliminar un abordaje
await db.delete(schema.abordaje)
  .where(eq(schema.abordaje.codigoAbordaje, 'ABD-001'));
```

#### JOINS - Consultas con relaciones

```typescript
import { eq } from 'drizzle-orm';

// Obtener comunidades con sus responsables
const comunidadesConResponsables = await db.select()
  .from(schema.comunidades)
  .leftJoin(
    schema.responsable,
    eq(schema.comunidades.cedulaResponsable, schema.responsable.cedulaResponsable)
  );
```

## 🔒 Seguridad

- ✅ Las credenciales están en `.env.local` (NO comitear al repositorio)
- ✅ Todos los queries usan prepared statements (protección SQL injection)
- ✅ Foreign keys configuradas para integridad referencial
- ✅ Constraints ON DELETE y ON UPDATE apropiados

## 🎨 Drizzle Studio

Para explorar la base de datos visualmente:

```bash
npm run db:studio
```

Esto abrirá una interfaz web en `https://local.drizzle.studio` donde puedes:
- Ver todas las tablas y sus datos
- Ejecutar queries
- Editar registros
- Visualizar relaciones

## 📝 Notas Importantes

1. **Códigos Autogenerados**: Las tablas usan códigos como `COM-001`, `ESP-001`, etc. Asegúrate de implementar la lógica de generación en tu aplicación.

2. **Tipos TypeScript**: Todos los esquemas tienen tipos inferidos automáticamente:
   ```typescript
   import type { Tejedor, NewTejedor } from '@/db/schema/tejedores';
   ```

3. **Character Set**: Toda la DB usa `utf8mb4` para soporte completo de caracteres especiales y emojis.

4. **Fechas y Horas**: 
   - Los campos `DATE` se mapean a objetos `Date` de JavaScript
   - Los campos `TIME` se manejan como strings en formato `HH:MM:SS`

## 🐛 Troubleshooting

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Confirma las credenciales en `.env.local`
- Verifica que el puerto 3306 esté abierto

### Error: "Table doesn't exist"
- Ejecuta `npm run db:migrate` para crear las tablas
- O usa `npm run db:push` para desarrollo

### Error: "Foreign key constraint fails"
- Verifica que los registros referenciados existan
- Respeta el orden de inserción (ej: crear `responsable` antes de `comunidades`)
