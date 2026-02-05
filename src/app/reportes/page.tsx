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
import { DataTable } from '@/components/shared/DataTable';
import { toast } from 'sonner';

export default function ReportesPage() {
    const [fechaInicio, setFechaInicio] = React.useState('2025-01-01');
    const [fechaFin, setFechaFin] = React.useState('2025-01-31');
    const [comunidadFiltro, setComunidadFiltro] = React.useState('todas');

    // Datos vacíos - Preparados para conexión con base de datos
    const comunidades: Array<{ codigo_comunidad: string; nombre_comunidad: string }> = [];

    // Reporte de Abordajes - Preparado para conexión con base de datos
    const reporteAbordajes: Array<{
        codigo_abordaje: string;
        fecha_abordaje: string;
        descripcion: string;
        comunidades: number;
        pacientes_atendidos: number;
        hora_inicio: string;
        hora_fin: string;
    }> = [];

    // Reporte de Comunidades
    const reporteComunidades: Array<{
        codigo_comunidad: string;
        nombre_comunidad: string;
        estado: string;
        municipio: string;
        cantidad_habitantes: number;
        pacientes_tratados: number;
        abordajes_realizados: number;
        total_consultas: number;
    }> = [];

    // Reporte de Pacientes - Expandido con información completa
    const reportePacientes: Array<{
        cedula_paciente: string;
        codigo_comunidad: string;
        nombre_comunidad: string;
        nombre_paciente: string;
        apellido_paciente: string;
        fecha_nacimiento: string;
        direccion_paciente: string;
        telefono_paciente: string;
        correo_paciente: string;
    }> = [];

    // Reporte de Morbilidad - Mejorado con datos epidemiológicos completos
    const dataMorbilidad: Array<{
        codigo_enfermedad: string;
        nombre_enfermedad: string;
        tipo_patologia: string;
        total_casos: number;
        pacientes_afectados: number;
        porcentaje: string;
        ultima_consulta: string;
    }> = [];

    // Reporte de Medicamentos - Simplificado
    const reporteMedicamentos: Array<{
        codigo_medicamento: string;
        nombre_medicamento: string;
        presentacion: string;
        existencia: number;
        descripcion: string;
    }> = [];

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
                                        {comunidades.map((c) => (
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
                                        { key: 'descripcion', label: 'Descripción' },
                                        { key: 'comunidades', label: 'Comunidades', sortable: true },
                                        { key: 'pacientes_atendidos', label: 'Pacientes Atendidos', sortable: true },
                                        { key: 'hora_inicio', label: 'Hora Inicio', sortable: true },
                                        { key: 'hora_fin', label: 'Hora Fin', sortable: true },
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
                                        { key: 'nombre_comunidad', label: 'Nombre Comunidad', sortable: true },
                                        { key: 'estado', label: 'Estado', sortable: true },
                                        { key: 'municipio', label: 'Municipio', sortable: true },
                                        { key: 'cantidad_habitantes', label: 'Habitantes', sortable: true },
                                        {
                                            key: 'pacientes_tratados',
                                            label: 'Pacientes Tratados',
                                            sortable: true,
                                        },
                                        {
                                            key: 'abordajes_realizados',
                                            label: 'Abordajes Realizados',
                                            sortable: true,
                                        },
                                        { key: 'total_consultas', label: 'Consultas Realizadas', sortable: true },
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
                                        { key: 'nombre_comunidad', label: 'Comunidad', sortable: true },
                                        { key: 'nombre_paciente', label: 'Nombre', sortable: true },
                                        { key: 'apellido_paciente', label: 'Apellido', sortable: true },
                                        {
                                            key: 'fecha_nacimiento',
                                            label: 'Fecha de Nacimiento',
                                            render: (p: any) =>
                                                p.fecha_nacimiento
                                                    ? new Date(p.fecha_nacimiento).toLocaleDateString('es-VE')
                                                    : '-',
                                            sortable: true,
                                        },
                                        { key: 'direccion_paciente', label: 'Dirección' },
                                        { key: 'telefono_paciente', label: 'Teléfono' },
                                        { key: 'correo_paciente', label: 'Correo' },
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
                                        { key: 'codigo_enfermedad', label: 'Código Enfermedad', sortable: true },
                                        { key: 'nombre_enfermedad', label: 'Nombre Enfermedad', sortable: true },
                                        { key: 'tipo_patologia', label: 'Tipo Patología', sortable: true },
                                        { key: 'total_casos', label: 'Total Casos', sortable: true },
                                        { key: 'pacientes_afectados', label: 'Pacientes Afectados', sortable: true },
                                        {
                                            key: 'porcentaje',
                                            label: 'Porcentaje del Total',
                                            render: (d: any) => `${d.porcentaje}%`,
                                            sortable: true,
                                        },
                                        {
                                            key: 'ultima_consulta',
                                            label: 'Última Consulta',
                                            render: (d: any) =>
                                                d.ultima_consulta
                                                    ? new Date(d.ultima_consulta).toLocaleDateString('es-VE')
                                                    : '-',
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
                                        { key: 'nombre_medicamento', label: 'Nombre Medicamento', sortable: true },
                                        { key: 'presentacion', label: 'Presentación', sortable: true },
                                        { key: 'existencia', label: 'Existencia', sortable: true },
                                        { key: 'descripcion', label: 'Descripción' },
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
