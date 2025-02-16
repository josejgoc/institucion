"use client";

import { Grado, Seccion } from "@prisma/client";
import { useEffect, useState } from "react";
import { obtenerGrados } from "../../grados/actions";
import { modificarSeccion } from "../actions";

export default function ModalModificarSeccion({
  show,
  setShow,
  seccion,
  action,
}: {
  show: boolean;
  setShow: (seccion: (Seccion & { grado: Grado }) | null) => void;
  seccion: Seccion;
  action: (seccion: (Seccion & { grado: Grado })[]) => void;
}) {
  const [grados, setGrados] = useState<Grado[]>([]);

  useEffect(() => {
    obtenerGrados().then((res) => setGrados(res));
  }, []);

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3">
          <h2 className="text-xl font-bold">Modificar Seccion</h2>
          <form
            className="flex items-center gap-2 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as HTMLFormElement;

              const nombre = target.nombre.value;
              const gradoId = target.gradoId.value;
              target.ariaDisabled = "true";

              if (!nombre || !nombre.trim()) {
                alert("El nombre es requerido");
                return;
              }

              if (!seccion.id) {
                alert("El grado no tiene un identificador");
                return;
              }

              modificarSeccion({
                id: seccion.id,
                nombre,
                gradoId: Number(gradoId),
              })
                .then((res) => {
                  if ((res as { error: string }).error) {
                    alert((res as { error: string }).error);
                  } else {
                    target.reset();
                    action(res as (Seccion & { grado: Grado })[]);
                    setShow(null);
                  }
                })
                .catch((error) => {
                  console.error(error);
                  alert("Ocurrió un error");
                });

              target.ariaDisabled = null;
            }}
          >
            <div>
              <label htmlFor="nombre" className="text-sm">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                defaultValue={seccion.nombre}
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="gradoId">Grado</label>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="gradoId"
                id="gradoId"
                defaultValue={seccion.gradoId}
              >
                <option value="">Seleccionar...</option>
                {grados.map((grado) => (
                  <option key={grado.id} value={grado.id}>
                    {grado.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 active:bg-blue-600 transition-all duration-100 py-1 px-2 w-full flex items-center justify-center rounded-md text-white shadow-md active:shadow-none"
            >
              Guardar
            </button>
          </form>
          <button
            type="button"
            onClick={() => setShow(null)}
            className="text-red-500 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  );
}
