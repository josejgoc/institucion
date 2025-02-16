"use server";
import db from "@/libs/db";
import { Profesor } from "@prisma/client";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function uploadImage(
  file: File,
  folderName: string
): Promise<{ path?: string; error?: string }> {
  if (!file) {
    return { error: "No se subio ningun archivo" };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar un nombre de archivo único
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    // Ruta a la carpeta public
    const publicDirectory = join(process.cwd(), "public", folderName);
    const filePath = join(publicDirectory, filename);

    await mkdir(publicDirectory, { recursive: true });
    await writeFile(filePath, buffer);

    return { path: `/${folderName}/${filename}` }; // URL de la imagen
  } catch (error) {
    console.error(error);
    return { error: "No se pudo subir la imagen" };
  }
}

export async function obtenerDocentes() {
  let docentes: Profesor[] = [];
  const query = await db.profesor.findMany();

  if (query) {
    docentes = query;
  }

  return docentes;
}

export async function crearDocente(data: {
  nombre: string;
  titulo: string;
  nivelAcademico: string;
  fechaNacimiento: Date;
  documentoIdentidad: string;
  telefono: string;
  genero: string;
  direccion: string;
  correo: string;
  clave: string;
  imagen: File;
}): Promise<{ data?: Profesor[]; error?: string }> {
  if (
    Boolean(
      await db.usuario.count({
        where: {
          correo: data.correo,
        },
      })
    )
  ) {
    return { error: "El correo ya se encuentra afiliado" };
  }

  const upload = await uploadImage(data.imagen, "profesores");

  if (upload?.error) {
    return { error: "No se pudo subir la imagen" };
  }

  const createUser = await db.usuario.create({
    data: {
      correo: data.correo,
      clave: data.clave,
      tipo: "profesor",
    },
  });

  const profesor: Omit<Profesor, "id" | "gradoId" | "seccionId"> = {
    nombre: data.nombre,
    documentoIdentidad: data.documentoIdentidad,
    nivelAcademico: data.nivelAcademico,
    titulo: data.titulo,
    direccion: data.direccion,
    fechaNacimiento: new Date(data.fechaNacimiento),
    telefono: data.telefono,
    genero: data.genero,
    usuarioId: createUser?.id,
    ruta_imagen: upload?.path as string,
  };

  console.log(profesor);

  const crearProfesor = await db.profesor.create({
    data: profesor,
  });

  if (!crearProfesor) {
    return { error: "No se pudo agregar al profesor" };
  } else {
    return { data: await db.profesor.findMany() };
  }
}

interface dataModificarProps
  extends Omit<
    Profesor,
    "id" | "gradoId" | "seccionId" | "usuarioId" | "ruta_imagen"
  > {
  ruta_imagen?: string;
}

export async function modificarDocente(data: {
  id: number;
  nombre: string;
  titulo: string;
  nivelAcademico: string;
  fechaNacimiento: Date;
  documentoIdentidad: string;
  telefono: string;
  genero: string;
  direccion: string;
  imagen: File | null | string;
}) {
  if (data.imagen !== null && typeof data.imagen !== "string") {
    const upload = await uploadImage(data.imagen, "profesores");
    if (upload?.error) {
      return { error: "No se pudo subir la imagen" };
    }
    data.imagen = upload?.path as string;
  }

  const profesor: dataModificarProps = {
    nombre: data.nombre,
    documentoIdentidad: data.documentoIdentidad,
    nivelAcademico: data.nivelAcademico,
    titulo: data.titulo,
    direccion: data.direccion,
    fechaNacimiento: new Date(data.fechaNacimiento),
    telefono: data.telefono,
    genero: data.genero,
  };

  if (typeof data.imagen === "string") profesor.ruta_imagen = data.imagen;

  console.log(profesor);

  const query = await db.profesor.update({
    where: { id: data.id },
    data: profesor,
  });

  if (!query) {
    return { error: "No se pudo modificar al docente" };
  } else {
    return { data: await db.profesor.findMany() };
  }
}

export async function eliminarDocente(id: number) {
  const query = await db.profesor.delete({ where: { id } });

  if (!query) {
    return { error: "No se pudo eliminar al docente" };
  } else {
    return await db.profesor.findMany();
  }
}
