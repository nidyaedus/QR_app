import './globals.css';
import { CartProvider } from './context/CartContext';

export const metadata = {
  title: 'Coffy Clone - Portfolio Project',
  description: 'Premium coffee ordering mobile web application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
