import Link from 'next/link'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <header className="flex justify-between items-center p-4 h-16 bg-gray-200">
            <nav>
              <Link href="/" className="text-lg font-bold">Главная</Link>
              <Link href="/tasks" className="ml-4 text-lg font-bold">Задачи</Link>
            </nav>
            <div>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
