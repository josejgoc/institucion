"use client";
import { Grado } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { eliminarSeccion, obtenerSecciones } from "./actions";
import ModalCrearSeccion from "./modals/crearSeccion";
import ModalModificarGrado from "./modals/modificarSeccion";

type Seccion = {
  id: number;
  nombre: string;
  gradoId: number;
  grado: {
    id: number;
    nombre: string;
  };
};

export default function SeccionesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [modalCrearSeccion, setModalCrearSeccion] = useState(false);
  const [modalModificarSeccion, setModalModificarSeccion] = useState(false);
  const [infoModalModificarSeccion, setInfoModalModificarSeccion] =
    useState<Seccion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerSecciones()
      .then((res) => {
        console.log(res);
        setSecciones(res);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const handleCrearSeccion = () => setModalCrearSeccion(!modalCrearSeccion);
  const handleModificarSeccion = (
    seccion: (Seccion & { grado: Grado }) | null
  ) => {
    if (seccion === null) {
      setModalModificarSeccion(false);
    } else {
      setModalModificarSeccion(true);
    }
    setInfoModalModificarSeccion(seccion);
  };

  return (
    <>
      <ModalCrearSeccion
        show={modalCrearSeccion}
        setShow={handleCrearSeccion}
        action={setSecciones}
      />
      <ModalModificarGrado
        show={modalModificarSeccion}
        setShow={handleModificarSeccion}
        action={setSecciones}
        seccion={infoModalModificarSeccion as Seccion}
      />

      <div className="rounded-lg flex flex-col gap-2 h-full">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Secciones</h1>
          <button
            type="button"
            onClick={() => setModalCrearSeccion(true)}
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
          {!cargando && secciones.length === 0 && <p>No hay grados</p>}
          {secciones.map((seccion) => (
            <div
              key={seccion.id}
              className="flex items-center justify-between flex-wrap gap-4 odd:bg-slate-200 even:bg-slate-50 p-2 first:rounded-t-lg last:rounded-b-lg"
            >
              <h2>{`${seccion.grado.nombre} ${seccion.nombre}`}</h2>
              <div className="flex items-center gap-2">
                <Link
                  href={`/secciones/${seccion.id}/estudiantes`}
                  className="text-blue-500 active:text-blue-600 transition-all duration-100 text-sm"
                >
                  Estudiantes
                </Link>
                <button
                  type="button"
                  className="text-blue-500 active:text-blue-600 transition-all duration-100 text-sm"
                  onClick={() => {
                    handleModificarSeccion(seccion);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-red-500 active:text-red-600 transition-all duration-100 text-sm"
                  type="button"
                  onClick={() => {
                    eliminarSeccion(seccion.id)
                      .then((res) => {
                        if ((res as { error: string }).error) {
                          alert((res as { error: string }).error);
                        } else {
                          setSecciones(res as Seccion[]);
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
