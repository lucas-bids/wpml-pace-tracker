import React from 'react';
import { Card } from './ui/Card';
import { TrendingUpIcon, TrendingDownIcon, TargetIcon } from 'lucide-react';

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

interface MonthStatsCardProps {
  tickets: Ticket[];
  currentMonth: Date;
  monthSettings: MonthSettings;
}

export function MonthStatsCard({
  tickets,
  currentMonth,
  monthSettings
}: MonthStatsCardProps) {
  // Helper functions for calculations
  const getWorkdayCount = (month: number, year: number, daysOff: number[] = []) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workdays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      // Count weekdays (Monday-Friday) that are not in daysOff
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !daysOff.includes(day)) {
        workdays++;
      }
    }
    return workdays;
  };
  const getWorkedDaysSoFar = (month: number, year: number, daysOff: number[] = []) => {
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    if (!isCurrentMonth) {
      return 0; // For past or future months
    }
    const currentDay = today.getDate();
    let workedDays = 0;
    for (let day = 1; day <= currentDay; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !daysOff.includes(day)) {
        workedDays++;
      }
    }
    return workedDays;
  };
  // Calculate statistics
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const totalWorkdays = getWorkdayCount(month, year, monthSettings.daysOff);
  const workedDaysSoFar = getWorkedDaysSoFar(month, year, monthSettings.daysOff);
  const ticketsThisMonth = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.date);
    return ticketDate.getMonth() === month && ticketDate.getFullYear() === year;
  }).length;
  const dailyAverage = workedDaysSoFar > 0 ? (ticketsThisMonth / workedDaysSoFar).toFixed(1) : 0;
  const monthlyGoal = monthSettings.dailyGoal * totalWorkdays;
  const remainingTickets = Math.max(0, monthlyGoal - ticketsThisMonth);
  const remainingWorkdays = totalWorkdays - workedDaysSoFar;
  const neededPerDay = remainingWorkdays > 0 ? (remainingTickets / remainingWorkdays).toFixed(1) : 0;
  // Performance indicator  
  const isOnTrack = parseFloat(dailyAverage.toString()) >= monthSettings.dailyGoal;
  // Extra hours converted to day equivalents (assuming 8-hour workday)
  const adjustedDayEquivalents = (monthSettings.extraTaskHours / 8).toFixed(1);
  // Progress percentage
  const progressPercentage = Math.min(100, Math.round(ticketsThisMonth / monthlyGoal * 100));
  const stats = [{
    label: 'Total tickets',
    value: ticketsThisMonth,
    highlight: true,
    color: 'bg-blue-500'
  }, {
    label: 'Worked days',
    value: workedDaysSoFar,
    color: 'bg-gray-500'
  }, {
    label: 'Daily average',
    value: dailyAverage,
    icon: isOnTrack ? <TrendingUpIcon size={16} className="text-lime-500" /> : <TrendingDownIcon size={16} className="text-red-500" />,
    color: isOnTrack ? 'bg-lime-500' : 'bg-red-500'
  }, {
    label: 'Daily goal',
    value: monthSettings.dailyGoal,
    icon: <TargetIcon size={16} className="text-blue-500" />,
    color: 'bg-blue-500'
  }, {
    label: 'Monthly goal',
    value: monthlyGoal,
    highlight: true,
    color: 'bg-indigo-500'
  }, {
    label: 'Remaining',
    value: remainingTickets,
    color: 'bg-amber-500'
  }];
  return <Card title="Month Stats">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">Progress</span>
          <span className="text-sm font-bold text-gray-700">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full ${isOnTrack ? 'bg-lime-500' : 'bg-blue-500'}`} style={{
          width: `${progressPercentage}%`
        }}></div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => <div key={index} className={`relative overflow-hidden rounded-xl ${stat.highlight ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-white border border-gray-100'} p-4 flex flex-col items-center justify-center text-center`}>
            {!stat.highlight && <div className={`absolute top-0 left-0 w-full h-1 ${stat.color}`}></div>}
            <div className={`text-2xl font-bold ${stat.highlight ? 'text-white' : 'text-gray-800'} flex items-center`}>
              {stat.icon && <span className="mr-1">{stat.icon}</span>}
              {stat.value}
            </div>
            <div className={`text-sm mt-1 ${stat.highlight ? 'text-gray-300' : 'text-gray-500'}`}>
              {stat.label}
            </div>
          </div>)}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-800">Extra tasks</h4>
            <p className="text-sm text-blue-600 mt-1">
              {monthSettings.extraTaskHours} hours = {adjustedDayEquivalents}{' '}
              days
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">
              +{adjustedDayEquivalents}
            </span>
          </div>
        </div>
      </div>
    </Card>;
}