"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { playSound } from "@/lib/sounds";
import { useEffect, useState } from "react";

// This component allows the user to select and test notification sounds.
export function SoundSettings() {
  // Get the saved sound from localStorage, or default to 'beep'
  const [selectedSound, setSelectedSound] = useState('beep');

  // On initial render, load the saved preference
  useEffect(() => {
    const savedSound = localStorage.getItem('notificationSound') || 'beep';
    setSelectedSound(savedSound);
  }, []);

  // Handle sound selection and save it to localStorage
  const handleSoundChange = (sound) => {
    setSelectedSound(sound);
    localStorage.setItem('notificationSound', sound);
    playSound(sound); // Play a preview
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Notifications</h4>
        <p className="text-sm text-muted-foreground">
          Select the sound that plays for reminders.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sound-select">Alarm Sound</Label>
        <Select value={selectedSound} onValueChange={handleSoundChange}>
          <SelectTrigger id="sound-select">
            <SelectValue placeholder="Select a sound" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beep">Beep</SelectItem>
            <SelectItem value="chime">Chime</SelectItem>
            <SelectItem value="alert">Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}