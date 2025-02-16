"use server";
import db from "@/libs/db";
import { Seccion } from "./types";

export async function obtenerSecciones() {
  let secciones: Seccion[] = [];

  const query = await db.seccion.findMany({
    select: {
      id: true,
      nombre: true,
      gradoId: true,
      grado: true,
    },
  });

  if (query) {
    secciones = query;
  }

  return secciones;
}

export async function crearSecciones(data: {
  nombre: string;
  gradoId: number;
}): Promise<Seccion[] | { error?: string }> {
  const query = await db.seccion.create({ data });

  if (!query) {
    return { error: "No se pudo crear el grado" };
  } else {
    return await db.seccion.findMany({
      select: {
        id: true,
        nombre: true,
        gradoId: true,
        grado: true,
      },
    });
  }
}

export async function modificarSeccion(data: {
  id: number;
  nombre: string;
  gradoId: number;
}) {
  const query = await db.seccion.update({
    where: { id: data.id },
    data: { nombre: data.nombre, gradoId: data.gradoId },
  });

  if (!query) {
    return { error: "No se pudo modificar el grado" };
  } else {
    return await db.seccion.findMany({
      select: {
        id: true,
        nombre: true,
        gradoId: true,
        grado: true,
      },
    });
  }
}

export async function eliminarSeccion(id: number) {
  const query = await db.seccion.delete({ where: { id } });

  if (!query) {
    return { error: "No se pudo eliminar el grado" };
  } else {
    return await db.seccion.findMany({
      select: {
        id: true,
        nombre: true,
        gradoId: true,
        grado: true,
      },
    });
  }
}
