import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'contest' | 'fund' | 'webhook';
}

export function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    const statusLower = status?.toLowerCase() ?? 'nao veio';

    // Order statuses
    if (type === 'order') {
      switch (statusLower) {
        case 'paid':
          return { label: 'Aprovado', variant: 'default' as const, icon: Check, className: 'bg-green-500 hover:bg-green-600 text-white' };
        case 'pending':
          return { label: 'Pendente', variant: 'secondary' as const, icon: Clock, className: 'bg-amber-500 hover:bg-amber-600 text-white' };
        case 'refunded':
          return { label: 'Reembolsado', variant: 'destructive' as const, icon: X, className: '' };
        case 'expired':
          return { label: 'Expirado', variant: 'outline' as const, icon: X, className: 'border-gray-300 text-gray-600' };
        default:
          return { label: status, variant: 'outline' as const, icon: AlertCircle, className: '' };
      }
    }

    // Contest statuses
    if (type === 'contest') {
      switch (statusLower) {
        case 'pending':
          return { label: 'Pendente', variant: 'secondary' as const, icon: Clock, className: 'bg-amber-500 hover:bg-amber-600 text-white' };
        case 'approved':
          return { label: 'Aprovado', variant: 'default' as const, icon: Check, className: 'bg-green-500 hover:bg-green-600 text-white' };
        case 'rejected':
          return { label: 'Rejeitado', variant: 'destructive' as const, icon: X, className: '' };
        default:
          return { label: status, variant: 'outline' as const, icon: AlertCircle, className: '' };
      }
    }

    // Fund statuses
    if (type === 'fund') {
      switch (statusLower) {
        case 'pending':
          return { label: 'Pendente', variant: 'secondary' as const, icon: Clock, className: 'bg-amber-500 hover:bg-amber-600 text-white' };
        case 'released':
          return { label: 'Liberado', variant: 'default' as const, icon: Check, className: 'bg-green-500 hover:bg-green-600 text-white' };
        case 'cancelled':
          return { label: 'Cancelado', variant: 'destructive' as const, icon: X, className: '' };
        case 'contested':
          return { label: 'Contestado', variant: 'outline' as const, icon: AlertCircle, className: 'border-orange-500 text-orange-600 bg-orange-50' };
        default:
          return { label: status, variant: 'outline' as const, icon: AlertCircle, className: '' };
      }
    }

    // Webhook statuses
    if (type === 'webhook') {
      switch (statusLower) {
        case 'processed':
          return { label: 'Processado', variant: 'default' as const, icon: Check, className: 'bg-green-500 hover:bg-green-600 text-white' };
        case 'action_required':
          return { label: 'Ação Necessária', variant: 'secondary' as const, icon: AlertCircle, className: 'bg-amber-500 hover:bg-amber-600 text-white' };
        case 'failed':
          return { label: 'Falhou', variant: 'destructive' as const, icon: X, className: '' };
        default:
          return { label: status, variant: 'outline' as const, icon: AlertCircle, className: '' };
      }
    }

    return { label: status, variant: 'outline' as const, icon: AlertCircle, className: '' };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`gap-1 ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

