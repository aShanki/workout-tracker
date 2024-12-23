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
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[80vw] max-w-sm p-0"
      >
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Access all available pages</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full py-6">
          <nav className="space-y-2 px-4">
            {items.map((item) => (
              <SheetClose key={item.href} asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate(item.href)}
                  asChild
                >
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </Button>
              </SheetClose>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
