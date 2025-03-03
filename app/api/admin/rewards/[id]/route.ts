import { NextRequest, NextResponse } from 'next/server';
import { getRewardById, updateReward, deleteReward, toggleRewardStatus } from '@/libs/utils/reward';
import { checkAdminAccess } from '@/app/admin/config';
import { RewardType } from '@/libs/types/reward';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAdminAccess();

    const reward = await getRewardById(params.id);
    
    if (!reward) {
      return NextResponse.json(
        { error: 'Recompensa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(reward);
  } catch (error) {
    console.error('Error getting reward:', error);
    return NextResponse.json(
      { error: 'Error al obtener la recompensa' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    const reward = await updateReward(params.id, rewardData);
    
    if (!reward) {
      return NextResponse.json(
        { error: 'Recompensa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(reward);
  } catch (error) {
    console.error('Error updating reward:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la recompensa' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAdminAccess();

    const success = await deleteReward(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Recompensa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reward:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la recompensa' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await checkAdminAccess();

    const reward = await toggleRewardStatus(params.id);
    
    if (!reward) {
      return NextResponse.json(
        { error: 'Recompensa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(reward);
  } catch (error) {
    console.error('Error toggling reward status:', error);
    return NextResponse.json(
      { error: 'Error al cambiar el estado de la recompensa' },
      { status: 500 }
    );
  }
} 