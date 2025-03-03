import { NextResponse } from "next/server";
import { checkAdminAccess } from "@/app/admin/config";
import { User } from "@/libs/models/user";
import { DigitalBox } from "@/libs/models/box";
import dbConnect from "@/libs/mongoose";

export async function GET() {
  try {
    await checkAdminAccess();
    await dbConnect();

    // Obtener estadísticas de usuarios
    const [
      totalUsers,
      activeSubscriptions,
      subscriptionsByPlan,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ 'subscription.active': true }),
      User.aggregate([
        {
          $match: { 'subscription.active': true }
        },
        {
          $group: {
            _id: '$subscription.plan',
            count: { $sum: 1 }
          }
        }
      ]),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt')
    ]);

    // Obtener estadísticas de cajas
    const [
      totalBoxes,
      boxesByStatus,
      activeBoxesResult,
      recentBoxes
    ] = await Promise.all([
      DigitalBox.countDocuments(),
      DigitalBox.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      DigitalBox.aggregate([
        {
          $match: {
            status: { $in: ['delivered', 'opened'] }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $match: {
            'user.subscription.active': true
          }
        },
        {
          $count: 'total'
        }
      ]),
      DigitalBox.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email')
    ]);

    // Calcular métricas adicionales
    const conversionRate = (activeSubscriptions / totalUsers) * 100;
    
    // Calcular el total de cajas entregadas (incluyendo opened y completed)
    const deliveredBoxes = boxesByStatus.reduce((total, { _id, count }) => {
      if (['delivered', 'opened', 'completed'].includes(_id)) {
        return total + count;
      }
      return total;
    }, 0);

    // Obtener el total de cajas activas del resultado de la agregación
    const activeBoxes = activeBoxesResult[0]?.total || 0;
    
    // Formatear los datos para la respuesta
    const stats = {
      users: {
        total: totalUsers,
        activeSubscriptions,
        conversionRate: conversionRate.toFixed(2),
        byPlan: Object.fromEntries(
          subscriptionsByPlan.map(({ _id, count }) => [_id, count])
        ),
        recent: recentUsers.map(user => ({
          id: user._id,
          name: user.name || 'Sin nombre',
          email: user.email,
          createdAt: user.createdAt
        }))
      },
      boxes: {
        total: totalBoxes,
        byStatus: Object.fromEntries(
          boxesByStatus.map(({ _id, count }) => [_id, count])
        ),
        deliveredTotal: deliveredBoxes,
        activeTotal: activeBoxes,
        recent: recentBoxes.map(box => ({
          id: box._id,
          userId: box.userId?._id,
          userName: box.userId?.name || 'Sin nombre',
          userEmail: box.userId?.email,
          status: box.status,
          createdAt: box.createdAt
        }))
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting admin stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 