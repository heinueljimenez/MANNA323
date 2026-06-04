import './globals.css';

export const metadata = {
  title: 'Manna Studio',
  description: 'Autenticación y perfiles con Supabase para Manna Studio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
