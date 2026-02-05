'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    LineChart,
    Line,
} from 'recharts';
import { DataTable, type Column } from '@/components/shared/DataTable';

export default function EstadisticasPage() {

    const [fechaInicio, setFechaInicio] = React.useState('2025-01-01');
    const [fechaFin, setFechaFin] = React.useState('2025-01-31');
    const [comunidadFiltro, setComunidadFiltro] = React.useState('todas');
    const [drilldownData, setDrilldownData] = React.useState<any[]>([]);
    const [drilldownTitle, setDrilldownTitle] = React.useState('');

    // Abordajes por mes (Placeholders)
    const abordajesPorMes: any[] = [];

    // Pacientes por comunidad (Placeholders)
    const pacientesPorComunidad: any[] = [];

    // Consultas por sexo (Placeholders)
    const consultasPorSexo: any[] = [];

    // Pacientes por grupo etario (Placeholders)
    const pacientesPorGrupoEtario: any[] = [];

    // Top morbilidades (Placeholders)
    const topMorbilidades: any[] = [];

    // Medicamentos más entregados (Placeholders)
    const topMedicamentos: any[] = [];

    const handleBarClick = (data: any, type: string) => {
        // Deshabilitado temporalmente
    };


    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Estadísticas</h1>
                    <p className="text-gray-600">
                        Análisis y visualización de datos del sistema
                    </p>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                                <Input
                                    id="fechaInicio"
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fechaFin">Fecha Fin</Label>
                                <Input
                                    id="fechaFin"
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="comunidad">Comunidad</Label>
                                <Select value={comunidadFiltro} onValueChange={setComunidadFiltro}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas</SelectItem>
                                        {/* Comunidades desactivadas corporalmente */}
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Gráficas principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Abordajes por mes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Abordajes por Mes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={abordajesPorMes}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="cantidad"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pacientes por comunidad */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pacientes por Comunidad</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pacientesPorComunidad}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="value"
                                        fill="#10b981"
                                        radius={[8, 8, 0, 0]}
                                        onClick={(data) => handleBarClick(data, 'comunidad')}
                                        cursor="pointer"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Consultas por sexo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Consultas por Sexo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={consultasPorSexo}
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
                                        {consultasPorSexo.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pacientes por grupo etario */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pacientes por Grupo Etario</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={pacientesPorGrupoEtario}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top morbilidades */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Morbilidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topMorbilidades} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="tipo" type="category" width={120} />
                                    <Tooltip />
                                    <Bar
                                        dataKey="cantidad"
                                        fill="#f59e0b"
                                        radius={[0, 8, 8, 0]}
                                        onClick={(data) => handleBarClick(data, 'morbilidad')}
                                        cursor="pointer"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Medicamentos más entregados */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medicamentos Más Entregados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topMedicamentos} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="medicamento" type="category" width={120} />
                                    <Tooltip />
                                    <Bar dataKey="cantidad" fill="#ec4899" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de drill-down */}
                {drilldownData.length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{drilldownTitle}</CardTitle>
                            <button
                                onClick={() => setDrilldownData([])}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Cerrar
                            </button>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={drilldownData}
                                columns={
                                    drilldownData[0]?.cedula_paciente
                                        ? [
                                            { key: 'cedula_paciente', label: 'Cédula' },
                                            {
                                                key: 'nombre_paciente',
                                                label: 'Nombre',
                                                render: (p: any) =>
                                                    `${p.nombre_paciente} ${p.apellido_paciente}`,
                                            },
                                            { key: 'telefono_paciente', label: 'Teléfono' },
                                        ]
                                        : [
                                            { key: 'codigo_consulta', label: 'Código' },
                                            { key: 'fecha_consulta', label: 'Fecha' },
                                            { key: 'motivo_consulta', label: 'Motivo' },
                                            { key: 'diagnostico', label: 'Diagnóstico' },
                                        ]
                                }
                                searchPlaceholder="Buscar..."
                            />
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
