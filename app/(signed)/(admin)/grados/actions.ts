"use server";
import db from "@/libs/db";
import { Grado } from "@prisma/client";

export async function obtenerGrados() {
  let grados: Grado[] = [];

  const query = await db.grado.findMany();

  if (query) {
    grados = query;
  }

  return grados;
}

export async function crearGrado(data: {
  nombre: string;
}): Promise<Grado[] | { error?: string }> {
  const query = await db.grado.create({ data });

  if (!query) {
    return { error: "No se pudo crear el grado" };
  } else {
    return await db.grado.findMany();
  }
}

export async function modificarGrado(data: { id: number; nombre: string }) {
  const query = await db.grado.update({
    where: { id: data.id },
    data: { nombre: data.nombre },
  });

  if (!query) {
    return { error: "No se pudo modificar el grado" };
  } else {
    return await db.grado.findMany();
  }
}

export async function eliminarGrado(id: number) {
  const query = await db.grado.delete({ where: { id } });

  if (!query) {
    return { error: "No se pudo eliminar el grado" };
  } else {
    return await db.grado.findMany();
  }
}
