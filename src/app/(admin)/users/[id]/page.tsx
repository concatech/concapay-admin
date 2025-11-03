"use client";

import { useEffect, useState } from 'react';
import { UserBalance, Transaction, PendingFund } from '@/types';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useRouter, useParams } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingFunds, setPendingFunds] = useState<PendingFund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [balanceData, transactionsData, pendingFundsData] = await Promise.all([
        api.getUserBalance(userId),
        api.getUserTransactions(userId),
        api.getUserPendingFunds(userId),
      ]);
      setBalance(balanceData);
      setTransactions(transactionsData);
      setPendingFunds(pendingFundsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      commission_deduction: 'Dedução de Comissão',
      funds_pending: 'Fundos Pendentes',
      funds_released: 'Fundos Liberados',
      withdrawal: 'Saque',
      commission_reversal: 'Reversão de Comissão',
      fund_cancellation: 'Cancelamento de Fundos',
      balance_adjustment: 'Ajuste de Saldo',
      contest_approval: 'Aprovação de Contestação',
    };
    return labels[type] || type;
  };

  const getReleaseDate = (releaseAt: string) => {
    const releaseDate = new Date(releaseAt);
    const now = new Date();
    const diffInMs = releaseDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Liberado';
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Amanhã';
    return `${diffInDays} dias`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!balance) {
    return <div className="p-6">Erro ao carregar dados do usuário</div>;
  }

  const balanceCards = [
    {
      title: 'Saldo Disponível',
      value: formatCurrency(balance.available_balance),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Saldo Pendente',
      value: formatCurrency(balance.pending_balance),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Saldo Contestado',
      value: formatCurrency(balance.contested_balance),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Saldo Total',
      value: formatCurrency(balance.total_balance),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.push('/users')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div>
        <h1 className="text-2xl mb-2">Detalhes do Usuário</h1>
        <p className="text-gray-600">ID: {userId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {balanceCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-gray-600">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="pending-funds">Fundos Pendentes</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhuma transação encontrada</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Pedido</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.inserted_at)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getTransactionTypeLabel(transaction.transaction_type)}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{transaction.order.payment_method}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              parseFloat(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                            }
                          >
                            {formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-funds">
          <Card>
            <CardHeader>
              <CardTitle>Fundos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingFunds.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum fundo pendente no momento
                </div>
              ) : (
                <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Data de Liberação</TableHead>
                      <TableHead>Tempo Restante</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFunds.map((fund) => (
                      <TableRow key={fund.id}>
                        <TableCell className="font-mono text-xs">{fund.order_id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          <StatusBadge status={fund.status} type="fund" />
                        </TableCell>
                        <TableCell>{formatDate(fund.created_at)}</TableCell>
                        <TableCell>{formatDate(fund.release_at)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getReleaseDate(fund.release_at)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-orange-600">{formatCurrency(fund.amount)}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Nota:</strong> Os fundos são bloqueados e liberados automaticamente após 8 dias da compra aprovada.
                  </p>
                </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

