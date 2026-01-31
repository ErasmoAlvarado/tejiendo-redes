'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/shared/UIComponents';
import { Activity, Users, FileText, Pill, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import {
    mockAbordajes,
    mockPacientes,
    mockConsultas,
    mockMedicamentosPacientes,
    mockMedicamentos,
} from '@/lib/mock-data';

export default function DashboardPage() {
    const router = useRouter();

    // Calcular KPIs
    const abordajesEsteMes = mockAbordajes.filter(a => {
        const fecha = new Date(a.fecha_abordaje);
        const hoy = new Date();
        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }).length;

    const totalPacientes = mockPacientes.length;

    const consultasEsteMes = mockConsultas.filter(c => {
        const fecha = new Date(c.fecha_consulta);
        const hoy = new Date();
        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }).length;

    const medicamentosEntregadosEsteMes = mockMedicamentosPacientes.filter(m => {
        const fecha = new Date(m.fecha_entrega);
        const hoy = new Date();
        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
    }).length;

    // Medicamentos con stock bajo (< 20 unidades)
    const medicamentosStockBajo = mockMedicamentos.filter(m => m.existencia < 20);

    // Datos para gráficas
    const abordajesPorMes = [
        { mes: 'Sep', cantidad: 5 },
        { mes: 'Oct', cantidad: 8 },
        { mes: 'Nov', cantidad: 6 },
        { mes: 'Dic', cantidad: 9 },
        { mes: 'Ene', cantidad: abordajesEsteMes },
    ];

    const consultasPorTipo = [
        { name: 'Respiratoria', value: 12, color: '#3b82f6' },
        { name: 'Gastrointestinal', value: 8, color: '#10b981' },
        { name: 'Cardiovascular', value: 5, color: '#f59e0b' },
        { name: 'Otros', value: 10, color: '#6366f1' },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl text-gray-900">Dashboard</h1>
                    <Button onClick={() => router.push('/abordajes/nuevo')}>
                        Nuevo Abordaje
                    </Button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        label="Abordajes este mes"
                        value={abordajesEsteMes}
                        icon={<Activity className="w-6 h-6" />}
                        change={{ value: 15, trend: 'up' }}
                    />
                    <StatsCard
                        label="Pacientes registrados"
                        value={totalPacientes}
                        icon={<Users className="w-6 h-6" />}
                    />
                    <StatsCard
                        label="Consultas este mes"
                        value={consultasEsteMes}
                        icon={<FileText className="w-6 h-6" />}
                        change={{ value: 8, trend: 'up' }}
                    />
                    <StatsCard
                        label="Entregas de medicamentos"
                        value={medicamentosEntregadosEsteMes}
                        icon={<Pill className="w-6 h-6" />}
                    />
                </div>

                {/* Alertas de stock */}
                {medicamentosStockBajo.length > 0 && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-800">
                                <AlertCircle className="w-5 h-5" />
                                Alertas de Stock Bajo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {medicamentosStockBajo.map(med => (
                                    <div
                                        key={med.codigo_medicamento}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg"
                                    >
                                        <div>
                                            <p className="text-sm">{med.nombre_medicamento}</p>
                                            <p className="text-xs text-gray-600">
                                                Código: {med.codigo_medicamento}
                                            </p>
                                        </div>
                                        <Badge variant="destructive">
                                            {med.existencia} {med.unidad_medida}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={() => router.push('/datos-basicos/medicamentos')}
                            >
                                Gestionar Inventario
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Abordajes por mes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Abordajes por Mes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={abordajesPorMes}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="cantidad" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Consultas por tipo de morbilidad */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Consultas por Tipo de Morbilidad</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={consultasPorTipo}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent = 0 }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {consultasPorTipo.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Últimos abordajes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Últimos Abordajes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockAbordajes.slice(0, 5).map(abordaje => (
                                <div
                                    key={abordaje.codigo_abordaje}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/abordajes/${abordaje.codigo_abordaje}`)}
                                >
                                    <div>
                                        <p className="text-sm">{abordaje.descripcion_abordaje}</p>
                                        <p className="text-xs text-gray-600">
                                            {new Date(abordaje.fecha_abordaje).toLocaleDateString('es-VE')} •{' '}
                                            {abordaje.hora_inicio}
                                            {abordaje.hora_fin && ` - ${abordaje.hora_fin}`}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            abordaje.estado === 'Finalizado'
                                                ? 'default'
                                                : abordaje.estado === 'En Curso'
                                                    ? 'secondary'
                                                    : 'outline'
                                        }
                                    >
                                        {abordaje.estado}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
