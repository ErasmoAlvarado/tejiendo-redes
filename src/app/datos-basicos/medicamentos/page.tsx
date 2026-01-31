'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { mockMedicamentos } from '@/lib/mock-data';
import type { Medicamento } from '@/types/models';
import { toast } from 'sonner';

export default function MedicamentosPage() {
    const [medicamentos] = React.useState(mockMedicamentos);

    const handleDelete = (codigo: string) => {
        if (confirm('¿Está seguro de eliminar este medicamento?')) {
            toast.success('Medicamento eliminado correctamente');
        }
    };

    const getStockBadge = (existencia: number) => {
        if (existencia === 0) {
            return <Badge variant="destructive">Sin Stock</Badge>;
        } else if (existencia < 20) {
            return <Badge variant="destructive">Stock Bajo</Badge>;
        } else if (existencia < 50) {
            return <Badge className="bg-yellow-500">Stock Medio</Badge>;
        } else {
            return <Badge variant="default">Stock Bueno</Badge>;
        }
    };

    const columns: Column<Medicamento>[] = [
        {
            key: 'codigo_medicamento',
            label: 'Código',
            sortable: true,
        },
        {
            key: 'nombre_medicamento',
            label: 'Nombre',
            sortable: true,
        },
        {
            key: 'descripcion_medicamento',
            label: 'Descripción',
        },
        {
            key: 'existencia',
            label: 'Stock',
            render: (med) => (
                <div className="flex items-center gap-2">
                    <span className="text-base">
                        {med.existencia} {med.unidad_medida}
                    </span>
                    {med.existencia < 20 && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
            ),
            sortable: true,
        },
        {
            key: 'estado_stock',
            label: 'Estado',
            render: (med) => getStockBadge(med.existencia),
        },
        {
            key: 'lote',
            label: 'Lote',
        },
        {
            key: 'fecha_vencimiento',
            label: 'Vencimiento',
            render: (med) => {
                if (!med.fecha_vencimiento) return '-';
                const fecha = new Date(med.fecha_vencimiento);
                const hoy = new Date();
                const diasRestantes = Math.floor(
                    (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                    <div>
                        <p>{fecha.toLocaleDateString('es-VE')}</p>
                        {diasRestantes < 90 && (
                            <p className="text-xs text-red-600">{diasRestantes} días restantes</p>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (med) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(med.codigo_medicamento)}
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Medicamentos</h1>
                    <p className="text-gray-600">
                        Gestión de inventario de medicamentos
                    </p>
                </div>

                {/* Resumen de alertas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-sm text-red-600">Stock Bajo</p>
                                <p className="text-2xl text-red-900">
                                    {medicamentos.filter((m) => m.existencia < 20 && m.existencia > 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-sm text-red-600">Sin Stock</p>
                                <p className="text-2xl text-red-900">
                                    {medicamentos.filter((m) => m.existencia === 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-sm text-green-600">Stock Bueno</p>
                                <p className="text-2xl text-green-900">
                                    {medicamentos.filter((m) => m.existencia >= 50).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DataTable
                    data={medicamentos}
                    columns={columns}
                    searchPlaceholder="Buscar por código, nombre o lote..."
                    onAdd={() => toast.info('Abrir modal de agregar medicamento')}
                    addLabel="Agregar Medicamento"
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />
            </div>
        </MainLayout>
    );
}
