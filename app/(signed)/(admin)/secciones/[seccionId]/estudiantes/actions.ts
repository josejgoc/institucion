"use server";
import db from "@/libs/db";
import { Grado, Seccion } from "@prisma/client";

interface ResultProps extends Seccion {
  grado: Grado;
}

export async function obtenerEstudiantes(
  seccionId: string
): Promise<ResultProps | null> {
  let result = null;

  await db.seccion
    .findUnique({
      select: {
        nombre: true,
        grado: true,
        estudiantes: true,
      },
      where: {
        id: Number(seccionId),
      },
    })
    .then((res) => (result = res));

  return result;

  // if (query) {
  //   return query;
  // }

  // return { error: "Hubo un error buscar estudiantes" };
}
