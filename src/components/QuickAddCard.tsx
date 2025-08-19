import React, { useState } from 'react';
import { PlusIcon, LinkIcon } from 'lucide-react';
import { Card } from './ui/Card';

interface QuickAddCardProps {
  onAddTicket: (url: string, type: 'Forum' | 'Chat', date: Date) => void;
}

export function QuickAddCard({
  onAddTicket
}: QuickAddCardProps) {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'Forum' | 'Chat'>('Forum');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddTicket(url.trim(), type, new Date(date));
      setUrl('');
      setDate(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
      });
    }
  };
  return <Card title="Quick Add" variant="dark">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="ticket-url" className="block text-sm font-medium text-gray-300 mb-2">
            Ticket URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon size={16} className="text-gray-400" />
            </div>
            <input id="ticket-url" type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://wpml.org/forums/topic/..." className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-white placeholder-gray-500" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ticket-type" className="block text-sm font-medium text-gray-300 mb-2">
              Ticket Type
            </label>
            <select id="ticket-type" value={type} onChange={e => setType(e.target.value as 'Forum' | 'Chat')} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent appearance-none text-white">
              <option value="Forum">Forum</option>
              <option value="Chat">Chat</option>
            </select>
          </div>
          <div>
            <label htmlFor="ticket-date" className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input 
              id="ticket-date" 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent text-white [color-scheme:dark]" 
              required 
            />
          </div>
        </div>
        <button type="submit" className="w-full flex items-center justify-center px-5 py-3 bg-lime-500 hover:bg-lime-600 text-gray-900 rounded-lg transition font-medium">
          <PlusIcon size={18} className="mr-2" />
          Save Ticket
        </button>
      </form>
    </Card>;
}