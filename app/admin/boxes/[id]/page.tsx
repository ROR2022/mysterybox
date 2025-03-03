import { checkAdminAccess } from '@/app/admin/config';
import { DigitalBox } from '@/libs/models/box';
import dbConnect from '@/libs/mongoose';
import { formatDate } from '@/utils/dates';
import { notFound } from 'next/navigation';
import { IDigitalBoxModel } from '@/libs/types/user';
import mongoose from 'mongoose';

interface BoxDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

type MongooseDocument = {
  _id: mongoose.Types.ObjectId;
  [key: string]: any;
};

interface PopulatedBox {
  _id: mongoose.Types.ObjectId;
  userId: {
    _id: mongoose.Types.ObjectId;
    email: string;
    name?: string;
  } | null;
  month: Date;
  content: IDigitalBoxModel['content'];
  status: IDigitalBoxModel['status'];
  deliveredAt: Date;
  openedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function BoxDetailsPage({ params }: BoxDetailsPageProps) {
  const { id } = await params;
  await checkAdminAccess();
  await dbConnect();

  const boxData = await DigitalBox.findById(id).populate('userId', 'email name').lean();

  if (!boxData) {
    notFound();
  }

  // Type assertion after validation
  const box = boxData as unknown as PopulatedBox;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalles de la Caja</h1>
          <a href="/admin/boxes" className="btn btn-outline">
            Volver
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Información General</h2>
              <div className="divider my-2"></div>
              <p><span className="font-medium">ID:</span> {box._id.toString()}</p>
              <p><span className="font-medium">Usuario:</span> {box.userId?.email || 'No disponible'}</p>
              <p><span className="font-medium">Estado:</span> {box.status}</p>
              <p><span className="font-medium">Mes:</span> {formatDate(box.month)}</p>
              <p><span className="font-medium">Fecha de Entrega:</span> {formatDate(box.deliveredAt)}</p>
              {box.openedAt && <p><span className="font-medium">Fecha de Apertura:</span> {formatDate(box.openedAt)}</p>}
              {box.completedAt && <p><span className="font-medium">Fecha de Completado:</span> {formatDate(box.completedAt)}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Contenido</h2>
              <div className="divider my-2"></div>
              {box.content.map((item, index) => (
                <div key={index} className="card bg-base-200 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h3 className="card-title text-base">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge badge-primary">{item.category}</span>
                      <span className="badge badge-secondary">{item.type}</span>
                      {item.points && <span className="badge badge-accent">{item.points} puntos</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 