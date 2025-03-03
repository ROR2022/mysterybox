import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function checkAdminAccess() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!adminEmails.includes(session.user.email)) {
    redirect("/dashboard");
  }

  return session;
} 