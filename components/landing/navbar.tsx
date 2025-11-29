'use client';

import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full  backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">ChatBot SaaS</span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
