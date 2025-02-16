"use client";

import { useEffect, useState } from "react";
import { Alumno, eliminarAlumno, obtenerAlumnos } from "./action";
import ModalCrearAlumno from "./modales/crearAlumno";
import ModalModificarAlumno from "./modales/modificarAlumno";
import ModalVerRepresentantes from "./modales/verRepresentantes";

export default function AlumnosAdmin() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [modalCrearAlumno, setModalCrearAlumno] = useState(false);
  const [modalModificarAlumno, setModalModificarAlumno] = useState(false);
  const [modalRepresentantes, setModalRepresentantes] = useState(false);
  const [infoModalRepresentantes, setInfoModalRepresentantes] = useState<
    number | null
  >(null);
  const [infoModalModificarAlumno, setInfoModalModificarAlumno] =
    useState<Alumno | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerAlumnos()
      .then((res) => {
        console.log(res);
        setAlumnos(res);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  const handleCrearAlumno = () => setModalCrearAlumno(!modalCrearAlumno);
  const handleModificarAlumno = (alumno: Alumno | null) => {
    if (alumno === null) {
      setModalModificarAlumno(false);
    } else {
      setModalModificarAlumno(true);
    }
    setInfoModalModificarAlumno(alumno);
  };

  const handleVerRepresentantes = (alumno: number | null) => {
    if (alumno === null) {
      setModalRepresentantes(false);
    } else {
      setModalRepresentantes(true);
    }
    setInfoModalRepresentantes(alumno as number);
  };

  const handleEliminarAlumno = async (id: number) => {
    await eliminarAlumno(id)
      .then(({ data, error }) => {
        if (error) {
          alert(error);
        } else {
          setAlumnos((data as Alumno[]) ?? []);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Ocurrió un error");
      });
  };

  return (
    <>
      <ModalCrearAlumno
        show={modalCrearAlumno}
        setShow={handleCrearAlumno}
        action={setAlumnos}
      />
      <ModalModificarAlumno
        show={modalModificarAlumno}
        setShow={handleModificarAlumno}
        alumno={infoModalModificarAlumno as Alumno}
        action={setAlumnos}
      />

      <ModalVerRepresentantes
        id={infoModalRepresentantes as number}
        show={modalRepresentantes}
        setShow={handleVerRepresentantes}
      />

      <section className="flex flex-col  w-full h-full gap-4 flex-1">
        <header className="flex w-full gap-4 justify-between flex-wrap items-center">
          <h1 className="text-xl font-bold">Listado de alumnos</h1>

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
          ) : (
            alumnos.map((alumno) => (
              <div
                className="flex items-center justify-between gap-4 w-full odd:bg-slate-200 even:bg-slate-100 first:rounded-t-lg last:rounded-b-lg p-2"
                key={alumno.id}
              >
                {" "}
                <div className="flex gap-2 items-center">
                  <span className="">
                    <strong>Alumno:</strong>{" "}
                    {alumno.apellidos + " " + alumno.nombres}
                  </span>
                  <span className="">
                    <strong>Cedula:</strong> {alumno.documentoIdentidad}
                  </span>
                  {alumno.grado && <span>Grado: {alumno.grado.nombre}</span>}
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className="text-orange-500 hover:text-orange-600  transition-all  w-full rounded-md"
                    onClick={() => handleVerRepresentantes(alumno.id)}
                  >
                    Representantes
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-600  transition-all  w-full rounded-md"
                    onClick={() => handleModificarAlumno(alumno)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600  transition-all  w-full rounded-md"
                    onClick={() => handleEliminarAlumno(alumno.id)}
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
