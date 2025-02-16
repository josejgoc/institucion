import Documentos from "@/libs/documentos";

export default function DocumentosPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Documentos Descargables</h1>
      <div>
        {Documentos.map((documento) => (
          <div
            key={documento.id}
            className="odd:bg-gray-200 even:bg-gray-100 p-2 flex justify-between first:rounded-t-md last:rounded-b-md"
          >
            <span className="font-medium">{documento.nombre}</span>{" "}
            <a
              href={documento.ruta}
              className="text-blue-500 hover:text-blue-600"
              download={true}
            >
              Descargar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
