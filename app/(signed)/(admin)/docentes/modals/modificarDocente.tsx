"use client";

import { Profesor } from "@prisma/client";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { modificarDocente } from "../actions";

export default function ModalCrearDocente({
  show,
  setShow,
  action,
  profesor,
}: {
  show: boolean;
  setShow: (res: Profesor | null) => void;
  action: (res: Profesor[]) => void;
  profesor: Profesor | null;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(
    profesor?.ruta_imagen ?? null
  );

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3 w-full max-h-full overflow-y-auto max-w-md">
          <h2 className="text-xl font-bold">Crear docente</h2>
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
                direccion,
                telefono,
                nivel_academico,
                titulo,
                imagen,
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

              if (!direccion.value || !direccion.value.trim()) {
                alert("La direccion es requerida");
                return;
              }

              if (!telefono.value || !telefono.value.trim()) {
                alert("El telefono es requerido");
                return;
              }

              if (!nivel_academico.value || !nivel_academico.value.trim()) {
                alert("El nivel academico es requerido");
                return;
              }

              if (!titulo.value || !titulo.value.trim()) {
                alert("El titulo es requerido");
                return;
              }

              const data = {
                id: profesor?.id as number,
                documentoIdentidad: tipo_documento.value + documento.value,
                nombre: apellidos.value + " " + nombres.value,
                genero: genero.value,
                fechaNacimiento: fecha_nacimiento.value,
                direccion: direccion.value,
                telefono: telefono.value,
                nivelAcademico: nivel_academico.value,
                titulo: titulo.value,
                imagen: imagen.files[0] ?? null,
              };

              modificarDocente(data)
                .then(({ data, error }) => {
                  if (error) {
                    alert(error);
                  } else {
                    target.reset();
                    action(data as Profesor[]);
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
              id="tipo_documento"
              defaultValue={profesor?.documentoIdentidad.slice(0, 1)}
            >
              <option value="">Tipo de documento</option>
              <option value="V">Venezolano</option>
              <option value="E">Extranjero</option>
            </select>
            <input
              type="text"
              name="documento"
              placeholder="Cedula"
              defaultValue={profesor?.documentoIdentidad.slice(1)}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <div className="w-full bg-slate-200 h-0.5 rounded" />
            <h3>Foto de perfil</h3>

            <label
              htmlFor="imagen"
              className="border border-slate-200 rounded-md cursor-pointer w-full"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Imagen"
                  className="w-full h-full aspect-[10/11] object-cover rounded-md"
                />
              ) : (
                <div className="aspect-[10/11] min-w-full h-full bg-slate-100 flex items-center justify-center rounded-md p-4">
                  <ImageIcon className="size-12" />
                </div>
              )}
            </label>

            <input
              type="file"
              name="imagen"
              id="imagen"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(e.target.files?.[0] as Blob);
                  setPreviewImage(url);
                }
              }}
            />

            <div className="w-full bg-slate-200 h-0.5 rounded" />
            <h3>Informacion Basica</h3>

            <input
              type="text"
              name="nombres"
              placeholder="Nombres"
              defaultValue={profesor?.nombre.split(" ")[0]}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              defaultValue={profesor?.nombre.split(" ")[1]}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <input
              type="date"
              name="fecha_nacimiento"
              placeholder="Fecha de nacimiento"
              defaultValue={profesor?.fechaNacimiento
                .toISOString()
                .substring(0, 10)}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />
            <select
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
              name="genero"
              defaultValue={profesor?.genero}
            >
              <option value="">Sexo</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>

            <div className="w-full bg-slate-200 h-0.5 rounded" />
            <h3>Informacion adicional</h3>

            <textarea
              name="direccion"
              placeholder="Direccion"
              defaultValue={profesor?.direccion}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <input
              type="text"
              name="telefono"
              placeholder="Telefono"
              defaultValue={profesor?.telefono}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <input
              type="text"
              name="nivel_academico"
              placeholder="Nivel academico"
              defaultValue={profesor?.nivelAcademico}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

            <input
              type="text"
              name="titulo"
              placeholder="Titulo"
              defaultValue={profesor?.titulo}
              className="bg-slate-100 border-slate-200 border rounded-md p-1 outline-none w-full"
            />

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
