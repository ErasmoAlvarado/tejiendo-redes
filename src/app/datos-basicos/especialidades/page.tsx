'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { mockEspecialidades } from '@/lib/mock-data';
import type { Especialidad } from '@/types/models';
import { toast } from 'sonner';

export default function EspecialidadesPage() {
    const [especialidades] = React.useState(mockEspecialidades);

    const columns: Column<Especialidad>[] = [
        { key: 'codigo_especialidad', label: 'Código', sortable: true },
        { key: 'nombre_especialidad', label: 'Nombre', sortable: true },
        { key: 'descripcion_especialidad', label: 'Descripción' },
        {
            key: 'acciones',
            label: 'Acciones',
            render: () => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Especialidades</h1>
                    <p className="text-gray-600">Gestión de especialidades médicas</p>
                </div>
                <DataTable
                    data={especialidades}
                    columns={columns}
                    searchPlaceholder="Buscar especialidad..."
                    onAdd={() => toast.info('Abrir modal de agregar')}
                    addLabel="Agregar Especialidad"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />
            </div>
        </MainLayout>
    );
}
