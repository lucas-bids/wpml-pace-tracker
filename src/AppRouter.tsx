import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { AllTickets } from './pages/AllTickets';
interface Ticket {
  id: string;
  title: string;
  type: 'Forum' | 'Chat';
  date: Date;
}

interface MonthSettings {
  dailyGoal: number;
  extraTaskHours: number;
  daysOff: number[];
}

export function AppRouter() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tickets, setTickets] = useState<Ticket[]>([{
    id: '1',
    title: 'Plugin activation issue',
    type: 'Forum',
    date: new Date()
  }, {
    id: '2',
    title: 'Translation not working',
    type: 'Chat',
    date: new Date()
  }, {
    id: '3',
    title: 'License renewal question',
    type: 'Forum',
    date: new Date()
  }]);
  const [monthSettings, setMonthSettings] = useState<MonthSettings>({
    dailyGoal: 8,
    extraTaskHours: 5,
    daysOff: [10, 11, 24]
  });

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleAddTicket = (url: string, type: 'Forum' | 'Chat', date: Date) => {
    const urlParts = url.split('/');
    const slug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const newTicket = {
      id: Date.now().toString(),
      title,
      type,
      date
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const updateMonthSettings = (newSettings: MonthSettings) => {
    setMonthSettings(newSettings);
  };

  return <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <App 
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              tickets={tickets}
              onAddTicket={handleAddTicket}
              onDeleteTicket={handleDeleteTicket}
              monthSettings={monthSettings}
              updateMonthSettings={updateMonthSettings}
            />
          } 
        />
        <Route 
          path="/settings" 
          element={
            <App 
              settingsPage={true}
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              tickets={tickets}
              onAddTicket={handleAddTicket}
              onDeleteTicket={handleDeleteTicket}
              monthSettings={monthSettings}
              updateMonthSettings={updateMonthSettings}
            />
          } 
        />
        <Route 
          path="/tickets" 
          element={
            <AllTickets 
              tickets={tickets}
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
          } 
        />
      </Routes>
    </BrowserRouter>;
}