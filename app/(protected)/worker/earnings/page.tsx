'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WorkerNav } from '@/components/navigation/WorkerNav';
import '@/styles/worker.css';
import { Calendar, DollarSign, TrendingUp, Wallet } from 'lucide-react';

export default function WorkerEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Dummy earnings data
  const earnings = {
    today: 2500,
    thisWeek: 12000,
    thisMonth: 45000,
    total: 180000,
    pending: 3500,
  };

  const weeklyData = [
    { day: 'Mon', amount: 2000 },
    { day: 'Tue', amount: 1500 },
    { day: 'Wed', amount: 3000 },
    { day: 'Thu', amount: 1800 },
    { day: 'Fri', amount: 2200 },
    { day: 'Sat', amount: 1500 },
    { day: 'Sun', amount: 0 },
  ];

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount));

  const transactions = [
    {
      id: 1,
      date: "आज / Today",
      description: "विद्युत मरम्मत / Electrical Repair - ABC Building",
      amount: 1200,
      status: "completed",
    },
    {
      id: 2,
      date: "आज / Today",
      description: "वायरिंग स्थापन / Wiring Installation - XYZ Corp",
      amount: 1500,
      status: "pending",
    },
    {
      id: 3,
      date: "कल / Yesterday",
      description: "पैनल मरम्मत / Panel Repair - City Services",
      amount: 900,
      status: "completed",
    },
    {
      id: 4,
      date: "2 दिन पहले / 2 days ago",
      description: "आपातकालीन वायरिंग / Emergency Wiring - Premium",
      amount: 2000,
      status: "completed",
    },
    {
      id: 5,
      date: "3 दिन पहले / 3 days ago",
      description: "घर सेटअप / Home Setup - BuildCo",
      amount: 1800,
      status: "completed",
    },
  ];

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">कमाई / Earnings</h1>
          </div>
        </div>

        {/* Scroll Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Period Selection */}
          <div className="flex gap-2 bg-card rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  selectedPeriod === period
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Main Earnings Card */}
          <div className="bg-card text-primary rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm opacity-90">This {selectedPeriod}</span>
            </div>
            <p className="text-4xl font-bold mb-4">₹{earnings.thisWeek.toLocaleString()}</p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>+12% from last {selectedPeriod}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Today</span>
              </div>
              <p className="text-xl font-bold text-primary">₹{earnings.today.toLocaleString()}</p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Pending</span>
              </div>
              <p className="text-xl font-bold text-amber-600">₹{earnings.pending.toLocaleString()}</p>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Weekly Overview</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-300"
                    style={{ height: `${maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0}%`, minHeight: day.amount > 0 ? '4px' : '0' }}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">+₹{transaction.amount}</p>
                    <p className={`text-xs ${transaction.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Withdraw Button */}
          <Button className="w-full bg-primary hover:bg-primary/90 py-6">
            Withdraw Earnings
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
