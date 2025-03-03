import { getContentById } from '@/libs/utils/content';
import ContentForm from '@/components/admin/content/ContentForm';
import { notFound } from 'next/navigation';

interface ContentEditPageProps {
  params: {
    id: string;
  };
}

export default async function ContentEditPage({ params }: ContentEditPageProps) {
  const { id } = await params;
  const content = id !== 'new' ? await getContentById(id) : null;

  if (id !== 'new' && !content) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {content ? 'Editar Contenido' : 'Crear Nuevo Contenido'}
      </h1>
      <ContentForm initialContent={content} />
    </div>
  );
} 