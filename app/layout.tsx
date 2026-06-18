import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TOTEM Flow — Gestión de Proyectos',
  description: 'Plataforma de gestión automatizada de proyectos con checklist dinámico',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-archivo antialiased">{children}</body>
    </html>
  );
}
