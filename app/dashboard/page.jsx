import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function getTasks(userId) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const tasks = await db
      .collection('tasks')
      .find({ userId: new ObjectId(userId) })
      .sort({ dueDate: 1 })
      .toArray();
    // MongoDB returns BSON which is not directly serializable for client components
    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/');
  }

  const tasks = await getTasks(session.user.id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <DashboardClient initialTasks={tasks} />
      </main>
    </div>
  );
}