"use server";
import db from "@/libs/db";

export default async function infoDashboardAdmin() {
  const totalAlumnos = await db.estudiante.count();
  const totalAlumnosVerificados = await db.estudiante.count({
    where: { verificado: true },
  });
  const totalDocentes = await db.profesor.count();
  const totalRepresentantes = await db.representante.count();
  const totalGrados = await db.grado.count();
  const totalSecciones = await db.seccion.count();
  return {
    totalAlumnos,
    totalAlumnosVerificados,
    totalDocentes,
    totalRepresentantes,
    totalGrados,
    totalSecciones,
  };
}
