import { useEffect, useState } from 'react';
import api from '../api/client';
import { format } from 'date-fns';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit-logs').then(res => {
      setLogs(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Admin</th>
              <th className="p-4 font-medium">Action</th>
              <th className="p-4 font-medium">Target ID</th>
              <th className="p-4 font-medium">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map(log => (
              <tr key={log._id} className="hover:bg-gray-50 transition-colors text-sm">
                <td className="p-4 text-gray-500 whitespace-nowrap">
                  {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                </td>
                <td className="p-4 font-mono text-xs">{log.adminId || 'System'}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium font-mono">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-gray-500">{log.targetId || '-'}</td>
                <td className="p-4 text-xs text-gray-500">
                  {log.metadata ? (
                    <pre className="bg-gray-50 p-2 rounded max-w-xs overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No audit logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
