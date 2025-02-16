import { Estudiante } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  agregarEstudianteAlRepresentante,
  obtenerAlumnosDisponibles,
} from "../action";

export default function ModalAgregarAlumnos({
  representanteId,
  show,
  setShow,
}: {
  representanteId: number | null;
  show: boolean;
  setShow: () => void;
}) {
  const [alumnos, setAlumnos] = useState<Estudiante[]>([]);
  useEffect(() => {
    if (representanteId === null) {
      return;
    }

    obtenerAlumnosDisponibles(representanteId)
      .then((res) => {
        if (res.error) {
          alert(res.error);
          setShow();
          return;
        }
        setAlumnos(res.data ?? []);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setAlumnos([]);
      });
  }, [representanteId, setShow]);

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex flex-col  gap-2 p-4 max-w-md w-full bg-white shadow rounded-lg overflow-y-auto">
          <h2 className="text-xl font-bold">Agregar alumnos</h2>
          <div>
            {alumnos.length === 0 ? (
              <p>No hay alumnos disponibles</p>
            ) : (
              alumnos.map((alumno) => (
                <div
                  key={alumno.id}
                  className="flex gap-4 flex-wrap items-center justify-between odd:bg-slate-200 even:bg-slate-50 p-2 first:rounded-t-md last:rounded-b-md"
                >
                  <p className="font-medium">
                    {alumno.apellidos + " " + alumno.nombres} <br />{" "}
                    <span className="text-xs">{alumno.documentoIdentidad}</span>
                  </p>
                  <form
                    className="flex gap-2 w-max"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const target = e.target as HTMLFormElement;
                      const parentesco = target.parentesco.value;
                      const alumnoId = alumno.id;

                      target.ariaDisabled = "true";

                      if (!parentesco || !parentesco.trim()) {
                        alert("El parentesco es requerido");
                        return;
                      }

                      if (!alumnoId) {
                        alert("El alumno es requerido");
                        return;
                      }

                      if (!representanteId) {
                        alert("El representante es requerido");
                        return;
                      }

                      agregarEstudianteAlRepresentante({
                        representanteId,
                        estudianteId: alumnoId,
                        parentesco,
                      })
                        .then((res) => {
                          if (res.error) {
                            alert(res.error);
                            setShow();
                            return;
                          }
                          setAlumnos(res.data ?? []);
                          console.log(res.data);
                        })
                        .catch((err) => {
                          console.error(err);
                          setAlumnos([]);
                        });

                      target.ariaDisabled = "false";
                    }}
                  >
                    <select
                      name="parentesco"
                      id="parentesco"
                      className="px-2 py-1 border border-slate-200 bg-slate-100 rounded-lg outline-blue-600"
                    >
                      <option value="">parentesco</option>
                      <option value="padre">padre</option>
                      <option value="madre">madre</option>
                      <option value="hermano">hermano</option>
                      <option value="hermana">hermana</option>
                      <option value="abuelo">abuelo</option>
                      <option value="abuela">abuela</option>
                      <option value="tio">tio</option>
                      <option value="tia">tia</option>
                      <option value="otro">otro</option>
                    </select>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-100 px-2 py-1 rounded-md">
                      agregar
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            className="text-red-500 active:text-red-600 transition-all duration-100 text-sm mx-auto w-max"
            onClick={() => setShow()}
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  );
}
