import React, { useState, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { Order } from '../types';
import { getOrders, saveOrders } from '../data';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Orders</h2>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-gray-500">
          <div>ORDER ID</div>
          <div>CUSTOMER</div>
          <div>DATE</div>
          <div>STATUS</div>
          <div>TOTAL</div>
        </div>

        {orders.map(order => (
          <div 
            key={order.id} 
            className="grid grid-cols-5 gap-4 p-4 border-b items-center"
            onMouseEnter={() => setHoveredId(order.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div>{order.id}</div>
            <div>{order.customerName}</div>
            <div>{order.date}</div>
            <div className="relative">
              {editingId === order.id ? (
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value as Order['status'])}
                  className="border rounded px-2 py-1"
                  autoFocus
                >
                  <option value="pending">pending</option>
                  <option value="shipped">shipped</option>
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                  {hoveredId === order.id && (
                    <button
                      onClick={() => setEditingId(order.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div>${order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;