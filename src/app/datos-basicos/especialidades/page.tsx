import { getEspecialidades } from '@/actions/especialidades-actions';
import EspecialidadesClient from './especialidades-client';

export default async function EspecialidadesPage() {
    const { data: especialidades, success } = await getEspecialidades();

    if (!success || !especialidades) {
        return <div>Error al cargar las especialidades</div>;
    }

    return <EspecialidadesClient initialData={especialidades} />;
}
