import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ConsultaForm } from '@/components/abordajes/ConsultaForm';
import { getAbordajeById } from '@/actions/abordajes-actions';
import { getPacientes } from '@/actions/pacientes-actions';
import { getEnfermedades } from '@/actions/enfermedades-actions';
import { EmptyState } from '@/components/shared/UIComponents';

export default async function NuevaConsultaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Parallel data fetching
    const [abordajeReq, pacientesReq, enfermedadesReq] = await Promise.all([
        getAbordajeById(id),
        getPacientes(),
        getEnfermedades()
    ]);

    if (!abordajeReq.success || !abordajeReq.data) {
        return (
            <MainLayout>
                <EmptyState
                    icon="error"
                    title="Abordaje no encontrado"
                    description="No se puede registrar una consulta para un abordaje inexistente."
                    action={{
                        label: 'Volver',
                        href: '/abordajes'
                    }}
                />
            </MainLayout>
        );
    }

    // Filter Tejedores who are Medics/Doctors
    // We assume 'tejedores' in abordaje data contains all participants.
    // Ideally we filter by 'profesionTejedor'.
    const abordajeData = abordajeReq.data;
    const medicos = abordajeData.tejedores.filter((t: any) =>
        t.profesionTejedor?.toLowerCase().includes('medico') ||
        t.profesionTejedor?.toLowerCase().includes('doctor') ||
        t.rolAbordaje?.toLowerCase().includes('medico')
    );
    // Fallback: if no explicit medics found, show all tejedores (debug/loose mode)
    const medicalStaff = medicos.length > 0 ? medicos : abordajeData.tejedores;

    return (
        <MainLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Registro de Consulta
                </h1>
                <p className="text-gray-600">
                    Abordaje: {abordajeData.descripcion} ({abordajeData.codigoAbordaje})
                </p>
            </div>

            <ConsultaForm
                abordajeId={id}
                pacientes={pacientesReq.data || []}
                medicos={medicalStaff || []}
                enfermedades={enfermedadesReq.data || []}
            />
        </MainLayout>
    );
}

