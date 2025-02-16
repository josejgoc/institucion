import { Representante } from "@prisma/client";
import { crearRepresentante, dataCrearRepresentanteProps } from "../action";

export default function ModalCrearRepresentante({
  show,
  setShow,
  action,
}: {
  show: boolean;
  setShow: () => void;
  action: (res: Representante[]) => void;
}) {
  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3 w-full max-h-full overflow-y-auto max-w-md">
          <h2 className="text-xl font-bold">Crear Representante</h2>
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
                telefono,
                direccion,
                ocupacion,
                email,
                password,
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

              if (!telefono.value || !telefono.value.trim()) {
                alert("El telefono es requerido");
                return;
              }

              if (!direccion.value || !direccion.value.trim()) {
                alert("La direccion es requerida");
                return;
              }

              if (!ocupacion.value || !ocupacion.value.trim()) {
                alert("La ocupacion es requerida");
                return;
              }

              if (!email.value || !email.value.trim()) {
                alert("El email es requerido");
                return;
              }

              if (!password.value || !password.value.trim()) {
                alert("La contraseña es requerida");
                return;
              }

              const data: dataCrearRepresentanteProps = {
                documentoIdentidad: tipo_documento.value + documento.value,
                nombres: nombres.value,
                apellidos: apellidos.value,
                genero: genero.value,
                fechaNacimiento: new Date(fecha_nacimiento.value),
                telefono: telefono.value,
                direccion: direccion.value,
                ocupacion: ocupacion.value,
                email: email.value,
                password: password.value,
              };

              crearRepresentante(data)
                .then(({ data, error }) => {
                  if (error) {
                    alert(error);
                  } else {
                    target.reset();
                    action(data as Representante[]);
                    setShow();
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
            >
              <option value="">Tipo de documento</option>
              <option value="V">Venezolano</option>
              <option value="E">Extranjero</option>
            </select>
            <input
              type="text"
              name="documento"
              placeholder="Cedula"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <div className="w-full bg-slate-200 h-0.5 rounded" />
            <h3>Informacion basica</h3>
            <input
              type="text"
              name="nombres"
              placeholder="Nombres"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <input
              type="date"
              name="fecha_nacimiento"
              placeholder="Fecha de nacimiento"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <select
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              name="genero"
            >
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>

            <div className="w-full bg-slate-200 h-0.5 rounded" />

            <h3>Informacion de adicional</h3>

            <input
              type="tel"
              name="telefono"
              placeholder="Telefono"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <textarea
              name="direccion"
              placeholder="Direccion"
              rows={3}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full resize-none"
            />

            <input
              type="text"
              name="ocupacion"
              placeholder="Ocupacion"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <div className="w-full bg-slate-200 h-0.5 rounded" />
            <h3>Informacion de acceso</h3>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <input
              type="password"
              name="password"
              placeholder="Clave"
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <button
              type="submit"
              className="bg-green-500 active:bg-green-600 transition-all duration-100 py-1 px-2 w-full flex items-center justify-center rounded-md text-white shadow active:shadow-none"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShow()}
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
