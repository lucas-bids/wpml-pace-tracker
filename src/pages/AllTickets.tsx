
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/Card';

interface Ticket {
  id: string;
  title: string;
  type: 'Forum' | 'Chat';
  date: Date;
}

interface AllTicketsProps {
  tickets: Ticket[];
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

interface GroupedTickets {
  [weekKey: string]: {
    weekStart: Date;
    days: {
      [dayKey: string]: Ticket[];
    };
  };
}

export function AllTickets({
  tickets,
  currentMonth,
  onPrevMonth,
  onNextMonth
}: AllTicketsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getISOWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff));
  };

  const formatWeekHeader = (weekStart: Date): string => {
    return `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const formatDayHeader = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filterMonthTickets = (tickets: Ticket[], month: Date): Ticket[] => {
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.date);
      return ticketDate.getMonth() === month.getMonth() && 
             ticketDate.getFullYear() === month.getFullYear();
    });
  };

  const groupTicketsByWeekAndDay = (tickets: Ticket[]): GroupedTickets => {
    const grouped: GroupedTickets = {};
    
    tickets.forEach(ticket => {
      const ticketDate = new Date(ticket.date);
      const weekStart = getISOWeekStart(ticketDate);
      const weekKey = weekStart.toISOString().split('T')[0];
      const dayKey = ticketDate.toISOString().split('T')[0];
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          weekStart,
          days: {}
        };
      }
      
      if (!grouped[weekKey].days[dayKey]) {
        grouped[weekKey].days[dayKey] = [];
      }
      
      grouped[weekKey].days[dayKey].push(ticket);
    });
    
    return grouped;
  };

  const sortTicketsChronologically = (tickets: Ticket[]): Ticket[] => {
    return [...tickets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const isWorkday = (date: Date): boolean => {
    const day = date.getDay();
    // Mon-Fri (1-5). TODO: Support Tue-Sat (2-6) when settings feature is added
    return day >= 1 && day <= 5;
  };

  // Filter and sort tickets for the current month
  const monthTickets = filterMonthTickets(tickets, currentMonth);
  const sortedTickets = sortTicketsChronologically(monthTickets);
  const groupedTickets = groupTicketsByWeekAndDay(sortedTickets);

  // Create a map for continuous numbering
  const ticketNumberMap = new Map<string, number>();
  sortedTickets.forEach((ticket, index) => {
    ticketNumberMap.set(ticket.id, index + 1);
  });

  // Sort weeks chronologically
  const sortedWeeks = Object.entries(groupedTickets).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] text-gray-800">
      <Navigation 
        currentMonth={currentMonth} 
        onPrevMonth={onPrevMonth} 
        onNextMonth={onNextMonth} 
      />
      <main className="flex-1 px-6 py-8 pt-32">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              All tickets of {formatMonth(currentMonth)}
            </h1>
            <p className="text-gray-500 mt-2">
              Complete list of tickets organized by week and day
            </p>
          </header>

          {sortedTickets.length === 0 ? (
            <Card variant="glass">
              <div className="py-12 text-center">
                <p className="text-gray-500 font-medium">No tickets found for this month.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Tickets will appear here as you add them.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {sortedWeeks.map(([weekKey, weekData]) => (
                <Card key={weekKey} variant="glass">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3">
                      {formatWeekHeader(weekData.weekStart)}
                    </h2>
                    
                    {Object.entries(weekData.days)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .filter(([dayKey]) => isWorkday(new Date(dayKey)))
                      .map(([dayKey, dayTickets]) => (
                        <div key={dayKey} className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-700">
                            {formatDayHeader(new Date(dayKey))}
                          </h3>
                          
                          <ul className="space-y-2">
                            {dayTickets
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .map(ticket => (
                                <li 
                                  key={ticket.id} 
                                  className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="mr-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                                    {ticketNumberMap.get(ticket.id)}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{ticket.title}</h4>
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
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
