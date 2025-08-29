import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// This function handles snoozing a task by 10 minutes
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const task = await db.collection('tasks').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id),
    });

    if (!task) {
      return new NextResponse('Task not found', { status: 404 });
    }

    // Calculate the new due date: current due date + 10 minutes
    const newDueDate = new Date(new Date(task.dueDate).getTime() + 10 * 60000);

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: { dueDate: newDueDate, updatedAt: new Date() } }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[TASK_SNOOZE_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
