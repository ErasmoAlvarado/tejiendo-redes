'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    FileText,
    Pill,
    Activity,
} from 'lucide-react';
import {
    getPacienteConRelaciones,
    mockComunidades,
    mockAntecedentes,
    mockConsultas,
    mockMedicamentosPacientes,
} from '@/services/mockData';
import { calcularEdad, getGrupoEtario } from '@/types/models';
import { EmptyState } from '@/components/shared/UIComponents';

export default function PacienteDetallePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const pacienteData = getPacienteConRelaciones(id!);

    if (!pacienteData) {
        return (
            <MainLayout>
                <EmptyState
                    icon="error"
                    title="Paciente no encontrado"
                    description="El paciente que buscas no existe o fue eliminado"
                    action={{
                        label: 'Volver a pacientes',
                        onClick: () => router.push('/datos-basicos/pacientes'),
                    }}
                />
            </MainLayout>
        );
    }

    const edad = calcularEdad(pacienteData.fecha_nacimiento);
    const grupoEtario = getGrupoEtario(edad);
    const comunidad = mockComunidades.find(
        (c) => c.codigo_comunidad === pacienteData.codigo_comunidad
    );
    const antecedente = mockAntecedentes.find(
        (a) => a.cedula_paciente === pacienteData.cedula_paciente
    );
    const consultas = mockConsultas.filter(
        (c) => c.cedula_paciente === pacienteData.cedula_paciente
    );
    const medicamentos = mockMedicamentosPacientes.filter(
        (m) => m.cedula_paciente === pacienteData.cedula_paciente
    );

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl text-gray-900">
                                {pacienteData.nombre_paciente} {pacienteData.apellido_paciente}
                            </h1>
                            <p className="text-gray-600">C.I. {pacienteData.cedula_paciente}</p>
                        </div>
                    </div>
                    <Button onClick={() => router.push(`/datos-basicos/pacientes/${id}/editar`)}>
                        Editar Paciente
                    </Button>
                </div>

                {/* Información General */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Edad</p>
                                    <p className="text-lg">{edad} años</p>
                                    <p className="text-xs text-gray-500">{grupoEtario}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Sexo</p>
                                    <p className="text-lg">
                                        {pacienteData.sexo === 'M'
                                            ? 'Masculino'
                                            : pacienteData.sexo === 'F'
                                                ? 'Femenino'
                                                : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Comunidad</p>
                                    <p className="text-lg">{comunidad?.nombre_comunidad || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Teléfono</p>
                                    <p className="text-lg">{pacienteData.telefono_paciente || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="datos" className="w-full">
                    <TabsList>
                        <TabsTrigger value="datos">Datos Personales</TabsTrigger>
                        <TabsTrigger value="antecedentes">Antecedentes</TabsTrigger>
                        <TabsTrigger value="consultas">Consultas ({consultas.length})</TabsTrigger>
                        <TabsTrigger value="medicamentos">
                            Medicamentos ({medicamentos.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="datos" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Personal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nombre Completo</p>
                                        <p className="text-base">
                                            {pacienteData.nombre_paciente} {pacienteData.apellido_paciente}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Cédula</p>
                                        <p className="text-base">{pacienteData.cedula_paciente}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                                        <p className="text-base">
                                            {new Date(pacienteData.fecha_nacimiento).toLocaleDateString('es-VE')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Teléfono</p>
                                        <p className="text-base">{pacienteData.telefono_paciente || 'No registrado'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Dirección</p>
                                        <p className="text-base">
                                            {pacienteData.direccion_paciente || 'No registrada'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="antecedentes">
                        {antecedente ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Historial Médico</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {antecedente.enfermedades && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Enfermedades</p>
                                            <p className="text-base">{antecedente.enfermedades}</p>
                                        </div>
                                    )}
                                    {antecedente.alergias && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Alergias</p>
                                            <Badge variant="destructive">{antecedente.alergias}</Badge>
                                        </div>
                                    )}
                                    {antecedente.cirugias && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Cirugías</p>
                                            <p className="text-base">{antecedente.cirugias}</p>
                                        </div>
                                    )}
                                    {antecedente.medicamentos_habituales && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Medicamentos Habituales</p>
                                            <p className="text-base">{antecedente.medicamentos_habituales}</p>
                                        </div>
                                    )}
                                    {antecedente.observaciones && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">Observaciones</p>
                                            <p className="text-base">{antecedente.observaciones}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <EmptyState
                                icon="info"
                                title="Sin antecedentes registrados"
                                description="Este paciente no tiene antecedentes médicos registrados"
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="consultas">
                        {consultas.length > 0 ? (
                            <div className="space-y-4">
                                {consultas.map((consulta) => (
                                    <Card key={consulta.codigo_consulta}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">
                                                    {new Date(consulta.fecha_consulta).toLocaleDateString('es-VE')}
                                                </CardTitle>
                                                {consulta.tipo_morbilidad && (
                                                    <Badge>{consulta.tipo_morbilidad}</Badge>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600">Motivo de Consulta</p>
                                                <p className="text-base">{consulta.motivo_consulta}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Diagnóstico</p>
                                                <p className="text-base">{consulta.diagnostico}</p>
                                            </div>
                                            {consulta.tratamiento && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Tratamiento</p>
                                                    <p className="text-base">{consulta.tratamiento}</p>
                                                </div>
                                            )}
                                            {consulta.recomendaciones && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Recomendaciones</p>
                                                    <p className="text-base">{consulta.recomendaciones}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="info"
                                title="Sin consultas registradas"
                                description="Este paciente no tiene consultas médicas registradas"
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="medicamentos">
                        {medicamentos.length > 0 ? (
                            <div className="space-y-4">
                                {medicamentos.map((entrega, index) => (
                                    <Card key={index}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-600">Fecha de Entrega</p>
                                                    <p className="text-base">
                                                        {new Date(entrega.fecha_entrega).toLocaleDateString('es-VE')}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-2">Medicamento</p>
                                                    <p className="text-base">{entrega.codigo_medicamento}</p>
                                                    {entrega.indicaciones && (
                                                        <>
                                                            <p className="text-sm text-gray-600 mt-2">Indicaciones</p>
                                                            <p className="text-base">{entrega.indicaciones}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <Badge variant="secondary">
                                                    {entrega.cantidad_entregada} unidades
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="info"
                                title="Sin entregas de medicamentos"
                                description="Este paciente no tiene entregas de medicamentos registradas"
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
