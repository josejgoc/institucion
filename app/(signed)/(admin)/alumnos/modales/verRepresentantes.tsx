import { Representante } from "@prisma/client";
import { useEffect, useState } from "react";
import { obtenerRepresentantes } from "../action";

interface RepresentanteProps extends Representante {
  parentesco: string;
}

export default function ModalVerRepresentantes({
  id,
  show,
  setShow,
}: {
  id: number | null;
  show: boolean;
  setShow: (alumno: number | null) => void;
}) {
  const [representantes, setRepresentantes] = useState<RepresentanteProps[]>(
    []
  );
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (id === null) {
      return;
    }

    obtenerRepresentantes(id)
      .then((res) => {
        if (res.error) {
          alert(res.error);
          setShow(null);
          return;
        }
        setRepresentantes(res.data ?? []);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, [id, setShow]);

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3 min-w-64 w-full max-w-sm">
          <header className="flex gap-4 items-center justify-between ">
            <h1 className="text-xl font-bold">Representantes</h1>
            <button
              className="text-red-500 active:text-red-600 transition-all duration-100 text-sm"
              onClick={() => setShow(null)}
            >
              Cerrar
            </button>
          </header>

          {cargando ? (
            <div className="flex gap-1 items-center">
              <span>Cargando</span>
              <div className="animate-bounce size-1 bg-blue-500 rounded-full" />
              <div className="animate-[bounce_1s_infinite_100ms]  size-1 delay-150 bg-blue-600 rounded-full" />
              <div className="animate-bounce size-1  bg-blue-500 rounded-full" />
            </div>
          ) : (
            <div>
              {representantes.length === 0 ? (
                <p>No hay representantes</p>
              ) : (
                representantes.map((representante) => (
                  <div
                    key={representante.id}
                    className="odd:bg-slate-200 even:bg-slate-100 p-2 first:rounded-t-md last:rounded-b-md"
                  >
                    <h2 className="font-bold text-lg">
                      {representante.apellidos + " " + representante.nombres}
                    </h2>
                    <p className="font-semibold">
                      Parentesco:{" "}
                      <span className="font-normal">
                        {representante.parentesco}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Direccion:{" "}
                      <span className="font-normal">
                        {representante.direccion}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Telefono:{" "}
                      <span className="font-normal">
                        {representante.telefono}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Ocupacion:{" "}
                      <span className="font-normal">
                        {representante.ocupacion}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
}
