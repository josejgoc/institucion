"use client";
import { redirect } from "next/navigation";
import { login } from "../action";

export default function LoginForm() {
  return (
    <div className="flex bg-white shadow-md rounded-md p-4 flex-col gap-4 max-w-sm w-full">
      <h1 className="font-bold font-white">Formulario de ingreso</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const signIn = await login(formData);
          if (signIn) {
            redirect("/");
          } else {
            alert("Credenciales incorrectas");
          }
        }}
        className="flex flex-col gap-2"
      >
        <label htmlFor="email" className="font-semibold text-sm">
          Email:
        </label>
        <input
          type="email"
          name="correo"
          id="email"
          required
          className="p-2 border-slate-200 border rounded-md outline-none"
        />
        <label htmlFor="password" className="font-semibold text-sm">
          Password:
        </label>
        <input
          type="password"
          name="clave"
          id="password"
          required
          className="p-2 border-slate-200 border rounded-md outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 py-2 px-4 text-white rounded-md shadow-md active:shadow-none transition-all duration-300"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
