'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { DataTable, type Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Plus } from 'lucide-react';
import { useAbordajes } from '@/hooks/useAbordajes';
import type { Abordaje } from '@/types/models';
import { toast } from 'sonner';

export default function AbordajesPage() {
    const router = useRouter();
    const { abordajes, stats, getAbordajeConDetalles } = useAbordajes();

    const getEstadoBadge = (estado: string) => {
        const variants: Record<string, any> = {
            Planificado: 'outline',
            'En Curso': 'secondary',
            Finalizado: 'default',
        };
        return <Badge variant={variants[estado] || 'default'}>{estado}</Badge>;
    };

    const columns = useMemo<Column<Abordaje>[]>(() => [
        {
            key: 'codigo_abordaje',
            label: 'Código',
            sortable: true,
        },
        {
            key: 'descripcion_abordaje',
            label: 'Descripción',
            sortable: true,
        },
        {
            key: 'fecha_abordaje',
            label: 'Fecha',
            render: (abordaje) => new Date(abordaje.fecha_abordaje).toLocaleDateString('es-VE'),
            sortable: true,
        },
        {
            key: 'horario',
            label: 'Horario',
            render: (abordaje) =>
                `${abordaje.hora_inicio}${abordaje.hora_fin ? ` - ${abordaje.hora_fin}` : ''}`,
        },
        {
            key: 'comunidades',
            label: 'Comunidades',
            render: (abordaje) => {
                const data = getAbordajeConDetalles(abordaje.codigo_abordaje);
                return <Badge variant="secondary">{data?.comunidades?.length || 0}</Badge>;
            },
        },
        {
            key: 'consultas',
            label: 'Consultas',
            render: (abordaje) => {
                const data = getAbordajeConDetalles(abordaje.codigo_abordaje);
                return <Badge variant="secondary">{data?.total_consultas || 0}</Badge>;
            },
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (abordaje) => getEstadoBadge(abordaje.estado || 'Planificado'),
        },
        {
            key: 'acciones',
            label: 'Acciones',
            render: (abordaje) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/abordajes/${abordaje.codigo_abordaje}`)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/abordajes/${abordaje.codigo_abordaje}/editar`)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ], [router, getAbordajeConDetalles]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Abordajes</h1>
                        <p className="text-gray-600">
                            Gestión de jornadas de atención comunitaria
                        </p>
                    </div>
                    <Button onClick={() => router.push('/abordajes/nuevo')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Abordaje
                    </Button>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Total Abordajes" value={stats.total} color="blue" />
                    <StatCard title="Finalizados" value={stats.finalizados} color="green" />
                    <StatCard title="En Curso" value={stats.enCurso} color="yellow" />
                </div>

                <DataTable
                    data={abordajes}
                    columns={columns}
                    searchPlaceholder="Buscar por código o descripción..."
                    onExport={(format) => toast.info(`Exportando ${format.toUpperCase()}...`)}
                />
            </div>
        </MainLayout>
    );
}

function StatCard({ title, value, color }: { title: string; value: number; color: 'blue' | 'green' | 'yellow' }) {
    const colors = {
        blue: 'bg-blue-50 border-blue-200 text-blue-600 title-blue-900',
        green: 'bg-green-50 border-green-200 text-green-600 title-green-900',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600 title-yellow-900',
    };

    const c = colors[color].split(' ');

    return (
        <div className={`${c[0]} border ${c[1]} rounded-lg p-4`}>
            <p className={`text-sm ${c[2]} mb-1`}>{title}</p>
            <p className={`text-3xl font-semibold ${c[3].replace('title-', 'text-')}`}>{value}</p>
        </div>
    );
}
