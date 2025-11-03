import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FilterSectionProps {
  children: ReactNode;
}

export function FilterSection({ children }: FilterSectionProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-end gap-4">{children}</div>
      </CardContent>
    </Card>
  );
}

interface FilterGroupProps {
  label: string;
  children: ReactNode;
}

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="flex-1 min-w-[200px]">
      <label className="text-sm text-muted-foreground mb-2 block">{label}</label>
      {children}
    </div>
  );
}

