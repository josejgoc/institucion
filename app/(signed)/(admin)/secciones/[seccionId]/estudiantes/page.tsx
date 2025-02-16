import { obtenerEstudiantes } from "./actions";

export default async function EstudiantesSeccionPage({
  params,
}: {
  params: Promise<{ seccionId: string }>;
}) {
  const seccionId = (await params).seccionId;
  const data = await obtenerEstudiantes(seccionId);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-2">
      <h2>Seccion: {data?.grado.nombre + " " + data?.nombre}</h2>
      <div></div>
    </div>
  );
}
