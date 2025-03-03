import { checkAdminAccess } from "./config";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";

export default async function AdminDashboardPage() {
  await checkAdminAccess();
  
  return <AdminDashboard />;
} 