"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

export function TaskCard({ task, onTaskUpdated }) {
  const { toast } = useToast();

  const handleStatusChange = async (checked) => {
    const newStatus = checked ? "COMPLETED" : "PENDING";
    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      toast({ title: "Task status updated!" });
      onTaskUpdated();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to update task." });
    }
  };

  const handleDelete = async () => {
    console.log("Deleting task:", task._id);
     try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "DELETE",
      });
      toast({ title: "Task deleted!" });
      onTaskUpdated();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete task." });
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "COMPLETED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className={cn(task.status === "COMPLETED" && "bg-muted/50")}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {task.dueDate && (
          <p className="text-sm text-muted-foreground">
            Due: {format(new Date(task.dueDate), "PPP")}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant={getStatusBadgeVariant(task.status)}>
          {task.status.replace("_", " ")}
        </Badge>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`task-${task._id}`}
            checked={task.status === "COMPLETED"}
            onCheckedChange={handleStatusChange}
          />
          <label
            htmlFor={`task-${task._id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Done
          </label>
        </div>
      </CardFooter>
    </Card>
  );
}