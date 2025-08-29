import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// The fix is here: The second argument is now { params }
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const { id } = params; // This is now the correct way to get the id
    const { title, description, status, dueDate } = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(session.user.id) },
      {
        $set: {
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate) : null,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[TASK_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// The fix is here as well: The second argument is now { params }
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthenticated', { status: 401 });
  }

  try {
    const { id } = params; // This is now the correct way to get the id
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    await db.collection('tasks').deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id),
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[TASK_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}