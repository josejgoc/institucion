"use client";

import { Grado } from "@prisma/client";
import { crearGrado } from "../actions";

export default function ModalCrearGrado({
  show,
  setShow,
  action,
}: {
  show: boolean;
  setShow: () => void;
  action: (res: Grado[]) => void;
}) {
  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3">
          <h2 className="text-xl font-bold">Crear grado</h2>
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

              crearGrado({ nombre })
                .then((res) => {
                  if ((res as { error: string }).error) {
                    alert((res as { error: string }).error);
                  } else {
                    target.reset();
                    action(res as Grado[]);
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
            <input
              type="text"
              name="nombre"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none"
            />

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
