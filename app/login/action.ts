"use server";

import db from "@/libs/db";
import { encrypt } from "@/libs/session";
import { Usuario } from "@prisma/client";
import { cookies } from "next/headers";

export interface SessionUserProps {
  correo: Usuario["correo"];
  id: Usuario["id"];
  datos: Usuario;
}

export interface SessionProps {
  user: SessionUserProps;
  expires: Date;
}

export async function login(formData: FormData) {
  // create verification logic with prisma here

  if (!formData.get("correo") || !formData.get("clave")) return false;

  const usuario = await db.usuario.findUnique({
    where: {
      correo: formData.get("correo") as string,
      clave: formData.get("clave") as string,
    },
    select: {
      correo: true,
      id: true,
      tipo: true,
      profesor: true,
      admin: true,
      representante: true,
    },
  });

  if (!usuario) return false;

  const tipo = usuario.tipo as string;

  const sessionUser = {
    correo: usuario.correo,
    id: usuario.id,
    datos: usuario,
  };

  const secret =
    tipo === "profesor" ? "tech" : tipo === "admin" ? "admin" : "parent";

  const expires = new Date(Date.now() + 30000 * 1000);
  const session = await encrypt({ user: sessionUser, expires }, secret);

  (await cookies()).set("session", session, { expires, httpOnly: true });

  return true;
}
