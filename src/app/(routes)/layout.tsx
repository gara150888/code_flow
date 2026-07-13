import Sidebar from "./_components/Sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) return redirect("/login");

  return <Sidebar>{children}</Sidebar>;
}
