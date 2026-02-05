import { mysqlTable, varchar, index, foreignKey } from 'drizzle-orm/mysql-core';
import { tejedores } from './tejedores';
import { especialidades } from './especialidades';

/**
 * Tabla: medicos
 * Médicos con sus especialidades y matrículas
 */
export const medicos = mysqlTable('medicos', {
    cedulaTejedor: varchar('cedula_tejedor', { length: 12 }).primaryKey().notNull(),
    codigoEspecialidad: varchar('codigo_especialidad', { length: 10 }).notNull(),
    matriculaColegioMedico: varchar('matricula_colegio_medico', { length: 30 }).notNull(),
    matriculaSanidad: varchar('matricula_sanidad', { length: 30 }).notNull(),
}, (table) => ({
    codigoEspecialidadIdx: index('idx_codigo_especialidad').on(table.codigoEspecialidad),
    tejedorFk: foreignKey({
        columns: [table.cedulaTejedor],
        foreignColumns: [tejedores.cedulaTejedor],
        name: 'med_tejedor_fk'
    }).onDelete('restrict').onUpdate('cascade'),
    espFk: foreignKey({
        columns: [table.codigoEspecialidad],
        foreignColumns: [especialidades.codigoEspecialidad],
        name: 'med_esp_fk'
    }).onDelete('restrict').onUpdate('cascade'),
}));

export type Medico = typeof medicos.$inferSelect;
export type NewMedico = typeof medicos.$inferInsert;
