'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { processCheckout } from '../actions/checkout';
import styles from './CheckoutUI.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Branch } from '@prisma/client';

export default function CheckoutUI({ branch }: { branch: Branch }) {
  const { cart, cartTotal, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await processCheckout({
      branchId: branch.id,
      name,
      phone,
      cart: cart.map(c => ({ productId: c.product.id, quantity: c.quantity })),
      totalAmount: cartTotal
    });

    setLoading(false);

    if (res.success) {
      clearCart();
      router.push(`/${branch.id}/success?orderId=${res.orderId}&stamps=${res.newStampCount}`);
    } else {
      alert('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Sepetiniz boş</h2>
        <Link href={`/${branch.id}/menu`} className={styles.backBtn}>Menüye Dön</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={`/${branch.id}/menu`} className={styles.headerBack}>‹</Link>
        <h1>Sepetim</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.cartItems}>
          {cart.map(item => (
            <div key={item.product.id} className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <span className={styles.quantity}>{item.quantity}x</span>
                <h3>{item.product.name}</h3>
              </div>
              <span className={styles.price}>{item.product.price * item.quantity} TL</span>
            </div>
          ))}
          <div className={styles.totalRow}>
            <span>Toplam</span>
            <strong>{cartTotal} TL</strong>
          </div>
        </section>

        <section className={styles.paymentSection}>
          <h2>Bilgileriniz (Iyzico Sandbox)</h2>
          <form onSubmit={handleCheckout} className={styles.form}>
            <input 
              type="text" 
              placeholder="Ad Soyad" 
              value={name}
              onChange={e => setName(e.target.value)}
              required 
              className={styles.input}
            />
            <input 
              type="tel" 
              placeholder="Telefon Numarası (Örn: 5551234567)" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required 
              className={styles.input}
            />
            
            <div className={styles.fakeCard}>
              <p className={styles.cardHeader}>Kredi Kartı (Örnek Görünüm)</p>
              <input type="text" placeholder="Kart Numarası" className={styles.input} required defaultValue="4353 0000 0000 0000" />
              <div className={styles.cardInfo}>
                <input type="text" placeholder="AA/YY" className={styles.input} required defaultValue="12/26"/>
                <input type="text" placeholder="CVC" className={styles.input} required defaultValue="123"/>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'İşleniyor...' : `${cartTotal} TL Öde`}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
