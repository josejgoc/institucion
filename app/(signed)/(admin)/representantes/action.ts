"use server";

import db from "@/libs/db";
import { Estudiante, Representante } from "@prisma/client";

// export interface Alumno extends Omit<Estudiante, "gradoId" | "seccionId"> {
//   grado?: Omit<Grado, "id"> | null;
//   salud?: Omit<Estudiante_Salud, "estudianteId"> | null;
//   seccion?: Omit<Seccion, "id" | "gradoId"> | null;
// }

export async function obtenerRepresentantes(): Promise<Representante[]> {
  return await db.representante.findMany();
}

export interface dataCrearRepresentanteProps
  extends Omit<Representante, "usuarioId" | "foto" | "id"> {
  email: string;
  password: string;
}

export async function crearRepresentante(data: dataCrearRepresentanteProps) {
  const query = await db.usuario.count({ where: { correo: data.email } });

  if (query > 0) {
    return { error: "El correo ya existe" };
  }

  const createUserQuery = await db.usuario.create({
    data: {
      correo: data.email,
      clave: data.password,
      tipo: "representante",
    },
  });

  if (!createUserQuery) {
    return { error: "No se pudo crear el usuario" };
  }

  const createRepresentanteQuery = await db.representante.create({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      fechaNacimiento: data.fechaNacimiento,
      documentoIdentidad: data.documentoIdentidad,
      genero: data.genero,
      ocupacion: data.ocupacion,
      telefono: data.telefono,
      direccion: data.direccion,
      usuarioId: createUserQuery.id,
    },
  });

  if (!createRepresentanteQuery) {
    return { error: "No se pudo crear el representante" };
  } else {
    return { data: await obtenerRepresentantes() };
  }
}

export async function modificarRepresentante(
  data: Omit<Representante, "foto">
) {
  const query = await db.representante.update({
    data: {
      nombres: data.nombres,
      apellidos: data.apellidos,
      fechaNacimiento: data.fechaNacimiento,
      documentoIdentidad: data.documentoIdentidad,
      genero: data.genero,
      ocupacion: data.ocupacion,
      telefono: data.telefono,
      direccion: data.direccion,
    },
    where: {
      id: data.id,
    },
  });

  if (!query) {
    return { error: "No se pudo crear el alumno" };
  } else {
    return { data: await obtenerRepresentantes() };
  }
}

export async function eliminarRepresentante(id: number, usuarioId: number) {
  const query = await db.representante_Estudiante.deleteMany({
    where: { representanteId: id },
  });

  if (!query || query.count <= 0) {
    return { error: "No se pudo eliminar el representante" };
  }

  const query1 = await db.usuario.delete({
    where: { id: usuarioId },
  });

  if (!query1) {
    return { error: "No se pudo eliminar el representante" };
  }

  const query2 = await db.representante.delete({ where: { id } });

  if (!query2) {
    return { error: "No se pudo eliminar el representante" };
  } else {
    return { data: await obtenerRepresentantes() };
  }
}

export async function obtenerAlumnos(
  id: number
): Promise<{ data?: Estudiante[]; error?: string }> {
  const query = await db.representante_Estudiante.findMany({
    include: {
      estudiante: {
        include: {
          grado: true,
          seccion: true,
        },
      },
    },
    where: {
      representanteId: id,
    },
  });

  if (!query) {
    return { error: "No se pudo obtener los representantes" };
  } else {
    const result = query.map((item) =>
      Object.assign(item.estudiante, { relacionId: item.id })
    );
    return { data: result };
  }
}

export async function obtenerAlumnosDisponibles(representanteId: number) {
  const estudiantesSinRepresentante = await db.estudiante.findMany({
    where: {
      representantes: {
        none: {
          representanteId: representanteId,
        },
      },
    },
  });

  if (!estudiantesSinRepresentante) {
    return { error: "No se pudo obtener los alumnos" };
  } else {
    return { data: estudiantesSinRepresentante };
  }
}

export async function agregarEstudianteAlRepresentante(data: {
  representanteId: number;
  estudianteId: number;
  parentesco: string;
}) {
  const query = await db.representante_Estudiante.create({
    data: {
      representanteId: data.representanteId,
      estudianteId: data.estudianteId,
      parentesco: data.parentesco,
    },
  });

  if (!query) {
    return { error: "No se pudo agregar el estudiante al representante" };
  } else {
    return await obtenerAlumnosDisponibles(data.representanteId);
  }
}

export async function eliminarAlumnoDeRepresentante(
  id: number,
  representanteId: number
) {
  const query = await db.representante_Estudiante.deleteMany({
    where: { id: id },
  });

  if (!query || query.count <= 0) {
    return { error: "No se pudo eliminar el representante" };
  }

  return await obtenerAlumnos(representanteId);
}
