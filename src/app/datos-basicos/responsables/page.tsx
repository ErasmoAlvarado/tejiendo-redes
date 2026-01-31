'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { mockResponsables } from '@/lib/mock-data';
import type { Responsable } from '@/types/models';
import { toast } from 'sonner';

export default function ResponsablesPage() {
    const [responsables] = React.useState(mockResponsables);

    const columns: Column<Responsable>[] = [
        { key: 'cedula_responsable', label: 'Cédula', sortable: true },
        {
            key: 'nombre_completo',
            label: 'Nombre Completo',
            render: (r) => `${r.nombre_responsable} ${r.apellido_responsable}`,
            sortable: true,
        },
        { key: 'telefono_responsable', label: 'Teléfono' },
        { key: 'correo_responsable', label: 'Correo' },
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
                    <h1 className="text-3xl text-gray-900 mb-2">Responsables</h1>
                    <p className="text-gray-600">Gestión de responsables de comunidades</p>
                </div>
                <DataTable
                    data={responsables}
                    columns={columns}
                    searchPlaceholder="Buscar responsable..."
                    onAdd={() => toast.info('Abrir modal de agregar')}
                    addLabel="Agregar Responsable"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />
            </div>
        </MainLayout>
    );
}
