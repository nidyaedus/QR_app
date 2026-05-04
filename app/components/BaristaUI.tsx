'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './BaristaUI.module.css';
import { Branch } from '@prisma/client';
import { getActiveOrders, updateOrderStatus } from '../actions/orders';

type OrderWithDetails = {
  id: string;
  orderNumber: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
  user: { name: string };
  items: {
    product: { name: string };
    quantity: number;
    size: string | null;
    milkType: string | null;
  }[];
};

export default function BaristaUI({ branch }: { branch: Branch }) {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);

  const fetchOrders = useCallback(async () => {
    const data = await getActiveOrders(branch.id);
    setOrders(data as any);
  }, [branch.id]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    await updateOrderStatus(orderId, nextStatus);
  };

  const columns = [
    { id: 'RECEIVED', title: 'Yeni Gelenler', next: 'PREPARING', btnText: 'Hazırlamaya Başla' },
    { id: 'PREPARING', title: 'Hazırlanıyor', next: 'READY', btnText: 'Hazır' },
    { id: 'READY', title: 'Teslim Bekliyor', next: 'DELIVERED', btnText: 'Teslim Edildi' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{branch.name} - Barista Ekranı</h1>
        <p className={styles.liveIndicator}>Canlı (Her 5sn güncellenir)</p>
      </header>
      
      <main className={styles.kanban}>
        {columns.map(col => (
          <div key={col.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <h2>{col.title}</h2>
              <span className={styles.count}>
                {orders.filter(o => o.status === col.id).length}
              </span>
            </div>
            
            <div className={styles.tickets}>
              {orders.filter(o => o.status === col.id).map(order => (
                <div key={order.id} className={styles.ticket}>
                  <div className={styles.ticketHeader}>
                    <strong>#{order.orderNumber || order.id.slice(-4).toUpperCase()}</strong>
                    <span>{new Date(order.createdAt).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className={styles.customerName}>{order.user.name}</p>
                  <div className={styles.paymentRow}>
                    <span>{order.totalAmount} TL</span>
                    <span className={order.paymentStatus === 'PAID' ? styles.paidBadge : styles.counterBadge}>
                      {order.paymentStatus === 'PAID' ? 'Ödendi' : 'Kasada ödeme'}
                    </span>
                  </div>
                  
                  <ul className={styles.itemList}>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        <span className={styles.itemQty}>{item.quantity}x</span> {item.product.name}
                        {(item.size || item.milkType) && (
                          <div className={styles.itemMeta}>
                            {item.size} {item.milkType}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={styles.actionBtn}
                    onClick={() => handleStatusChange(order.id, col.next)}
                  >
                    {col.btnText}
                  </button>
                </div>
              ))}
              {orders.filter(o => o.status === col.id).length === 0 && (
                <div className={styles.emptyColumn}>Bekleyen sipariş yok</div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
