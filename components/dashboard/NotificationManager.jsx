"use client";

import { playSound } from '@/lib/sounds'; // Import our new sound player
import { differenceInMinutes } from 'date-fns';
import { useEffect, useState } from 'react';

export function NotificationManager({ tasks, onTaskDue }) {
  const [notifiedTaskIds, setNotifiedTaskIds] = useState(new Set());

  const playAlarmSound = () => {
    // Read the user's preference from localStorage, default to 'beep'
    const sound = localStorage.getItem('notificationSound') || 'beep';
    playSound(sound);
  };

  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.status === 'COMPLETED' || !task.dueDate) return;

        const dueDate = new Date(task.dueDate);
        const minutesUntilDue = differenceInMinutes(dueDate, now);

        const isDue = minutesUntilDue <= 0;

        if (isDue && !notifiedTaskIds.has(task._id)) {
          playAlarmSound();
          onTaskDue(task);
          setNotifiedTaskIds(prev => new Set(prev).add(task._id));
        }
      });
    };

    const intervalId = setInterval(checkTasks, 60000);

    return () => clearInterval(intervalId);
  }, [tasks, onTaskDue, notifiedTaskIds]);

  return null;
}