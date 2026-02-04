import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';

/**
 * GET /api/tejedores
 * Obtiene todos los tejedores o uno específico por cédula
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cedula = searchParams.get('cedula');

        if (cedula) {
            // Obtener un tejedor específico
            const tejedor = await db.select()
                .from(schema.tejedores)
                .where(eq(schema.tejedores.cedulaTejedor, cedula))
                .limit(1);

            if (tejedor.length === 0) {
                return NextResponse.json(
                    { error: 'Tejedor no encontrado' },
                    { status: 404 }
                );
            }

            return NextResponse.json(tejedor[0]);
        }

        // Obtener todos los tejedores
        const tejedores = await db.select().from(schema.tejedores);

        return NextResponse.json(tejedores);
    } catch (error) {
        console.error('Error fetching tejedores:', error);
        return NextResponse.json(
            { error: 'Error al obtener tejedores' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/tejedores
 * Crea un nuevo tejedor
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validación básica
        const required = [
            'cedulaTejedor',
            'nombreTejedor',
            'apellidoTejedor',
            'fechaNacimiento',
            'direccionTejedor',
            'telefonoTejedor',
            'correoTejedor',
            'profesionTejedor',
            'fechaIngreso',
            'tipoVoluntario'
        ];

        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Campo requerido: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Convertir strings de fecha a objetos Date
        const newTejedor = {
            ...body,
            fechaNacimiento: new Date(body.fechaNacimiento),
            fechaIngreso: new Date(body.fechaIngreso)
        };

        // Insertar en la base de datos
        await db.insert(schema.tejedores).values(newTejedor);

        return NextResponse.json(
            { message: 'Tejedor creado exitosamente', data: newTejedor },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating tejedor:', error);
        return NextResponse.json(
            { error: 'Error al crear tejedor' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/tejedores?cedula={cedula}
 * Actualiza un tejedor existente
 */
export async function PUT(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cedula = searchParams.get('cedula');

        if (!cedula) {
            return NextResponse.json(
                { error: 'Cédula requerida en query params' },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Convertir fechas si están presentes
        if (body.fechaNacimiento) {
            body.fechaNacimiento = new Date(body.fechaNacimiento);
        }
        if (body.fechaIngreso) {
            body.fechaIngreso = new Date(body.fechaIngreso);
        }

        // Actualizar en la base de datos
        await db.update(schema.tejedores)
            .set(body)
            .where(eq(schema.tejedores.cedulaTejedor, cedula));

        return NextResponse.json({
            message: 'Tejedor actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error updating tejedor:', error);
        return NextResponse.json(
            { error: 'Error al actualizar tejedor' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/tejedores?cedula={cedula}
 * Elimina un tejedor
 */
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const cedula = searchParams.get('cedula');

        if (!cedula) {
            return NextResponse.json(
                { error: 'Cédula requerida en query params' },
                { status: 400 }
            );
        }

        await db.delete(schema.tejedores)
            .where(eq(schema.tejedores.cedulaTejedor, cedula));

        return NextResponse.json({
            message: 'Tejedor eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error deleting tejedor:', error);
        return NextResponse.json(
            { error: 'Error al eliminar tejedor. Puede haber registros relacionados.' },
            { status: 500 }
        );
    }
}
