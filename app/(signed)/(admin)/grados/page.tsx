"use client";
import { Grado } from "@prisma/client";
import { useEffect, useState } from "react";
import { eliminarGrado, obtenerGrados } from "./actions";
import ModalCrearGrado from "./modals/crearGrado";
import ModalModificarGrado from "./modals/modificarGrado";

export default function GradosPage() {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [modalCrearGrado, setModalCrearGrado] = useState(false);
  const [modalModificarGrado, setModalModificarGrado] = useState(false);
  const [infoModalModificarGrado, setInfoModalModificarGrado] =
    useState<Grado | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerGrados()
      .then((res) => {
        setGrados(res);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const handleCrearGrado = () => setModalCrearGrado(!modalCrearGrado);
  const handleModificarGrado = (grado: Grado | null) => {
    if (grado === null) {
      setModalModificarGrado(false);
    } else {
      setModalModificarGrado(true);
    }
    setInfoModalModificarGrado(grado);
  };

  return (
    <>
      <ModalCrearGrado
        show={modalCrearGrado}
        setShow={handleCrearGrado}
        action={setGrados}
      />
      <ModalModificarGrado
        show={modalModificarGrado}
        setShow={handleModificarGrado}
        action={setGrados}
        grado={infoModalModificarGrado as Grado}
      />

      <div className="h-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Grados</h1>
          <button
            type="button"
            onClick={() => setModalCrearGrado(true)}
            className="bg-green-500 py-1 px-3 text-sm text-white active:bg-green-600 rounded-md transition-all duration-100"
          >
            Agregar
          </button>
        </div>
        <div className="w-full h-full flex flex-col">
          {cargando && (
            <div className="flex gap-1 items-center">
              <span>Cargando</span>
              <div className="animate-bounce size-1 bg-blue-500 rounded-full" />
              <div className="animate-[bounce_1s_infinite_100ms]  size-1 delay-150 bg-blue-600 rounded-full" />
              <div className="animate-bounce size-1  bg-blue-500 rounded-full" />
            </div>
          )}
          {!cargando && grados.length === 0 && <p>No hay grados</p>}
          {grados.map((grado) => (
            <div
              key={grado.id}
              className="flex items-center justify-between flex-wrap gap-4 odd:bg-slate-200 even:bg-slate-50 first:rounded-t-lg last:rounded-b-lg p-2"
            >
              <h2>{grado.nombre}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-blue-500 active:text-blue-600 transition-all duration-100 text-sm"
                  onClick={() => {
                    handleModificarGrado(grado);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-red-500 active:text-red-600 transition-all duration-100 text-sm"
                  type="button"
                  onClick={() => {
                    eliminarGrado(grado.id)
                      .then((res) => {
                        if ((res as { error: string }).error) {
                          alert((res as { error: string }).error);
                        } else {
                          setGrados(res as Grado[]);
                        }
                      })
                      .catch((error) => {
                        console.error(error);
                        alert("Ocurrió un error");
                      });
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
