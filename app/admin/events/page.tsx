"use client";
import { useState } from "react";
import { CalendarDays, MapPin, Eye, Check, X } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState([
    { id: 1, title: "The Grand Concert 2024", organizer: "GMM Grammy", date: "12 Dec 2024", venue: "Impact Arena", status: "Published" },
    { id: 2, title: "Indie Rock Night", organizer: "Smallroom", date: "25 Nov 2024", venue: "Voice Space", status: "Pending Review" },
    { id: 3, title: "Jazz in the Park", organizer: "Unknown Organizer", date: "01 Jan 2025", venue: "Benjakitti Park", status: "Rejected" },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarDays className="text-purple-500" /> รายการอีเวนต์ (Events)
      </h1>

      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-[#161B22] border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-white/10 transition-all">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-gray-500">Img</div>
              <div>
                <h3 className="font-bold text-lg text-white">{event.title}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <span>โดย {event.organizer}</span> • <span className="flex items-center gap-1"><MapPin size={12}/> {event.venue}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                event.status === 'Published' ? 'bg-green-500/10 text-green-400' :
                event.status === 'Pending Review' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {event.status}
              </span>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"><Eye size={18} /></button>
                {event.status === 'Pending Review' && (
                  <>
                    <button className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-colors"><Check size={18} /></button>
                    <button className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><X size={18} /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}