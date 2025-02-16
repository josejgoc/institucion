export type Seccion = {
  id: number;
  nombre: string;
  gradoId: number;
  grado: {
    id: number;
    nombre: string;
  };
};
