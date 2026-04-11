'use client';

import { useState } from 'react';
import styles from './MenuUI.module.css';
import { Product, Branch } from '@prisma/client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function MenuUI({ branch, products }: { branch: Branch, products: Product[] }) {
  const { cart, addToCart, cartTotal } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('Coffee');

  const categories = Array.from(new Set(products.map(p => p.category)));

  const getFilteredProducts = () => products.filter(p => p.category === activeCategory);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.branchHeader}>
          <Link href="/" className={styles.backButton}>‹</Link>
          <div>
            <h2>{branch.name}</h2>
            <p className={styles.categoryPills}>Menü</p>
          </div>
        </div>
      </header>

      <div className={styles.categories}>
        {categories.map(cat => (
          <button 
            key={cat} 
            className={cat === activeCategory ? styles.activeCategory : styles.categoryBtn}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className={styles.productGrid}>
        {getFilteredProducts().map(product => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productInfo}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <span className={styles.price}>{product.price} TL</span>
            </div>
            <button className={styles.addBtn} onClick={() => addToCart(product)}>+</button>
          </div>
        ))}
      </main>

      {cart.length > 0 && (
        <div className={styles.floatingCart}>
          <div className={styles.cartInfo}>
            <span className={styles.badge}>{cartItemCount} Ürün</span>
            <span className={styles.total}>{cartTotal} TL</span>
          </div>
          <Link href={`/${branch.id}/checkout`} className={styles.checkoutBtn}>
            Sepete Git
          </Link>
        </div>
      )}
    </div>
  );
}
