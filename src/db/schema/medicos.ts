import { mysqlTable, varchar, index } from 'drizzle-orm/mysql-core';
import { tejedores } from './tejedores';
import { especialidades } from './especialidades';

/**
 * Tabla: medicos
 * Médicos con sus especialidades y matrículas
 */
export const medicos = mysqlTable('medicos', {
    cedulaTejedor: varchar('cedula_tejedor', { length: 12 }).primaryKey().notNull().references(() => tejedores.cedulaTejedor, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    codigoEspecialidad: varchar('codigo_especialidad', { length: 10 }).notNull().references(() => especialidades.codigoEspecialidad, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    matriculaColegioMedico: varchar('matricula_colegio_medico', { length: 30 }).notNull(),
    matriculaSanidad: varchar('matricula_sanidad', { length: 30 }).notNull(),
}, (table) => ({
    codigoEspecialidadIdx: index('idx_codigo_especialidad').on(table.codigoEspecialidad),
}));

export type Medico = typeof medicos.$inferSelect;
export type NewMedico = typeof medicos.$inferInsert;
