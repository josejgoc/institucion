import { getSession } from "@/libs/session";
import { redirect } from "next/navigation";
import infoDashboardAdmin from "./(admin)/actions";

export default async function Home() {
  const session = await getSession();
  const data = await infoDashboardAdmin();

  if (!session) {
    return redirect("/login");
  } else if (session?.user.datos.tipo === "admin") {
    return (
      <div className="grid grid-cols-2 grid-rows-3 items-center justify-items-center w-full h-full gap-1 flex-1 bg-slate-100 rounded-md overflow-hidden">
        <div className="bg-blue-500 flex items-center justify-center w-full h-full text-center">
          <h2 className="text-2xl text-white uppercase font-bold flex flex-col">
            Numero de docentes <br />
            <span className="text-4xl p-3">{data.totalDocentes}</span>
          </h2>
        </div>
        <div className="bg-green-500 flex items-center justify-center w-full h-full text-center">
          <h2 className="text-2xl text-white uppercase font-bold flex flex-col">
            Numero de representantes <br />
            <span className="text-4xl p-3"> {data.totalRepresentantes}</span>
          </h2>
        </div>
        <div className="bg-orange-500 flex items-center justify-center w-full h-full text-center">
          <h2 className="text-2xl text-white uppercase font-bold flex flex-col">
            Alumnos Inscriptos <br />
            <span className="text-4xl p-3">{data.totalAlumnos}</span>
          </h2>
        </div>
        <div className="bg-yellow-500 flex items-center justify-center w-full h-full text-center">
          <h2 className="text-2xl text-white uppercase font-bold flex flex-col">
            Alumnos Verificado <br />
            <span className="text-4xl p-3">
              {" "}
              {data.totalAlumnosVerificados}
            </span>
          </h2>
        </div>
        <div className="bg-yellow-500 flex items-center justify-center w-full h-full text-center">
          <h2 className="text-2xl text-white uppercase font-bold flex flex-col">
            Numero de grados <br />
            <span className="text-4xl p-3"> {data.totalGrados}</span>
          </h2>
        </div>
        <div className="bg-yellow-500 flex items-center justify-center w-full h-full text-center">
          <h2 className="text-2xl text-white uppercase font-bold flex flex-col">
            Numero de secciones <br />
            <span className="text-4xl p-3"> {data.totalSecciones} </span>
          </h2>
        </div>
      </div>
    );
  } else if (session?.user.datos.tipo === "profesor") {
    return (
      <div className="flex flex-wrap items-center justify-items-center w-full h-full p-4 gap-4 flex-1">
        hola profe
      </div>
    );
  } else if (session?.user.datos.tipo === "representante") {
    return (
      <div className="flex flex-wrap items-center justify-items-center w-full h-full p-4 gap-4 flex-1">
        hola representante
      </div>
    );
  } else {
    return (
      <div className="aspect-square bg-white shadow-md rounded p-4">
        Acceso Restringido
      </div>
    );
  }
}
