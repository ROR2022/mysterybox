import { checkAdminAccess } from '@/app/admin/config';
import UserTable from '@/components/admin/users/UserTable';
import UserFilters from '@/components/admin/users/UserFilters';

export default async function UsersManagementPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  await checkAdminAccess();

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search?.toString();
  const subscription = params.subscription?.toString();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      </div>

      <UserFilters
        currentSearch={search}
        currentSubscription={subscription}
      />

      <UserTable
        currentPage={page}
        searchParams={params}
      />
    </div>
  );
} 