import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const tasks = await db
      .collection('tasks')
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('[TASKS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const { title, description, status, dueDate } = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection('tasks').insertOne({
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: new ObjectId(session.user.id),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[TASKS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}