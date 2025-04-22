
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import {Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider} from '@/components/ui/sidebar';
import Link from 'next/link';
import {Icons} from '@/components/icons';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              VioletNotes
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Icons.home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/about">
                      <Icons.help className="mr-2 h-4 w-4" />
                      <span>About</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* Add more navigation links here */}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4">
            {children}
          </main>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

