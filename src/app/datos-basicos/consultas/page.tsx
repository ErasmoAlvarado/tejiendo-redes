import { getConsultas } from '@/actions/consultas-actions';
import { getPacientes } from '@/actions/pacientes-actions';
import { getMedicos } from '@/actions/medicos-actions';
import { getAbordajes } from '@/actions/abordajes-actions';
import { getEnfermedades } from '@/actions/enfermedades-actions';
import ConsultasClient from './consultas-client';

export default async function ConsultasPage() {
    // Parallel data fetching for efficiency
    const [
        consultasRes,
        pacientesRes,
        medicosRes,
        abordajesRes,
        enfermedadesRes
    ] = await Promise.all([
        getConsultas(),
        getPacientes(),
        getMedicos(),
        getAbordajes(),
        getEnfermedades()
    ]);

    if (!consultasRes.success) return <div>Error loading Consultas</div>;

    return (
        <ConsultasClient
            consultas={consultasRes.data || []}
            pacientes={pacientesRes.data || []}
            medicos={medicosRes.data || []}
            abordajes={abordajesRes.data || []}
            enfermedades={enfermedadesRes.data || []}
        />
    );
}
