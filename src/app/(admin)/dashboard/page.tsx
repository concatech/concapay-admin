"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardData } from '@/types';
import { api } from '@/services/api';
import { Users, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterSection, FilterGroup } from '@/components/filters/FilterSection';
import { DateRangeFilter } from '@/components/filters/DateRangeFilter';
import { format } from 'date-fns';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (startDate) {
        filters.start_date = format(startDate, 'yyyy-MM-dd');
      }
      if (endDate) {
        filters.end_date = format(endDate, 'yyyy-MM-dd');
      }
      const dashboardData = await api.getDashboard(filters);
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Definir dados padrão em caso de erro para desenvolvimento
      setData({
        active_users: 0,
        generated_at: new Date().toISOString(),
        pending_contests_amount: '0.00',
        pending_contests_count: 0,
        total_commission: '0.00',
        total_orders: 0,
        total_pending_funds: '0.00',
        gmv: '0.00',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Erro ao carregar dados</p>
          <p className="text-red-600 text-sm mt-1">
            Verifique se os tokens de autenticação estão configurados corretamente no localStorage.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'GMV - Valor das Vendas',
      value: formatCurrency(data.gmv || '0'),
      description: 'Gross Merchandise Value',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total de Vendas',
      value: data.total_orders.toString(),
      description: 'Pedidos processados',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Usuários Ativos',
      value: data.active_users.toString(),
      description: 'Com vendas aprovadas nos últimos 30 dias',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Comissões Totais',
      value: formatCurrency(data.total_commission),
      description: 'Comissões acumuladas',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Fundos Pendentes',
      value: formatCurrency(data.total_pending_funds),
      description: 'Bloqueados aguardando liberação',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Contestações Pendentes',
      value: data.pending_contests_count.toString(),
      description: `${data.pending_contests_count} solicitações`,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Valor Contestado',
      value: formatCurrency(data.pending_contests_amount),
      description: 'Aguardando análise',
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Visão Geral</h1>
        <p className="text-muted-foreground">Atualizado em {formatDateTime(data.generated_at)}</p>
      </div>

      <FilterSection>
        <FilterGroup label="Filtrar por Período">
          <DateRangeFilter onDateChange={handleDateChange} />
        </FilterGroup>
      </FilterSection>

      {(startDate || endDate) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            📊 Exibindo dados {startDate && endDate
              ? `de ${format(startDate, 'dd/MM/yyyy')} até ${format(endDate, 'dd/MM/yyyy')}`
              : startDate
              ? `a partir de ${format(startDate, 'dd/MM/yyyy')}`
              : endDate
              ? `até ${format(endDate, 'dd/MM/yyyy')}`
              : ''}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">GMV (Gross Merchandise Value):</span> Valor bruto total de
              todas as vendas processadas
            </p>
            <p>
              <span className="text-muted-foreground">Fundos bloqueados:</span> Valores retidos por até 8 dias após a
              compra aprovada
            </p>
            <p>
              <span className="text-muted-foreground">Contestações:</span> Solicitações de cancelamento feitas por
              compradores
            </p>
            <p>
              <span className="text-muted-foreground">Usuários ativos:</span> Vendedores com pelo menos uma venda aprovada
              nos últimos 30 dias
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

