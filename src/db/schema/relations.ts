import { mysqlTable, varchar, text, date, int, index, primaryKey } from 'drizzle-orm/mysql-core';
import { abordaje } from './abordajes';
import { comunidades } from './comunidades';
import { consultas } from './consultas';
import { enfermedades } from './enfermedades';
import { medicamentos } from './medicamentos';
import { pacientes } from './pacientes';
import { tejedores } from './tejedores';

/**
 * Tabla puente: abordaje_comunidad
 * Relación muchos a muchos entre abordajes y comunidades
 */
export const abordajeComunidad = mysqlTable('abordaje_comunidad', {
    codigoAbordaje: varchar('codigo_abordaje', { length: 10 }).notNull().references(() => abordaje.codigoAbordaje, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    codigoComunidad: varchar('codigo_comunidad', { length: 10 }).notNull().references(() => comunidades.codigoComunidad, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    observaciones: text('observaciones'),
}, (table) => ({
    pk: primaryKey({ columns: [table.codigoAbordaje, table.codigoComunidad] }),
    codigoComunidadIdx: index('idx_codigo_comunidad').on(table.codigoComunidad),
}));

/**
 * Tabla puente: consultas_enfermedades
 * Relación muchos a muchos entre consultas y enfermedades
 */
export const consultasEnfermedades = mysqlTable('consultas_enfermedades', {
    codigoConsulta: varchar('codigo_consulta', { length: 10 }).notNull().references(() => consultas.codigoConsulta, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    codigoEnfermedad: varchar('codigo_enfermedad', { length: 10 }).notNull().references(() => enfermedades.codigoEnfermedad, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    observacionEspecifica: text('observacion_especifica'), // Nota opcional sobre esta enfermedad en este paciente
}, (table) => ({
    pk: primaryKey({ columns: [table.codigoConsulta, table.codigoEnfermedad] }),
    codigoEnfermedadIdx: index('idx_codigo_enfermedad').on(table.codigoEnfermedad),
}));

/**
 * Tabla puente: medicamentos_pacientes
 * Relación de entrega de medicamentos a pacientes
 */
export const medicamentosPacientes = mysqlTable('medicamentos_pacientes', {
    codigoMedicamento: varchar('codigo_medicamento', { length: 10 }).notNull().references(() => medicamentos.codigoMedicamento, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    cedulaPaciente: varchar('cedula_paciente', { length: 12 }).notNull().references(() => pacientes.cedulaPaciente, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    fechaEntrega: date('fecha_entrega', { mode: 'date' }).notNull(),
    cantidadEntregada: int('cantidad_entregada').notNull(),
    cedulaTejedor: varchar('cedula_tejedor', { length: 12 }).notNull().references(() => tejedores.cedulaTejedor, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
}, (table) => ({
    pk: primaryKey({ columns: [table.codigoMedicamento, table.cedulaPaciente, table.fechaEntrega] }),
    cedulaPacienteIdx: index('idx_cedula_paciente').on(table.cedulaPaciente),
    cedulaTejedorIdx: index('idx_cedula_tejedor').on(table.cedulaTejedor),
}));

/**
 * Tabla puente: tejedores_abordaje
 * Relación muchos a muchos entre tejedores y abordajes
 */
export const tejedoresAbordaje = mysqlTable('tejedores_abordaje', {
    codigoAbordaje: varchar('codigo_abordaje', { length: 10 }).notNull().references(() => abordaje.codigoAbordaje, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    }),
    cedulaTejedor: varchar('cedula_tejedor', { length: 12 }).notNull().references(() => tejedores.cedulaTejedor, {
        onDelete: 'restrict',
        onUpdate: 'cascade'
    }),
    rolEnAbordaje: varchar('rol_en_abordaje', { length: 50 }),
}, (table) => ({
    pk: primaryKey({ columns: [table.codigoAbordaje, table.cedulaTejedor] }),
    cedulaTejedorIdx: index('idx_cedula_tejedor').on(table.cedulaTejedor),
}));

// Export types for all bridge tables
export type AbordajeComunidad = typeof abordajeComunidad.$inferSelect;
export type NewAbordajeComunidad = typeof abordajeComunidad.$inferInsert;

export type ConsultaEnfermedad = typeof consultasEnfermedades.$inferSelect;
export type NewConsultaEnfermedad = typeof consultasEnfermedades.$inferInsert;

export type MedicamentoPaciente = typeof medicamentosPacientes.$inferSelect;
export type NewMedicamentoPaciente = typeof medicamentosPacientes.$inferInsert;

export type TejedorAbordaje = typeof tejedoresAbordaje.$inferSelect;
export type NewTejedorAbordaje = typeof tejedoresAbordaje.$inferInsert;
