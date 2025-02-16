"use client";
import { getSession, logout } from "@/libs/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

function LogOutButton() {
  return (
    <button
      onClick={async () => {
        await logout();
        redirect("/login");
      }}
      className="bg-red-500 hover:bg-red-600 text-white transition-all px-2 py-2 w-full rounded-md"
    >
      Desconectar
    </button>
  );
}

export default function AsideNavBar() {
  const [tipoUsuario, setTipoUsuario] = useState("representante");

  useEffect(() => {
    verifyType();
  }, []);

  const verifyType = async () => {
    const session = await getSession();

    if (session) setTipoUsuario(session.user.datos.tipo);
  };

  return (
    <aside className="bg-white shadow rounded-lg  text-black flex flex-col justify-between items-center p-4 max-w-xs top-4 left-4 sticky">
      <h1 className="w-full flex flex-col  text-xl font-bold p-2">
        <Image
          src="/insignia.png"
          alt="logo"
          className="object-contain size-32"
          width={128}
          height={128}
          sizes="32rem"
        />
      </h1>
      <nav className="flex flex-col w-full gap-1 text-sm">
        <Link
          href="/"
          className="hover:bg-blue-500 hover:text-white transition-all px-2 py-2 w-full rounded-md"
        >
          Inicio
        </Link>

        <Link
          href="/representantes"
          className="hover:bg-blue-500 hover:text-white transition-all px-2 py-2 w-full rounded-md"
        >
          Representantes
        </Link>
        <Link
          href="/alumnos"
          className="hover:bg-blue-500 hover:text-white transition-all px-2 py-2 w-full rounded-md"
        >
          Alumnos
        </Link>
        {tipoUsuario === "admin" && (
          <>
            {" "}
            <Link
              href="/docentes"
              className="hover:bg-blue-500 hover:text-white transition-all px-2 py-2 w-full rounded-md"
            >
              Docentes
            </Link>
            <Link
              href="/secciones"
              className="hover:bg-blue-500 hover:text-white transition-all px-2 py-2 w-full rounded-md"
            >
              Secciones
            </Link>
            <Link
              href="/grados"
              className="hover:bg-blue-500 hover:text-white transition-all px-2 py-2 w-full rounded-md"
            >
              Grados
            </Link>
          </>
        )}
        <Link
          href="/documentos"
          className="hover:bg-blue-500 hover:text-white transition-all px-2 py-2 w-full rounded-md"
        >
          Documentos
        </Link>
        <LogOutButton />
      </nav>
    </aside>
  );
}
