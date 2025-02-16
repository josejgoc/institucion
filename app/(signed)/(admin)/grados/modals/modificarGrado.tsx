"use client";

import { Grado } from "@prisma/client";
import { modificarGrado } from "../actions";

export default function ModalModificarGrado({
  show,
  setShow,
  grado,
  action,
}: {
  show: boolean;
  setShow: (grado: Grado | null) => void;
  grado: Grado;
  action: (grados: Grado[]) => void;
}) {
  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3">
          <h2 className="text-xl font-bold">Modificar grado</h2>
          <form
            className="flex items-center gap-2 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as HTMLFormElement;
              const nombre = target.nombre.value;
              target.ariaDisabled = "true";

              if (!nombre || !nombre.trim()) {
                alert("El nombre es requerido");
                return;
              }

              if (!grado.id) {
                alert("El grado no tiene un identificador");
                return;
              }

              modificarGrado({ id: grado.id, nombre })
                .then((res) => {
                  if ((res as { error: string }).error) {
                    alert((res as { error: string }).error);
                  } else {
                    target.reset();
                    action(res as Grado[]);
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
            <input
              type="text"
              name="nombre"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none"
              defaultValue={grado.nombre}
            />
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
