"use client";

import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isSameDay } from "date-fns";
import { useEffect, useState } from "react"; // Import useEffect

export function TaskHistorySidebar({ tasks }) {
  const [date, setDate] = useState(new Date());
  // New state to track if the component has "mounted" on the client
  const [isClient, setIsClient] = useState(false);

  // useEffect only runs on the client, after the initial render.
  useEffect(() => {
    // Once this runs, we know we are on the client, so we can safely render the calendar.
    setIsClient(true);
  }, []); // The empty array ensures this effect runs only once.

  const tasksForSelectedDay = tasks.filter(
    (task) => task.dueDate && isSameDay(new Date(task.dueDate), date)
  );

  // While we are on the server or during the initial client render, show a placeholder.
  if (!isClient) {
    return (
      <aside className="hidden md:flex flex-col gap-4 border-r pr-4">
        <h2 className="text-lg font-semibold tracking-tight">Task History</h2>
        <div className="rounded-md border p-3">
            <p className="text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      </aside>
    );
  }

  // Once isClient is true, render the actual component.
  return (
    <aside className="hidden md:flex flex-col gap-4 border-r pr-4">
      <h2 className="text-lg font-semibold tracking-tight">Task History</h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
      <div className="flex-1">
        <h3 className="text-md font-semibold mb-2">
          Tasks for {date ? format(date, 'PPP') : 'No date selected'}
        </h3>
        <ScrollArea className="h-[300px]">
          {tasksForSelectedDay.length > 0 ? (
            <ul className="space-y-2">
              {tasksForSelectedDay.map((task) => (
                <li key={task._id} className="text-sm p-2 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.status === "COMPLETED"}
                      disabled
                      id={`hist-${task._id}`}
                    />
                    <label htmlFor={`hist-${task._id}`} className={`${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center pt-4">
              No tasks for this day.
            </p>
          )}
        </ScrollArea>
      </div>
    </aside>
  );
}
