"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function AlarmDialog({ task, onSnooze, onExtend, onComplete, onClose }) {
  if (!task) return null;

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-destructive">
            🚨 Reminder: Task Due!
          </DialogTitle>
          <DialogDescription className="text-lg pt-2">
            Your task, "{task.title}", is due now.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>{task.description}</p>
        </div>
        <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button variant="secondary" onClick={onSnooze}>Snooze (10 min)</Button>
          <Button variant="outline" onClick={onExtend}>Extend (1 hour)</Button>
          <Button onClick={onComplete}>Mark as Completed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}