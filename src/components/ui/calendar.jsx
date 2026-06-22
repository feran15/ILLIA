import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { api } from "@/lib/api";

export default function CalendarWrapper() {
  const [date, setDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  // GET events from backend
useEffect(() => {
  async function load() {
    const res = await api("/api/calendar/posts");

    setPosts(res.posts || []);
  }

  load();
}, []);

  // POST selected date to backend
  const handleSelect = async (selectedDate) => {
    setDate(selectedDate);

    if (!selectedDate) return;

    try {
      await api("/api/calendar/posts", {
        method: "POST",
        body: JSON.stringify({
          date: selectedDate,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleSelect}
    />
  );
}