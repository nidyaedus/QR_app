import Link from 'next/link';
import { prisma } from '@/lib/prisma';

function formatPrice(value: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(value);
}

export default async function SuccessPage({
  params,
  searchParams
}: {
  params: Promise<{ branchId: string }>;
  searchParams: Promise<{ orderId?: string; stamps?: string }>;
}) {
  const { branchId } = await params;
  const query = await searchParams;
  const order = query.orderId
    ? await prisma.order.findUnique({
        where: { id: query.orderId },
        include: { user: true }
      })
    : null;

  const stamps = parseInt(query.stamps || String(order?.user.stampCount || 0), 10);
  const isFreeCoffeeNext = stamps >= 10;
  const orderCode = order?.orderNumber || query.orderId?.slice(-6).toUpperCase() || '------';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
      <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Siparişiniz Alındı!</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Sipariş No: #{orderCode}</p>

      {order && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', width: '100%', maxWidth: '300px', display: 'grid', gap: '0.75rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#666' }}>Toplam</span>
            <strong style={{ textAlign: 'right', minWidth: 0 }}>{formatPrice(order.totalAmount)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#666' }}>Ödeme</span>
            <strong style={{ textAlign: 'right', minWidth: 0 }}>{order.paymentStatus === 'PAID' ? 'Ödendi' : 'Şubede ödenecek'}</strong>
          </div>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem', textAlign: 'center' }}>
            Siparişiniz barista ekranına düştü. Hazır olduğunda kasadan teslim alabilirsiniz.
          </p>
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', width: '100%', maxWidth: '300px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Sadakat Programı</h2>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: i < stamps ? 'var(--primary)' : 'var(--background)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {i < stamps && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {stamps} / 10 Damga
          {isFreeCoffeeNext && <span style={{ display: 'block', color: 'var(--success)', fontWeight: 'bold', marginTop: '0.5rem' }}>Tebrikler! Bir sonraki kahveniz bizden.</span>}
        </p>
      </div>

      <Link
        href={`/${branchId}/menu`}
        style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 'bold' }}
      >
        Menüye Dön
      </Link>
    </div>
  );
}
