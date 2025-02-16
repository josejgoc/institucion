import { Estudiante, Grado, Seccion } from "@prisma/client";
import { useEffect, useState } from "react";
import { eliminarAlumnoDeRepresentante, obtenerAlumnos } from "../action";
import ModalAgregarAlumnos from "./agregarAlumnos";

interface Alumno extends Estudiante {
  grado?: Grado;
  seccion?: Seccion;
  relacionId?: number;
}

export default function ModalVerAlumnos({
  id,
  show,
  setShow,
}: {
  id: number | null;
  show: boolean;
  setShow: (alumno: number | null) => void;
}) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAgregarAlumno, setModalAgregarAlumno] = useState(false);

  useEffect(() => {
    if (id === null) {
      return;
    }

    obtenerAlumnos(id)
      .then((res) => {
        if (res.error) {
          alert(res.error);
          setShow(null);
          return;
        }
        setAlumnos(res.data ?? []);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  }, [id, setShow]);

  const handleAgregarAlumno = () => setModalAgregarAlumno(!modalAgregarAlumno);

  return (
    show && (
      <>
        <ModalAgregarAlumnos
          representanteId={id}
          show={modalAgregarAlumno}
          setShow={handleAgregarAlumno}
        />
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3 min-w-64 w-full max-w-sm">
            <header className="flex gap-4 items-center justify-between ">
              <h1 className="text-xl font-bold">Alumnos</h1>
              <div className="flex gap-2">
                <button
                  className="text-green-500 active:text-green-600 transition-all duration-100 text-sm"
                  onClick={handleAgregarAlumno}
                >
                  Agregar
                </button>
                <button
                  className="text-red-500 active:text-red-600 transition-all duration-100 text-sm"
                  onClick={() => setShow(null)}
                >
                  Cerrar
                </button>
              </div>
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
                {alumnos.length === 0 ? (
                  <p>No hay alumnos registrados al representante</p>
                ) : (
                  alumnos.map((alumno) => (
                    <div
                      key={alumno.id}
                      className="flex gap-4 justify-between items-center odd:bg-slate-200 even:bg-slate-50 p-2 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div>
                        <h2>{alumno.apellidos + " " + alumno.nombres}</h2>

                        <p className="text-sm">
                          {alumno.grado?.nombre === undefined &&
                          alumno.seccion?.nombre === undefined
                            ? "Sin seccion"
                            : alumno.grado?.nombre +
                              " " +
                              alumno.seccion?.nombre}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 active:text-red-600 transition-all duration-100 text-sm"
                        onClick={async () => {
                          await eliminarAlumnoDeRepresentante(
                            alumno.relacionId as number,
                            id as number
                          )
                            .then((res) => {
                              if (res.error) {
                                alert(res.error);
                                return;
                              }
                              setAlumnos(res.data ?? []);
                            })
                            .catch((err) => {
                              console.error(err);
                              alert("Ocurrio un error");
                            });
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
            <button
              type="button"
              className="
              text-blue-500 hover:text-blue-600  transition-all w-max mx-auto rounded-md"
              onClick={() => {
                obtenerAlumnos(id as number)
                  .then((res) => {
                    if (res.error) {
                      alert(res.error);
                      setShow(null);
                      return;
                    }
                    setAlumnos(res.data ?? []);
                    setCargando(false);
                  })
                  .catch((err) => {
                    console.error(err);
                    setCargando(false);
                  });
              }}
            >
              Recargar
            </button>
          </div>
        </div>
      </>
    )
  );
}
