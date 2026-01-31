'use client';

import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Download, FileText } from 'lucide-react';
import { DataTable, type Column } from '@/components/shared/DataTable';
import {
    mockAbordajes,
    mockComunidades,
    mockPacientes,
    mockConsultas,
    mockMedicamentos,
    mockMedicamentosPacientes,
    getAbordajeConRelaciones,
} from '@/lib/mock-data';
import { calcularEdad } from '@/types/models';
import { toast } from 'sonner';

export default function ReportesPage() {
    const [fechaInicio, setFechaInicio] = React.useState('2025-01-01');
    const [fechaFin, setFechaFin] = React.useState('2025-01-31');
    const [comunidadFiltro, setComunidadFiltro] = React.useState('todas');

    // Reporte de Abordajes
    const reporteAbordajes = mockAbordajes.map((abordaje) => {
        const data = getAbordajeConRelaciones(abordaje.codigo_abordaje);
        return {
            ...abordaje,
            comunidades_count: data?.comunidades?.length || 0,
            consultas_count: data?.total_consultas || 0,
            pacientes_unicos: data?.pacientes_unicos || 0,
        };
    });

    // Reporte de Comunidades
    const reporteComunidades = mockComunidades.map((comunidad) => {
        const pacientesEnComunidad = mockPacientes.filter(
            (p) => p.codigo_comunidad === comunidad.codigo_comunidad
        );
        const abordajesEnComunidad = mockAbordajes.filter((a) => {
            const data = getAbordajeConRelaciones(a.codigo_abordaje);
            return data?.comunidades?.some((c: any) => c.codigo_comunidad === comunidad.codigo_comunidad);
        });
        const consultasEnComunidad = mockConsultas.filter((c) =>
            pacientesEnComunidad.some((p) => p.cedula_paciente === c.cedula_paciente)
        );

        return {
            ...comunidad,
            pacientes_registrados: pacientesEnComunidad.length,
            abordajes_realizados: abordajesEnComunidad.length,
            total_consultas: consultasEnComunidad.length,
        };
    });

    // Reporte de Pacientes
    const reportePacientes = mockPacientes.map((paciente) => {
        const consultasPaciente = mockConsultas.filter(
            (c) => c.cedula_paciente === paciente.cedula_paciente
        );
        const ultimaConsulta =
            consultasPaciente.length > 0
                ? consultasPaciente.sort(
                    (a, b) =>
                        new Date(b.fecha_consulta).getTime() - new Date(a.fecha_consulta).getTime()
                )[0]
                : null;

        return {
            ...paciente,
            edad: calcularEdad(paciente.fecha_nacimiento),
            total_consultas: consultasPaciente.length,
            ultima_consulta: ultimaConsulta?.fecha_consulta,
        };
    });

    // Reporte de Morbilidad
    const reporteMorbilidad: Record<string, number> = {};
    mockConsultas.forEach((consulta) => {
        const tipo = consulta.tipo_morbilidad || 'Sin clasificar';
        reporteMorbilidad[tipo] = (reporteMorbilidad[tipo] || 0) + 1;
    });

    const dataMorbilidad = Object.entries(reporteMorbilidad).map(([tipo, cantidad]) => ({
        tipo_morbilidad: tipo,
        cantidad,
        porcentaje: ((cantidad / mockConsultas.length) * 100).toFixed(1),
    }));

    // Reporte de Medicamentos
    const reporteMedicamentos = mockMedicamentos.map((medicamento) => {
        const entregas = mockMedicamentosPacientes.filter(
            (m) => m.codigo_medicamento === medicamento.codigo_medicamento
        );
        const totalEntregado = entregas.reduce((sum, e) => sum + e.cantidad_entregada, 0);

        return {
            ...medicamento,
            entregas_realizadas: entregas.length,
            total_entregado: totalEntregado,
        };
    });

    const handleExport = (format: 'csv' | 'pdf', tabName: string) => {
        toast.success(`Exportando ${tabName} en formato ${format.toUpperCase()}...`);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl text-gray-900 mb-2">Reportes</h1>
                    <p className="text-gray-600">Generación de reportes con filtros personalizados</p>
                </div>

                {/* Filtros Globales */}
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
                                        {mockComunidades.map((c) => (
                                            <SelectItem key={c.codigo_comunidad} value={c.codigo_comunidad}>
                                                {c.nombre_comunidad}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs de Reportes */}
                <Tabs defaultValue="abordajes" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="abordajes">Abordajes</TabsTrigger>
                        <TabsTrigger value="comunidades">Comunidades</TabsTrigger>
                        <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
                        <TabsTrigger value="morbilidad">Morbilidad</TabsTrigger>
                        <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
                    </TabsList>

                    {/* Reporte Abordajes */}
                    <TabsContent value="abordajes">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Reporte de Abordajes</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('csv', 'Abordajes')}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        CSV
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('pdf', 'Abordajes')}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        PDF
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={reporteAbordajes}
                                    columns={[
                                        { key: 'codigo_abordaje', label: 'Código', sortable: true },
                                        { key: 'fecha_abordaje', label: 'Fecha', sortable: true },
                                        { key: 'descripcion_abordaje', label: 'Descripción' },
                                        { key: 'comunidades_count', label: 'Comunidades', sortable: true },
                                        { key: 'consultas_count', label: 'Consultas', sortable: true },
                                        { key: 'pacientes_unicos', label: 'Pacientes', sortable: true },
                                        { key: 'estado', label: 'Estado' },
                                    ]}
                                    searchPlaceholder="Buscar abordaje..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reporte Comunidades */}
                    <TabsContent value="comunidades">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Reporte de Comunidades</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('csv', 'Comunidades')}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        CSV
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('pdf', 'Comunidades')}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        PDF
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={reporteComunidades}
                                    columns={[
                                        { key: 'codigo_comunidad', label: 'Código', sortable: true },
                                        { key: 'nombre_comunidad', label: 'Nombre', sortable: true },
                                        { key: 'habitantes', label: 'Habitantes', sortable: true },
                                        {
                                            key: 'pacientes_registrados',
                                            label: 'Pacientes',
                                            sortable: true,
                                        },
                                        {
                                            key: 'abordajes_realizados',
                                            label: 'Abordajes',
                                            sortable: true,
                                        },
                                        { key: 'total_consultas', label: 'Consultas', sortable: true },
                                    ]}
                                    searchPlaceholder="Buscar comunidad..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reporte Pacientes */}
                    <TabsContent value="pacientes">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Reporte de Pacientes</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('csv', 'Pacientes')}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        CSV
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('pdf', 'Pacientes')}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        PDF
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={reportePacientes}
                                    columns={[
                                        { key: 'cedula_paciente', label: 'Cédula', sortable: true },
                                        {
                                            key: 'nombre_paciente',
                                            label: 'Nombre',
                                            render: (p: any) => `${p.nombre_paciente} ${p.apellido_paciente}`,
                                            sortable: true,
                                        },
                                        { key: 'edad', label: 'Edad', sortable: true },
                                        { key: 'sexo', label: 'Sexo' },
                                        { key: 'total_consultas', label: 'Consultas', sortable: true },
                                        {
                                            key: 'ultima_consulta',
                                            label: 'Última Consulta',
                                            render: (p: any) =>
                                                p.ultima_consulta
                                                    ? new Date(p.ultima_consulta).toLocaleDateString('es-VE')
                                                    : '-',
                                        },
                                    ]}
                                    searchPlaceholder="Buscar paciente..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reporte Morbilidad */}
                    <TabsContent value="morbilidad">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Reporte de Morbilidad</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('csv', 'Morbilidad')}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        CSV
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('pdf', 'Morbilidad')}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        PDF
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={dataMorbilidad}
                                    columns={[
                                        { key: 'tipo_morbilidad', label: 'Tipo de Morbilidad', sortable: true },
                                        { key: 'cantidad', label: 'Casos', sortable: true },
                                        {
                                            key: 'porcentaje',
                                            label: 'Porcentaje',
                                            render: (d: any) => `${d.porcentaje}%`,
                                            sortable: true,
                                        },
                                    ]}
                                    searchPlaceholder="Buscar tipo de morbilidad..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reporte Medicamentos */}
                    <TabsContent value="medicamentos">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Reporte de Medicamentos</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('csv', 'Medicamentos')}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        CSV
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleExport('pdf', 'Medicamentos')}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        PDF
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={reporteMedicamentos}
                                    columns={[
                                        { key: 'codigo_medicamento', label: 'Código', sortable: true },
                                        { key: 'nombre_medicamento', label: 'Nombre', sortable: true },
                                        { key: 'existencia', label: 'Stock Actual', sortable: true },
                                        {
                                            key: 'total_entregado',
                                            label: 'Total Entregado',
                                            sortable: true,
                                        },
                                        {
                                            key: 'entregas_realizadas',
                                            label: 'Entregas',
                                            sortable: true,
                                        },
                                    ]}
                                    searchPlaceholder="Buscar medicamento..."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
