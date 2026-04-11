import Link from 'next/link';

export default function SuccessPage({ params, searchParams }: { params: { branchId: string }, searchParams: { orderId: string, stamps: string } }) {
  const stamps = parseInt(searchParams.stamps || '0', 10);
  const isFreeCoffeeNext = stamps >= 10;
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
      <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Siparişiniz Alındı!</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Sipariş No: #{searchParams.orderId.slice(-6).toUpperCase()}</p>
      
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', width: '100%', maxWidth: '400px' }}>
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
              {i < stamps && <span style={{color: 'white', fontSize: '12px'}}>✓</span>}
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {stamps} / 10 Damga
          {isFreeCoffeeNext && <span style={{display: 'block', color: 'var(--success)', fontWeight:'bold', marginTop:'0.5rem'}}>Tebrikler! Bir sonraki kahveniz bizden! ☕</span>}
        </p>
      </div>

      <Link 
        href={`/${params.branchId}/menu`}
        style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 'bold' }}
      >
        Menüye Dön
      </Link>
    </div>
  );
}
