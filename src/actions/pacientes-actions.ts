'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { pacientes, type NewPaciente, type Paciente } from '@/db/schema/pacientes';
import { comunidades } from '@/db/schema/comunidades';
import { eq } from 'drizzle-orm';

/**
 * Obtener todos los pacientes con su comunidad
 */
export async function getPacientes() {
    try {
        const result = await db.select()
            .from(pacientes)
            .leftJoin(comunidades, eq(pacientes.codigoComunidad, comunidades.codigoComunidad));

        // Transformar data para el cliente
        const data = result.map(({ pacientes, comunidades }) => ({
            ...pacientes,
            comunidad: comunidades
        }));

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching pacientes:', error);
        return { success: false, error: 'Error al obtener los pacientes' };
    }
}

/**
 * Crear un nuevo paciente
 */
export async function createPaciente(data: NewPaciente) {
    try {
        await db.insert(pacientes).values(data);
        revalidatePath('/datos-basicos/pacientes');
        return { success: true, message: 'Paciente creado correctamente' };
    } catch (error) {
        console.error('Error creating paciente:', error);
        return { success: false, error: 'Error al crear el paciente' };
    }
}

/**
 * Actualizar un paciente
 */
export async function updatePaciente(cedula: string, data: Partial<NewPaciente>) {
    try {
        await db.update(pacientes)
            .set(data)
            .where(eq(pacientes.cedulaPaciente, cedula));
        revalidatePath('/datos-basicos/pacientes');
        return { success: true, message: 'Paciente actualizado correctamente' };
    } catch (error) {
        console.error('Error updating paciente:', error);
        return { success: false, error: 'Error al actualizar el paciente' };
    }
}

/**
 * Eliminar un paciente
 */
export async function deletePaciente(cedula: string) {
    try {
        await db.delete(pacientes)
            .where(eq(pacientes.cedulaPaciente, cedula));
        revalidatePath('/datos-basicos/pacientes');
        return { success: true, message: 'Paciente eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting paciente:', error);
        return { success: false, error: 'Error al eliminar el paciente' };
    }
}
