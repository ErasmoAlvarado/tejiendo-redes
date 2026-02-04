import { mysqlTable, varchar, text, int, mediumint, index } from 'drizzle-orm/mysql-core';
import { responsable } from './responsable';

/**
 * Tabla: comunidades
 * Comunidades atendidas por la organización
 */
export const comunidades = mysqlTable('comunidades', {
    codigoComunidad: varchar('codigo_comunidad', { length: 10 }).primaryKey().notNull(), // COM-001...
    nombreComunidad: varchar('nombre_comunidad', { length: 150 }).notNull(),
    tipoComunidad: varchar('tipo_comunidad', { length: 2 }).notNull(), // Ej. Urbana, Rural, Indígena, Base de Misiones
    estado: varchar('estado', { length: 25 }).notNull(),
    municipio: varchar('municipio', { length: 50 }).notNull(),
    direccion: varchar('direccion', { length: 150 }).notNull(),
    ubicacionFisica: text('ubicacion_fisica').notNull(),
    cedulaResponsable: varchar('cedula_responsable', { length: 12 }).notNull().references(() => responsable.cedulaResponsable, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    cantidadHabitantes: int('cantidad_habitantes').notNull(),
    cantidadFamilias: mediumint('cantidad_familias').notNull(),
    telefonoComunidad: varchar('telefono_comunidad', { length: 15 }).notNull(),
}, (table) => ({
    cedulaResponsableIdx: index('idx_cedula_responsable').on(table.cedulaResponsable),
}));

export type Comunidad = typeof comunidades.$inferSelect;
export type NewComunidad = typeof comunidades.$inferInsert;
