"use server";

import db from "@/libs/db";
import {
  Estudiante,
  Estudiante_Salud,
  Grado,
  Representante,
  Seccion,
} from "@prisma/client";

export interface Alumno extends Omit<Estudiante, "gradoId" | "seccionId"> {
  grado?: Omit<Grado, "id"> | null;
  salud?: Omit<Estudiante_Salud, "estudianteId"> | null;
  seccion?: Omit<Seccion, "id" | "gradoId"> | null;
}

export async function obtenerAlumnos(): Promise<Alumno[]> {
  return await db.estudiante.findMany({
    select: {
      id: true,
      nombres: true,
      apellidos: true,
      fechaNacimiento: true,
      documentoIdentidad: true,
      genero: true,
      foto: true,
      verificado: true,
      grado: {
        select: {
          nombre: true,
        },
      },
      seccion: {
        select: {
          nombre: true,
        },
      },
      salud: {
        select: {
          asmatico: true,
          parto_normal: true,
          duracion_embarazo: true,
          convulsiones: true,
          medicamentos: true,
          control_medico: true,
          infome_medico: true,
          intervencion_quirurgica: true,
          impedimento_fisico: true,
          impedimento_fisico_reason: true,
        },
      },
    },
  });
}

export interface dataCrearAlumnoProps
  extends Omit<
    Estudiante,
    "gradoId" | "seccionId" | "id" | "verificado" | "foto"
  > {
  salud: Omit<Estudiante_Salud, "estudianteId">;
}

export interface dataModificarAlumnoProps
  extends Omit<Estudiante, "gradoId" | "seccionId"> {
  salud: Omit<Estudiante_Salud, "estudianteId">;
}

export async function crearAlumno(data: dataCrearAlumnoProps) {
  const query = await db.estudiante.create({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      fechaNacimiento: new Date(data.fechaNacimiento),
      documentoIdentidad: data.documentoIdentidad,
      genero: data.genero,
    },
  });

  if (!query) {
    return { error: "No se pudo crear el alumno" };
  } else {
    await db.estudiante_Salud.create({
      data: {
        estudianteId: query.id,
        asmatico: data.salud.asmatico,
        parto_normal: data.salud.parto_normal,
        duracion_embarazo: Number(data.salud.duracion_embarazo),
        convulsiones: data.salud.convulsiones,
        medicamentos: data.salud.medicamentos,
        control_medico: data.salud.control_medico,
        infome_medico: data.salud.infome_medico,
        intervencion_quirurgica: data.salud.intervencion_quirurgica,
        impedimento_fisico: data.salud.impedimento_fisico,
        impedimento_fisico_reason: data.salud.impedimento_fisico_reason,
      },
    });

    return { data: await obtenerAlumnos() };
  }
}

export async function modificarAlumno(data: dataModificarAlumnoProps) {
  const query = await db.estudiante.update({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      fechaNacimiento: data.fechaNacimiento,
      documentoIdentidad: data.documentoIdentidad,
      genero: data.genero,
    },
    where: {
      id: data.id,
    },
  });

  if (!query) {
    return { error: "No se pudo crear el alumno" };
  } else {
    await db.estudiante_Salud.update({
      data: {
        asmatico: data.salud.asmatico,
        parto_normal: data.salud.parto_normal,
        duracion_embarazo: Number(data.salud.duracion_embarazo),
        convulsiones: data.salud.convulsiones,
        medicamentos: data.salud.medicamentos,
        control_medico: data.salud.control_medico,
        infome_medico: data.salud.infome_medico,
        intervencion_quirurgica: data.salud.intervencion_quirurgica,
        impedimento_fisico: data.salud.impedimento_fisico,
        impedimento_fisico_reason: data.salud.impedimento_fisico_reason,
      },
      where: {
        estudianteId: data.id,
      },
    });

    return { data: await obtenerAlumnos() };
  }
}

export async function eliminarAlumno(id: number) {
  await db.estudiante_Salud.deleteMany({
    where: { estudianteId: id },
  });
  const query2 = await db.estudiante.delete({ where: { id } });

  if (!query2) {
    return { error: "No se pudo eliminar el alumno" };
  } else {
    return { data: await obtenerAlumnos() };
  }
}

interface RepresentanteProps extends Representante {
  parentesco: string;
}

export async function obtenerRepresentantes(
  id: number
): Promise<{ data?: RepresentanteProps[]; error?: string }> {
  const query = await db.representante_Estudiante.findMany({
    include: {
      representante: true,
    },
    where: {
      estudianteId: id,
    },
  });

  console.log(query);

  if (!query) {
    return { error: "No se pudo obtener los representantes" };
  } else {
    const result = query.map((item) =>
      Object.assign(item.representante, { parentesco: item.parentesco })
    );
    return { data: result };
  }
}
