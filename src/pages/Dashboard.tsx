import { useEffect, useState } from 'react';
import api from '../api/client';
import { FiUsers, FiKey, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  const cards = [
    { title: 'Total Licenses', value: stats.total, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Active', value: stats.active, icon: FiCheckCircle, color: 'bg-green-500' },
    { title: 'Expired', value: stats.expired, icon: FiAlertCircle, color: 'bg-yellow-500' },
    { title: 'Blocked', value: stats.blocked, icon: FiKey, color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className={`p-4 rounded-lg ${card.color} text-white mr-4`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8">
        <h2 className="text-xl font-bold mb-4">Subscription Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500 text-sm font-medium">Daily</p>
            <p className="text-3xl font-bold mt-2">{stats.subscriptions.daily}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500 text-sm font-medium">Weekly</p>
            <p className="text-3xl font-bold mt-2">{stats.subscriptions.weekly}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500 text-sm font-medium">Monthly</p>
            <p className="text-3xl font-bold mt-2">{stats.subscriptions.monthly}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500 text-sm font-medium">Yearly</p>
            <p className="text-3xl font-bold mt-2">{stats.subscriptions.yearly}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center md:col-span-1 col-span-2">
            <p className="text-gray-500 text-sm font-medium">Lifetime</p>
            <p className="text-3xl font-bold mt-2">{stats.subscriptions.lifetime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
