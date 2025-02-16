import { Estudiante } from "@prisma/client";
import { Alumno, crearAlumno, dataCrearAlumnoProps } from "../action";

export default function ModalModificarAlumno({
  show,
  setShow,
  alumno,
  action,
}: {
  show: boolean;
  alumno: Alumno;
  setShow: (alumno: Alumno | null) => void;
  action: (res: Alumno[]) => void;
}) {
  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3 w-full max-h-full overflow-y-auto max-w-md">
          <h2 className="text-xl font-bold">Modificar alumno</h2>
          <form
            className="flex items-center gap-2 flex-col w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as HTMLFormElement;
              const {
                tipo_documento,
                documento,
                nombres,
                apellidos,
                genero,
                fecha_nacimiento,
                tipo_parto,
                duracion_embarazo,
                asmatico,
                sufre_convulsiones,
                toma_medicamentos,
                presenta_informe,
                tuvo_intervencion,
                presenta_inpedimento,
                razon_impedimento,
                control_medico,
              } = target;

              target.ariaDisabled = "true";

              if (tipo_documento.value === "") {
                alert("Tipo de documento es requerido");
                return;
              }

              if (documento.value === "") {
                alert("Documento es requerido");
                return;
              }

              if (!nombres.value || !nombres.value.trim()) {
                alert("El nombre es requerido");
                return;
              }

              if (!apellidos.value || !apellidos.value.trim()) {
                alert("El apellidos es requerido");
                return;
              }

              if (!genero.value || !genero.value.trim()) {
                alert("El genero es requerido");
                return;
              }

              if (!fecha_nacimiento.value) {
                alert("La fecha de nacimiento es requerida");
                return;
              }
              if (!tipo_parto.value && !tipo_parto.value.trim()) {
                alert("El tipo de parto es requerido");
                return;
              }

              if (!duracion_embarazo.value) {
                alert("La duracion del embarazo es requerida");
                return;
              }
              if (!asmatico.value && !asmatico.value.trim()) {
                alert("Es asmatico es requerido");
                return;
              }
              if (
                !sufre_convulsiones.value &&
                !sufre_convulsiones.value.trim()
              ) {
                alert("Sufre convulsiones es requerido");
                return;
              }
              if (!toma_medicamentos.value && !toma_medicamentos.value.trim()) {
                alert("Toma medicamentos es requerido");
                return;
              }
              if (!presenta_informe.value && !presenta_informe.value.trim()) {
                alert("Presenta informe medico es requerido");
                return;
              }
              if (!tuvo_intervencion.value && !tuvo_intervencion.value.trim()) {
                alert("Tuvo alguna intervencion quirúrgica es requerido");
                return;
              }
              if (
                !presenta_inpedimento.value &&
                !presenta_inpedimento.value.trim()
              ) {
                alert("Presenta inpedimento fisico es requerido");
                return;
              }
              if (
                Boolean(Number(presenta_inpedimento.value)) &&
                !razon_impedimento.value &&
                !razon_impedimento.value.trim()
              ) {
                alert("Razon del impedimento fisico es requerido");
                return;
              }

              if (!control_medico.value && !control_medico.value.trim()) {
                alert("Saber si está en control medico es requerido");
                return;
              }

              const data: dataCrearAlumnoProps = {
                documentoIdentidad: tipo_documento.value + documento.value,
                nombres: nombres.value,
                apellidos: apellidos.value,
                genero: genero.value,
                fechaNacimiento: fecha_nacimiento.value,
                salud: {
                  parto_normal: Boolean(Number(tipo_parto.value)),
                  duracion_embarazo: duracion_embarazo.value,
                  asmatico: Boolean(Number(asmatico.value)),
                  convulsiones: Boolean(Number(sufre_convulsiones.value)),
                  medicamentos: Boolean(Number(toma_medicamentos.value)),
                  infome_medico: Boolean(Number(presenta_informe.value)),
                  intervencion_quirurgica: Boolean(
                    Number(tuvo_intervencion.value)
                  ),
                  impedimento_fisico: Boolean(
                    Number(presenta_inpedimento.value)
                  ),
                  impedimento_fisico_reason: razon_impedimento.value,
                  control_medico: Boolean(Number(control_medico.value)),
                },
              };

              crearAlumno(data)
                .then(({ data, error }) => {
                  if (error) {
                    alert(error);
                  } else {
                    target.reset();
                    action(data as Estudiante[]);
                    setShow(null);
                  }
                })
                .catch((error) => {
                  console.error(error);
                  alert("Ocurrió un error");
                });
            }}
          >
            <h3>Documento de identidad</h3>
            <select
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              name="tipo_documento"
              defaultValue={alumno?.documentoIdentidad?.charAt(0)}
            >
              <option value="">Tipo de documento</option>
              <option value="V">Venezolano</option>
              <option value="E">Extranjero</option>
              <option value="C">Documento Estudiantil</option>
            </select>
            <input
              type="text"
              name="documento"
              placeholder="Cedula"
              defaultValue={alumno?.documentoIdentidad?.slice(1)}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <div className="w-full bg-slate-200 h-0.5 rounded" />
            <h3>Informacion basica</h3>
            <input
              type="text"
              name="nombres"
              defaultValue={alumno?.nombres}
              placeholder="Nombres"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <input
              type="text"
              name="apellidos"
              defaultValue={alumno?.apellidos}
              placeholder="Apellidos"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <input
              type="date"
              name="fecha_nacimiento"
              defaultValue={alumno?.fechaNacimiento.toDateString()}
              placeholder="Fecha de nacimiento"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <select
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              name="genero"
              defaultValue={alumno?.genero}
            >
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>

            <div className="w-full bg-slate-200 h-0.5 rounded" />
            <h3>Informacion de medica</h3>

            <select
              name="tipo_parto"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              defaultValue={alumno?.salud?.parto_normal ? "1" : "0"}
            >
              <option value="">Seleccione</option>
              <option value="1">Normal</option>
              <option value="0">Aborto</option>
            </select>
            <input
              type="number"
              name="duracion_embarazo"
              placeholder="Duracion del embarazo (meses)"
              defaultValue={alumno?.salud?.duracion_embarazo}
              min={0}
              max={12}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <div className="w-full">
              <span>Es asmatico?</span>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="asmatico"
                defaultValue={alumno?.salud?.asmatico ? "1" : "0"}
              >
                <option value="">Seleccione</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="w-full">
              <span>Sufre convulsiones?</span>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="sufre_convulsiones"
                defaultValue={alumno?.salud?.convulsiones ? "1" : "0"}
              >
                <option value="">Seleccione</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="w-full">
              <span>Toma medicamentos?</span>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="toma_medicamentos"
                defaultValue={alumno?.salud?.medicamentos ? "1" : "0"}
              >
                <option value="">Seleccione</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="w-full">
              <span>Esta en control medico?</span>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="control_medico"
                defaultValue={alumno?.salud?.control_medico ? "1" : "0"}
              >
                <option value="">Seleccione</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="w-full">
              <span>Presenta informe medico?</span>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="presenta_informe"
                defaultValue={alumno?.salud?.infome_medico ? "1" : "0"}
              >
                <option value="">Seleccione</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="w-full">
              <span>Tuvo alguna intervencion quirúrgica?</span>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="tuvo_intervencion"
                defaultValue={
                  alumno?.salud?.intervencion_quirurgica ? "1" : "0"
                }
              >
                <option value="">Seleccione</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="w-full">
              <span>Presenta inpedimento fisico?</span>
              <select
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
                name="presenta_inpedimento"
                defaultValue={alumno?.salud?.impedimento_fisico ? "1" : "0"}
              >
                <option value="">Seleccione</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="w-full">
              <span>Razon del impedimento fisico?</span>
              <input
                type="text"
                name="razon_impedimento"
                defaultValue={alumno?.salud?.impedimento_fisico_reason}
                className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 active:bg-green-600 transition-all duration-100 py-1 px-2 w-full flex items-center justify-center rounded-md text-white shadow-md active:shadow-none"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShow(null)}
              className="text-red-500 mx-auto  active:text-red-600 transition-all duration-100 py-1 px-2 flex items-center justify-center rounded-md w-max  "
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    )
  );
}
