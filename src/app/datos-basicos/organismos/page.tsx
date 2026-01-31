'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { mockOrganismos } from '@/lib/mock-data';
import type { Organismo } from '@/types/models';
import { toast } from 'sonner';

export default function OrganismosPage() {
    const [organismos] = React.useState(mockOrganismos);

    const columns: Column<Organismo>[] = [
        { key: 'codigo_organismo', label: 'Código', sortable: true },
        { key: 'nombre_organismo', label: 'Nombre', sortable: true },
        { key: 'tipo_organismo', label: 'Tipo' },
        { key: 'telefono_organismo', label: 'Teléfono' },
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
                    <h1 className="text-3xl text-gray-900 mb-2">Organismos</h1>
                    <p className="text-gray-600">Gestión de organismos participantes</p>
                </div>
                <DataTable
                    data={organismos}
                    columns={columns}
                    searchPlaceholder="Buscar organismo..."
                    onAdd={() => toast.info('Abrir modal de agregar')}
                    addLabel="Agregar Organismo"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />
            </div>
        </MainLayout>
    );
}
