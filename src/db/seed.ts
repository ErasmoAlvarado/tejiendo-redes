import { db, schema } from './index';

/**
 * Script de seed para poblar la base de datos con datos iniciales
 * Usage: tsx src/db/seed.ts
 */
async function seed() {
    console.log('🌱 Iniciando seed de la base de datos...');

    try {
        // 1. Seed Responsables
        console.log('📝 Insertando responsables...');
        await db.insert(schema.responsable).values([
            {
                cedulaResponsable: '12345678',
                nombreResponsable: 'María',
                apellidoResponsable: 'González',
                direccionResponsable: 'Calle Principal #123, Centro',
                telefonoResponsable: '04121234567',
                correoResponsable: 'maria.gonzalez@example.com',
                cargo: 'Presidente'
            },
            {
                cedulaResponsable: '23456789',
                nombreResponsable: 'José',
                apellidoResponsable: 'Rodríguez',
                direccionResponsable: 'Av. Bolívar #456',
                telefonoResponsable: '04242345678',
                correoResponsable: 'jose.rodriguez@example.com',
                cargo: 'Vocal'
            }
        ]);

        // 2. Seed Especialidades
        console.log('🏥 Insertando especialidades...');
        await db.insert(schema.especialidades).values([
            {
                codigoEspecialidad: 'ESP-001',
                nombreEspecialidad: 'Medicina General',
                descripcion: 'Atención médica primaria y general'
            },
            {
                codigoEspecialidad: 'ESP-002',
                nombreEspecialidad: 'Pediatría',
                descripcion: 'Atención médica especializada en niños'
            },
            {
                codigoEspecialidad: 'ESP-003',
                nombreEspecialidad: 'Cardiología',
                descripcion: 'Especialista en enfermedades del corazón'
            }
        ]);

        // 3. Seed Enfermedades
        console.log('🦠 Insertando enfermedades...');
        await db.insert(schema.enfermedades).values([
            {
                codigoEnfermedad: 'ENF-001',
                nombreEnfermedad: 'Hipertensión Arterial',
                tipoPatologia: 'Cardiaca',
                descripcion: 'Presión arterial elevada de forma crónica'
            },
            {
                codigoEnfermedad: 'ENF-002',
                nombreEnfermedad: 'Diabetes Mellitus Tipo 2',
                tipoPatologia: 'Metabólica',
                descripcion: 'Trastorno metabólico caracterizado por hiperglucemia'
            },
            {
                codigoEnfermedad: 'ENF-003',
                nombreEnfermedad: 'Gripe Común',
                tipoPatologia: 'Viral',
                descripcion: 'Infección viral del tracto respiratorio'
            },
            {
                codigoEnfermedad: 'ENF-004',
                nombreEnfermedad: 'Asma Bronquial',
                tipoPatologia: 'Respiratoria',
                descripcion: 'Enfermedad inflamatoria crónica de las vías respiratorias'
            }
        ]);

        // 4. Seed Tejedores
        console.log('👥 Insertando tejedores...');
        await db.insert(schema.tejedores).values([
            {
                cedulaTejedor: '11111111',
                nombreTejedor: 'Ana',
                apellidoTejedor: 'Martínez',
                fechaNacimiento: new Date('1985-05-15'),
                direccionTejedor: 'Urb. Los Pinos, Casa 45',
                telefonoTejedor: '04141234567',
                correoTejedor: 'ana.martinez@example.com',
                profesionTejedor: 'Médico Cirujano',
                fechaIngreso: new Date('2020-01-10'),
                tipoVoluntario: 'Médico'
            },
            {
                cedulaTejedor: '22222222',
                nombreTejedor: 'Carlos',
                apellidoTejedor: 'López',
                fechaNacimiento: new Date('1990-08-22'),
                direccionTejedor: 'Sector El Valle, Calle 3',
                telefonoTejedor: '04262345678',
                correoTejedor: 'carlos.lopez@example.com',
                profesionTejedor: 'Licenciado en Farmacia',
                fechaIngreso: new Date('2021-03-05'),
                tipoVoluntario: 'Farmacéutico'
            },
            {
                cedulaTejedor: '33333333',
                nombreTejedor: 'Laura',
                apellidoTejedor: 'Fernández',
                fechaNacimiento: new Date('1988-11-30'),
                direccionTejedor: 'Av. Universidad, Edif. Azul',
                telefonoTejedor: '04123456789',
                correoTejedor: 'laura.fernandez@example.com',
                profesionTejedor: 'Trabajadora Social',
                fechaIngreso: new Date('2019-07-15'),
                tipoVoluntario: 'Apoyo Social'
            }
        ]);

        // 5. Seed Médicos
        console.log('⚕️ Insertando médicos...');
        await db.insert(schema.medicos).values([
            {
                cedulaTejedor: '11111111',
                codigoEspecialidad: 'ESP-001',
                matriculaColegioMedico: 'CM-12345',
                matriculaSanidad: 'MS-67890'
            }
        ]);

        // 6. Seed Comunidades
        console.log('🏘️ Insertando comunidades...');
        await db.insert(schema.comunidades).values([
            {
                codigoComunidad: 'COM-001',
                nombreComunidad: 'La Esperanza',
                tipoComunidad: '1',
                estado: 'Miranda',
                municipio: 'Sucre',
                direccion: 'Sector La Esperanza, Petare',
                ubicacionFisica: 'Coordenadas: 10.4806, -66.8037',
                cedulaResponsable: '12345678',
                cantidadHabitantes: 5000,
                cantidadFamilias: 1200,
                telefonoComunidad: '02125551234'
            },
            {
                codigoComunidad: 'COM-002',
                nombreComunidad: 'El Progreso',
                tipoComunidad: '2',
                estado: 'Aragua',
                municipio: 'Girardot',
                direccion: 'Vía Principal El Progreso',
                ubicacionFisica: 'Coordenadas: 10.2514, -67.5978',
                cedulaResponsable: '23456789',
                cantidadHabitantes: 3500,
                cantidadFamilias: 800,
                telefonoComunidad: '02435551234'
            }
        ]);

        // 7. Seed Medicamentos
        console.log('💊 Insertando medicamentos...');
        await db.insert(schema.medicamentos).values([
            {
                codigoMedicamento: 'MED-001',
                nombreMedicamento: 'Paracetamol',
                presentacion: 'Tabletas 500mg x 20',
                descripcion: 'Analgésico y antipirético',
                existencia: 500
            },
            {
                codigoMedicamento: 'MED-002',
                nombreMedicamento: 'Amoxicilina',
                presentacion: 'Cápsulas 500mg x 12',
                descripcion: 'Antibiótico de amplio espectro',
                existencia: 300
            },
            {
                codigoMedicamento: 'MED-003',
                nombreMedicamento: 'Losartán',
                presentacion: 'Tabletas 50mg x 30',
                descripcion: 'Antihipertensivo',
                existencia: 200
            },
            {
                codigoMedicamento: 'MED-004',
                nombreMedicamento: 'Metformina',
                presentacion: 'Tabletas 850mg x 30',
                descripcion: 'Hipoglucemiante oral',
                existencia: 150
            }
        ]);

        // 8. Seed Abordajes
        console.log('📍 Insertando abordajes...');
        await db.insert(schema.abordaje).values([
            {
                codigoAbordaje: 'ABD-001',
                fechaAbordaje: new Date('2024-01-15'),
                horaInicio: '08:00:00',
                horaFin: '14:00:00',
                descripcion: 'Jornada médica integral en la comunidad La Esperanza'
            },
            {
                codigoAbordaje: 'ABD-002',
                fechaAbordaje: new Date('2024-02-10'),
                horaInicio: '09:00:00',
                horaFin: '15:00:00',
                descripcion: 'Operativo de salud preventiva en El Progreso'
            }
        ]);

        // 9. Seed Abordaje-Comunidad (relación)
        console.log('🔗 Insertando relaciones abordaje-comunidad...');
        await db.insert(schema.abordajeComunidad).values([
            {
                codigoAbordaje: 'ABD-001',
                codigoComunidad: 'COM-001',
                observaciones: 'Alta participación de la comunidad'
            },
            {
                codigoAbordaje: 'ABD-002',
                codigoComunidad: 'COM-002',
                observaciones: 'Buena organización del consejo comunal'
            }
        ]);

        // 10. Seed Tejedores-Abordaje (relación)
        console.log('🔗 Insertando relaciones tejedores-abordaje...');
        await db.insert(schema.tejedoresAbordaje).values([
            {
                codigoAbordaje: 'ABD-001',
                cedulaTejedor: '11111111',
                rolEnAbordaje: 'Médico atendiendo'
            },
            {
                codigoAbordaje: 'ABD-001',
                cedulaTejedor: '22222222',
                rolEnAbordaje: 'Farmacéutico dispensador'
            },
            {
                codigoAbordaje: 'ABD-002',
                cedulaTejedor: '11111111',
                rolEnAbordaje: 'Médico coordinador'
            },
            {
                codigoAbordaje: 'ABD-002',
                cedulaTejedor: '33333333',
                rolEnAbordaje: 'Trabajadora social'
            }
        ]);

        console.log('✅ Seed completado exitosamente!');
        console.log('\n📊 Resumen:');
        console.log('  - 2 Responsables');
        console.log('  - 3 Especialidades');
        console.log('  - 4 Enfermedades');
        console.log('  - 3 Tejedores');
        console.log('  - 1 Médico');
        console.log('  - 2 Comunidades');
        console.log('  - 4 Medicamentos');
        console.log('  - 2 Abordajes');
        console.log('  - 2 Relaciones Abordaje-Comunidad');
        console.log('  - 4 Relaciones Tejedores-Abordaje');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        process.exit(1);
    }
}

seed();
