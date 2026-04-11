import { prisma } from '../lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const branches = await prisma.branch.findMany();

  return (
    <main className={styles.container}>
      <div style={{ textAlign: 'center' }}>
        <h1 className={styles.brand}>Coffy<span>Clone</span></h1>
        <p className={styles.subtitle}>Sana en yakın şubeyi seç</p>
      </div>

      <div className={styles.branchGrid}>
        {branches.map(branch => (
          <Link href={`/${branch.id}/menu`} key={branch.id} className={styles.branchCard}>
            <div className={styles.branchInfo}>
              <h3>{branch.name}</h3>
              <p>{branch.address}</p>
            </div>
            <div className={styles.chevron}>›</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
