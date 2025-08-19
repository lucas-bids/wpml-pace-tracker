import React from 'react';
import { TrashIcon, CheckCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';

interface Ticket {
  id: string;
  title: string;
  type: 'Forum' | 'Chat';
  date: Date;
}

interface DayTicketsCardProps {
  tickets: Ticket[];
  onDeleteTicket: (id: string) => void;
}

export function DayTicketsCard({
  tickets,
  onDeleteTicket
}: DayTicketsCardProps) {

  return <Card title="Today's Tickets" variant="glass">
      {tickets.length === 0 ? <div className="py-12 text-center">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No tickets added today.</p>
          <p className="text-sm text-gray-400 mt-2">
            Use the Quick Add form to add tickets.
          </p>
        </div> : <ul className="divide-y divide-gray-100">
          {tickets.map((ticket, index) => <li key={ticket.id} className="py-4 flex items-center justify-between group hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center">
                <div className="mr-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{ticket.title}</h3>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {ticket.type}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(ticket.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => onDeleteTicket(ticket.id)} className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100" aria-label="Delete ticket">
                <TrashIcon size={18} />
              </button>
            </li>)}
        </ul>}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} today
        </span>
        <Link 
          to="/tickets" 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          View all tickets
        </Link>
      </div>
    </Card>;
}