"use client";

import { Representante } from "@prisma/client";
import { useEffect, useState } from "react";
import { eliminarRepresentante, obtenerRepresentantes } from "./action";
import ModalCrearRepresentante from "./modales/crearRepresentante";
import ModalModificarRepresentante from "./modales/modificarRepresentante";
import ModalVerAlumnos from "./modales/verAlumnos";

export default function RepresentantesAdmin() {
  const [representantes, setRepresentates] = useState<Representante[]>([]);
  const [modalCrearRepresentante, setModalCrearRepresentante] = useState(false);
  const [modalModificarRepresentante, setModalModificarRepresentante] =
    useState(false);
  const [modalAlumnos, setModalAlumnos] = useState(false);
  const [infoModalRepresentantes, setInfoModalRepresentantes] = useState<
    number | null
  >(null);
  const [infoModalModificarAlumno, setInfoModalModificarAlumno] =
    useState<Representante | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerRepresentantes()
      .then((res) => {
        setRepresentates(res);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const handleCrearAlumno = () =>
    setModalCrearRepresentante(!modalCrearRepresentante);
  const handleModificarRepresentante = (
    representante: Representante | null
  ) => {
    if (representante === null) {
      setModalModificarRepresentante(false);
    } else {
      setModalModificarRepresentante(true);
    }
    setInfoModalModificarAlumno(representante);
  };

  const handleVerAlumnnos = (representante: number | null) => {
    if (representante === null) {
      setModalAlumnos(false);
    } else {
      setModalAlumnos(true);
    }
    setInfoModalRepresentantes(representante as number);
  };

  const handleEliminarAlumno = async (id: number, usuarioId: number) => {
    await eliminarRepresentante(id, usuarioId)
      .then(({ data, error }) => {
        if (error) {
          alert(error);
        } else {
          setRepresentates((data as Representante[]) ?? []);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Ocurrió un error");
      });
  };

  return (
    <>
      <ModalCrearRepresentante
        show={modalCrearRepresentante}
        setShow={handleCrearAlumno}
        action={setRepresentates}
      />
      <ModalModificarRepresentante
        show={modalModificarRepresentante}
        setShow={handleModificarRepresentante}
        representante={infoModalModificarAlumno as Representante}
        action={setRepresentates}
      />

      <ModalVerAlumnos
        id={infoModalRepresentantes as number}
        show={modalAlumnos}
        setShow={handleVerAlumnnos}
      />

      <section className="flex flex-col  w-full h-full gap-4 flex-1">
        <header className="flex w-full gap-4 justify-between flex-wrap items-center">
          <h1 className="text-xl font-bold">Listado de representantes</h1>

          <div className="flex gap-2 items-center">
            <button
              className="bg-green-500 py-2 px-3 text-sm text-white active:bg-green-600 rounded transition-all duration-100"
              onClick={handleCrearAlumno}
            >
              Agregar
            </button>
            <input
              type="text"
              placeholder="Buscar por nombre"
              className="border border-slate-200 px-2 py-2 rounded bg-slate-100 text-sm"
            />
          </div>
        </header>
        <main className="flex flex-col w-full overflow-y-auto justify-between flex-wrap items-center">
          {cargando ? (
            <div>cargando...</div>
          ) : representantes.length === 0 ? (
            <div>No hay representantes</div>
          ) : (
            representantes.map((representante) => (
              <div
                className="flex items-center justify-between gap-4 w-full odd:bg-slate-200 even:bg-slate-100 first:rounded-t-lg last:rounded-b-lg p-2"
                key={representante.id}
              >
                {" "}
                <div className="flex gap-2 items-center">
                  <span className="">
                    <strong>Alumno:</strong>{" "}
                    {representante.apellidos + " " + representante.nombres}
                  </span>
                  <span className="">
                    <strong>Cedula:</strong> {representante.documentoIdentidad}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className="text-orange-500 hover:text-orange-600  transition-all  w-full rounded-md"
                    onClick={() => handleVerAlumnnos(representante.id)}
                  >
                    Alumnos
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-600  transition-all  w-full rounded-md"
                    onClick={() => handleModificarRepresentante(representante)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600  transition-all  w-full rounded-md"
                    onClick={() =>
                      handleEliminarAlumno(
                        representante.id,
                        representante.usuarioId
                      )
                    }
                  >
                    Eliminar
                  </button>
                </div>{" "}
              </div>
            ))
          )}
        </main>
      </section>
    </>
  );
}
