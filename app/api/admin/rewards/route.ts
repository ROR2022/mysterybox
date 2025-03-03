import { NextRequest, NextResponse } from 'next/server';
import { getAllRewards, createReward } from '@/libs/utils/reward';
import { checkAdminAccess } from '@/app/admin/config';
import { RewardType } from '@/libs/types/reward';

export async function GET(request: NextRequest) {
  try {
    await checkAdminAccess();

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const active = searchParams.get('active')
      ? searchParams.get('active') === 'true'
      : undefined;

    const result = await getAllRewards(page, limit, active);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting rewards:', error);
    return NextResponse.json(
      { error: 'Error al obtener las recompensas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkAdminAccess();

    const rewardData = await request.json();
    
    // Validar los datos de la recompensa
    if (!rewardData.title || !rewardData.description || !rewardData.type || !rewardData.pointsCost) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar que el tipo sea válido
    if (!Object.values(RewardType).includes(rewardData.type)) {
      return NextResponse.json(
        { error: 'Tipo de recompensa inválido' },
        { status: 400 }
      );
    }

    // Crear la recompensa
    const reward = await createReward(rewardData);

    if (!reward) {
      return NextResponse.json(
        { error: 'Error al crear la recompensa' },
        { status: 400 }
      );
    }

    return NextResponse.json(reward, { status: 201 });
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json(
      { error: 'Error al crear la recompensa' },
      { status: 500 }
    );
  }
} 