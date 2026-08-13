import { useEffect, useState } from 'react';
import api from '../api/client';
import { format } from 'date-fns';

export default function Tenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/tenants').then(res => {
      setTenants(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Tenants / Users</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Tenant ID</th>
              <th className="p-4 font-medium">License</th>
              <th className="p-4 font-medium">Plan</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Active Device</th>
              <th className="p-4 font-medium">Last Active</th>
              <th className="p-4 font-medium">Last Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenants.map(t => (
              <tr key={t._id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="p-4 font-mono text-xs">{t.tenantId}</td>
                <td className="p-4 font-mono text-xs">{t.licenseKey}</td>
                <td className="p-4 capitalize">{t.plan}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    t.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{t.activeDeviceName || 'None'}</td>
                <td className="p-4 text-gray-500">
                  {t.lastActiveAt ? format(new Date(t.lastActiveAt), 'MMM dd, HH:mm') : 'Never'}
                </td>
                <td className="p-4 text-gray-500">
                  {t.lastSyncAt ? format(new Date(t.lastSyncAt), 'MMM dd, HH:mm') : 'Never'}
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">No tenants found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
