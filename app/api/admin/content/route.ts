import { NextRequest, NextResponse } from 'next/server';
import { createContent, getAllContent } from '@/libs/utils/content';
import { checkAdminAccess } from '@/app/admin/config';
import { InterestCategory, BoxContentType } from '@/libs/types/user';

export async function GET(request: NextRequest) {
  try {
    await checkAdminAccess();

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;
    const categoryParam = searchParams.get('category');
    const typeParam = searchParams.get('type');
    const active = searchParams.get('active')
      ? searchParams.get('active') === 'true'
      : undefined;

    // Validar que la categoría sea válida
    const category = categoryParam
      ? (Object.values(InterestCategory).includes(categoryParam as InterestCategory)
          ? categoryParam as InterestCategory
          : undefined)
      : undefined;

    // Validar que el tipo sea válido
    const type = typeParam
      ? (Object.values(BoxContentType).includes(typeParam as BoxContentType)
          ? typeParam as BoxContentType
          : undefined)
      : undefined;

    const result = await getAllContent(page, limit, search, category, type, active);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting content:', error);
    return NextResponse.json(
      { error: 'Error al obtener el contenido' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkAdminAccess();

    const contentData = await request.json();
    const content = await createContent(contentData);

    if (!content) {
      return NextResponse.json(
        { error: 'Error al crear el contenido' },
        { status: 400 }
      );
    }

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Error al crear el contenido' },
      { status: 500 }
    );
  }
} 