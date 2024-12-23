'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription,
  SheetClose 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  items: NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label="Open menu"
          className="md:hidden transition-transform duration-200 ease-in-out hover:scale-105"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[80vw] max-w-sm p-0 transition-transform duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
      >
        <SheetHeader className="px-4 pt-4 transition-opacity duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Access all available pages</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full py-6">
          <nav className="space-y-2 px-4" role="navigation">
            <div className="scroll-smooth" data-radix-scroll-area-viewport>
              {items.map((item) => (
                <SheetClose key={item.href} asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start transition-colors duration-200 ease-in-out hover:bg-accent/80"
                    onClick={() => handleNavigate(item.href)}
                    asChild
                  >
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  </Button>
                </SheetClose>
              ))}
            </div>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
