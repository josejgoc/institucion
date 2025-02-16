import { getSession } from "@/libs/session";
import { redirect } from "next/navigation";
import AsideNavBar from "../components/ui/asideNavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-wrap items-center min-h-screen w-full h-full p-4 gap-4 ">
      <div className=" flex items-center justify-center h-full">
        <AsideNavBar />
      </div>
      <main className="flex-1 overflow-y-auto max-h-full h-full shadow rounded-lg bg-white p-4">
        {children}
      </main>
    </div>
  );
}
