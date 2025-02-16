import { getSession } from "@/libs/session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session?.user.datos.tipo !== "admin")
    return <div>Acceso Restringido</div>;

  return children;
}
