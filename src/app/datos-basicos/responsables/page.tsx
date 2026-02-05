import { getResponsables } from '@/actions/responsables-actions';
import ResponsablesClient from './responsables-client';

export default async function ResponsablesPage() {
    const { data: responsables, success } = await getResponsables();

    if (!success || !responsables) {
        return <div>Error al cargar los responsables</div>;
    }

    return <ResponsablesClient initialData={responsables} />;
}
