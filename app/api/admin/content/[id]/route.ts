import { NextRequest, NextResponse } from 'next/server';
import {
  getContentById,
  updateContent,
  deleteContent,
  toggleContentStatus,
} from '@/libs/utils/content';
import { checkAdminAccess } from '@/app/admin/config';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAdminAccess();

    const content = await getContentById(params.id);
    if (!content) {
      return NextResponse.json(
        { error: 'Contenido no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error getting content:', error);
    return NextResponse.json(
      { error: 'Error al obtener el contenido' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAdminAccess();

    const contentData = await request.json();
    const content = await updateContent(params.id, contentData);

    if (!content) {
      return NextResponse.json(
        { error: 'Error al actualizar el contenido' },
        { status: 400 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el contenido' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAdminAccess();

    const success = await deleteContent(params.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Error al eliminar el contenido' },
        { status: 400 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el contenido' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAdminAccess();

    const content = await toggleContentStatus(params.id);
    if (!content) {
      return NextResponse.json(
        { error: 'Error al cambiar el estado del contenido' },
        { status: 400 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error toggling content status:', error);
    return NextResponse.json(
      { error: 'Error al cambiar el estado del contenido' },
      { status: 500 }
    );
  }
} 