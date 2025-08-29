"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { AlarmDialog } from "./AlarmDialog";
import { NewTaskDialog } from "./NewTaskDialog";
import { NotificationManager } from "./NotificationManager";
import { TaskCard } from "./TaskCard";
import { TaskHistorySidebar } from "./TaskHistorySidebar"; // Import Sidebar

export function DashboardClient({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [alarmTask, setAlarmTask] = useState(null);
  const { toast } = useToast();

  const refreshTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to refresh tasks", error);
    }
  };

  // Handler functions (handleSnooze, handleExtend, handleComplete) remain the same...
  const handleSnooze = async () => {
    if (!alarmTask) return;
    try {
      await fetch(`/api/tasks/${alarmTask._id}/snooze`, { method: 'PUT' });
      toast({ title: "Task snoozed for 10 minutes!" });
      setAlarmTask(null);
      refreshTasks();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to snooze task." });
    }
  };

  const handleExtend = async () => {
    if (!alarmTask) return;
    const newDueDate = new Date(new Date(alarmTask.dueDate).getTime() + 60 * 60000);
    try {
      await fetch(`/api/tasks/${alarmTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...alarmTask, dueDate: newDueDate }),
      });
      toast({ title: "Task due date extended by 1 hour!" });
      setAlarmTask(null);
      refreshTasks();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to extend task." });
    }
  };

  const handleComplete = async () => {
    if (!alarmTask) return;
    try {
      await fetch(`/api/tasks/${alarmTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...alarmTask, status: 'COMPLETED' }),
      });
      toast({ title: "Task marked as completed!" });
      setAlarmTask(null);
      refreshTasks();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to complete task." });
    }
  };

  // Memoized filter logic remains the same...
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => (filter === "ALL" ? true : task.status === filter))
      .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tasks, filter, searchTerm]);

  return (
    // This is the new two-column layout
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
      <NotificationManager tasks={tasks} onTaskDue={setAlarmTask} />
      <AlarmDialog 
        task={alarmTask}
        onSnooze={handleSnooze}
        onExtend={handleExtend}
        onComplete={handleComplete}
        onClose={() => setAlarmTask(null)}
      />
      
      {/* Sidebar Column */}
      <TaskHistorySidebar tasks={tasks} />

      {/* Main Content Column */}
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Tasks</h1>
          <NewTaskDialog onTaskCreated={refreshTasks}>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </NewTaskDialog>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onTaskUpdated={refreshTasks} />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center">
              No tasks found. Create one to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}