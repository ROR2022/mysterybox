import { getAllContent, toggleContentStatus, deleteContent } from '@/libs/utils/content';
import { InterestCategory, BoxContentType } from '@/libs/types/user';
import ContentTable from '@/components/admin/content/ContentTable';
import ContentFilters from '@/components/admin/content/ContentFilters';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function toggleStatus(id: string) {
  'use server';
  await toggleContentStatus(id);
  revalidatePath('/admin/content');
}

async function deleteItem(id: string) {
  'use server';
  await deleteContent(id);
  revalidatePath('/admin/content');
}

export default async function ContentManagementPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = params.search?.toString();
  const category = params.category as InterestCategory | undefined;
  const type = params.type as BoxContentType | undefined;
  const active = params.active ? params.active === 'true' : undefined;

  const { contents, total, pages } = await getAllContent(
    page,
    limit,
    search,
    category,
    type,
    active
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Contenido</h1>
        <Link
          href="/admin/content/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Crear Nuevo Contenido
        </Link>
      </div>

      <ContentFilters
        currentSearch={search}
        currentCategory={category}
        currentType={type}
        currentActive={active}
      />

      <ContentTable
        contents={contents}
        currentPage={page}
        totalPages={pages}
        totalItems={total}
        onStatusToggle={toggleStatus}
        onDelete={deleteItem}
      />
    </div>
  );
} 