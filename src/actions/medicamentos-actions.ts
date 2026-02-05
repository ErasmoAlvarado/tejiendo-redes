'use server'

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { medicamentos, type NewMedicamento, type Medicamento } from '@/db/schema/medicamentos';
import { eq } from 'drizzle-orm';

/**
 * Obtener todos los medicamentos
 */
export async function getMedicamentos() {
    try {
        const data = await db.select().from(medicamentos);
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching medicamentos:', error);
        return { success: false, error: 'Error al obtener los medicamentos' };
    }
}

/**
 * Crear un nuevo medicamento
 */
export async function createMedicamento(data: NewMedicamento) {
    try {
        await db.insert(medicamentos).values(data);
        revalidatePath('/datos-basicos/medicamentos');
        return { success: true, message: 'Medicamento creado correctamente' };
    } catch (error) {
        console.error('Error creating medicamento:', error);
        return { success: false, error: 'Error al crear el medicamento' };
    }
}

/**
 * Actualizar un medicamento
 */
export async function updateMedicamento(codigo: string, data: Partial<NewMedicamento>) {
    try {
        await db.update(medicamentos)
            .set(data)
            .where(eq(medicamentos.codigoMedicamento, codigo));
        revalidatePath('/datos-basicos/medicamentos');
        return { success: true, message: 'Medicamento actualizado correctamente' };
    } catch (error) {
        console.error('Error updating medicamento:', error);
        return { success: false, error: 'Error al actualizar el medicamento' };
    }
}

/**
 * Eliminar un medicamento
 */
export async function deleteMedicamento(codigo: string) {
    try {
        await db.delete(medicamentos)
            .where(eq(medicamentos.codigoMedicamento, codigo));
        revalidatePath('/datos-basicos/medicamentos');
        return { success: true, message: 'Medicamento eliminado correctamente' };
    } catch (error) {
        console.error('Error deleting medicamento:', error);
        return { success: false, error: 'Error al eliminar el medicamento' };
    }
}
