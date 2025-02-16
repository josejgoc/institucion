"use client";

import { Grado, Seccion } from "@prisma/client";
import { useEffect, useState } from "react";
import { obtenerGrados } from "../../grados/actions";
import { crearSecciones } from "../actions";

export default function ModalCrearSeccion({
  show,
  setShow,
  action,
}: {
  show: boolean;
  setShow: () => void;
  action: (res: (Seccion & { grado: Grado })[]) => void;
}) {
  const [grados, setGrados] = useState<Grado[]>([]);

  useEffect(() => {
    obtenerGrados().then((res) => setGrados(res));
  }, []);

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3">
          <h2 className="text-xl font-bold">Crear seccion</h2>
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

              crearSecciones({ nombre, gradoId: Number(gradoId) })
                .then((res) => {
                  if ((res as { error: string }).error) {
                    alert((res as { error: string }).error);
                  } else {
                    target.reset();
                    action(res as (Seccion & { grado: Grado })[]);
                    setShow();
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
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="gradoId">Grado</label>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="gradoId"
                id="gradoId"
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
              className="bg-green-500 active:bg-green-600 transition-all duration-100 py-1 px-2 w-full flex items-center justify-center rounded-md text-white shadow-md active:shadow-none"
            >
              Guardar
            </button>
          </form>
          <button
            type="button"
            onClick={() => setShow()}
            className="text-red-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  );
}
