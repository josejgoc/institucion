"use client";
import { Profesor } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { eliminarDocente, obtenerDocentes } from "./actions";
import ModalCrearDocente from "./modals/crearDocente";
import ModalModificarGrado from "./modals/modificarDocente";

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Profesor[]>([]);
  const [modalCrearDocente, setModalCrearDocente] = useState(false);
  const [modalModificarDocente, setModalModificarDocente] = useState(false);
  const [infoModalModificarDocente, setInfoModalModificarDocente] =
    useState<Profesor | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerDocentes()
      .then((res) => {
        setDocentes(res);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const handleCrearDocente = () => setModalCrearDocente(!modalCrearDocente);
  const handleModificarDocente = (docente: Profesor | null) => {
    if (docente === null) {
      setModalModificarDocente(false);
    } else {
      setModalModificarDocente(true);
    }
    setInfoModalModificarDocente(docente);
  };

  return (
    <>
      <ModalCrearDocente
        show={modalCrearDocente}
        setShow={handleCrearDocente}
        action={setDocentes}
      />
      <ModalModificarGrado
        show={modalModificarDocente}
        setShow={handleModificarDocente}
        action={setDocentes}
        profesor={infoModalModificarDocente as Profesor}
      />

      <div className=" flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Docentes</h1>
          <button
            type="button"
            onClick={() => setModalCrearDocente(true)}
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
          {!cargando && docentes.length === 0 && <p>No hay docentes</p>}
          {docentes.map((docente) => (
            <div
              key={docente.id}
              className="flex items-center justify-between flex-wrap gap-4 odd:bg-slate-200 even:bg-slate-100 p-2 group first:rounded-t-md last:rounded-b-md"
            >
              <div className="flex gap-4 items-center justify-center">
                <Image
                  src={docente.ruta_imagen}
                  alt={docente.nombre}
                  width={80}
                  height={88}
                  className="h-[5.5rem] w-20 rounded-md object-cover border group-odd:border-slate-100 group-even:border-slate-200 transition-all duration-100"
                />
                <div>
                  <h2 className="text-lg font-semibold">{docente.nombre}</h2>
                  <p className="font-medium">
                    Titulo:{" "}
                    <span className="font-normal">{docente.titulo}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-blue-500 active:text-blue-600 transition-all duration-100"
                  onClick={() => {
                    handleModificarDocente(docente);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-red-500 active:text-red-600 transition-all duration-100"
                  type="button"
                  onClick={() => {
                    eliminarDocente(docente.id)
                      .then((res) => {
                        if ((res as { error: string }).error) {
                          alert((res as { error: string }).error);
                        } else {
                          setDocentes(res as Profesor[]);
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
