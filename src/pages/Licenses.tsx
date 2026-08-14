import { useEffect, useState } from 'react';
import api from '../api/client';
import { format } from 'date-fns';

export default function Licenses() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLicenses = () => {
    setLoading(true);
    api.get('/admin/licenses').then(res => {
      setLicenses(res.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ tailorName: '', shopName: '', mobile: '', address: '', email: '', plan: 'monthly', price: 0 });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/licenses', formData);
      setShowModal(false);
      setFormData({ tailorName: '', shopName: '', mobile: '', address: '', email: '', plan: 'monthly', price: 0 });
      fetchLicenses();
    } catch (e) {
      alert('Error creating license');
    }
  };

  const handleAction = async (id: string, action: string, payload: any = {}) => {
    if (!confirm(`Are you sure you want to ${action} this license?`)) return;
    try {
      if (action === 'delete') {
        await api.delete(`/admin/licenses/${id}`);
      } else {
        await api.patch(`/admin/licenses/${id}/${action}`, payload);
      }
      fetchLicenses();
    } catch (e) {
      alert('Action failed');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Licenses</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Create Tailor
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Tailor & License</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder="Tailor Name" className="w-full border p-2 rounded" value={formData.tailorName} onChange={e => setFormData({...formData, tailorName: e.target.value})} />
              <input required placeholder="Shop Name" className="w-full border p-2 rounded" value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} />
              <input required placeholder="Mobile Number" className="w-full border p-2 rounded" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              <input placeholder="Address" className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              
              <div className="flex gap-4">
                <select className="flex-1 border p-2 rounded" value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})}>
                  <option value="daily">Daily (1 Day)</option>
                  <option value="weekly">Weekly (1 Week)</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                </select>
                <input type="number" placeholder="Price" className="flex-1 border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Plan</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Expiry</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {licenses.map(lic => (
              <tr key={lic._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-sm">{lic.licenseKey}</td>
                <td className="p-4 capitalize">{lic.plan}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lic.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    lic.status === 'BLOCKED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lic.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {lic.expiresAt 
                    ? format(new Date(lic.expiresAt), 'MMM dd, yyyy') 
                    : (lic.plan === 'lifetime' ? 'Lifetime' : (lic.status === 'AVAILABLE' ? 'Not Activated' : 'N/A'))
                  }
                </td>
                <td className="p-4 text-right space-x-2">
                  {lic.status !== 'BLOCKED' ? (
                    <button onClick={() => handleAction(lic._id, 'block')} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 hover:bg-red-100">Block</button>
                  ) : (
                    <button onClick={() => handleAction(lic._id, 'unblock')} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100 hover:bg-green-100">Unblock</button>
                  )}
                  {lic.plan !== 'lifetime' && (
                    <button onClick={() => handleAction(lic._id, 'extend', { months: 1 })} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100">Extend 1M</button>
                  )}
                  <button onClick={() => handleAction(lic._id, 'delete')} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100">Delete</button>
                </td>
              </tr>
            ))}
            {licenses.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No licenses found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
