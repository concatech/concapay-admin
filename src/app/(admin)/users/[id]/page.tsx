"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Clock, KeyRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TablePagination } from '@/components/shared/TablePagination';
import { useRouter, useParams } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/services/api';
import {
  useUserBalance,
  useUserTransactions,
  useUserPendingFunds,
  UserTransactionFilters,
  UserPendingFundFilters,
} from '@/hooks/useUsers';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [txPage, setTxPage] = useState(1);
  const [txPageSize, setTxPageSize] = useState(25);
  const [pfPage, setPfPage] = useState(1);
  const [pfPageSize, setPfPageSize] = useState(25);

  const txFilters: UserTransactionFilters = useMemo(() => ({
    page: txPage,
    limit: txPageSize,
  }), [txPage, txPageSize]);

  const pfFilters: UserPendingFundFilters = useMemo(() => ({
    page: pfPage,
    limit: pfPageSize,
  }), [pfPage, pfPageSize]);

  const { data: balance, isLoading: balanceLoading } = useUserBalance(userId);
  const { data: txData, isLoading: txLoading } = useUserTransactions(userId, txFilters);
  const { data: pfData, isLoading: pfLoading } = useUserPendingFunds(userId, pfFilters);

  const transactions = txData?.data ?? [];
  const txPagination = txData?.pagination;
  const pendingFunds = pfData?.data ?? [];
  const pfPagination = pfData?.pagination;
  const loading = balanceLoading;

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);

  const passwordValid = resetPassword.length >= 6
    && /[A-Z]/.test(resetPassword)
    && /[a-z]/.test(resetPassword)
    && /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(resetPassword);

  const handleResetPassword = async () => {
    if (!resetEmail || !passwordValid) return;
    setResetSubmitting(true);
    try {
      await api.resetUserPassword(resetEmail, resetPassword);
      toast.success('Senha redefinida com sucesso');
      setResetDialogOpen(false);
      setResetEmail('');
      setResetPassword('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao redefinir senha';
      toast.error(message);
    } finally {
      setResetSubmitting(false);
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
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => router.push('/users')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button variant="outline" onClick={() => setResetDialogOpen(true)}>
          <KeyRound className="w-4 h-4 mr-2" />
          Redefinir Senha
        </Button>
      </div>

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
              <CardTitle>Histórico de Transações ({txPagination?.total_count ?? 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {txLoading ? (
                <div className="space-y-2 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhuma transação encontrada</div>
              ) : (
                <>
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
                  <TablePagination
                    currentPage={txPagination?.page ?? txPage}
                    totalPages={txPagination?.total_pages ?? 1}
                    pageSize={txPagination?.limit ?? txPageSize}
                    totalCount={txPagination?.total_count}
                    hasNext={txPagination?.has_next}
                    hasPrev={txPagination?.has_prev}
                    onPageChange={setTxPage}
                    onPageSizeChange={(size) => { setTxPageSize(size); setTxPage(1); }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-funds">
          <Card>
            <CardHeader>
              <CardTitle>Fundos Pendentes ({pfPagination?.total_count ?? 0})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {pfLoading ? (
                <div className="space-y-2 p-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : pendingFunds.length === 0 ? (
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
                      {pendingFunds.map((fund) => {
                        if (!fund?.id) return null;
                        return (
                          <TableRow key={fund.id}>
                            <TableCell className="font-mono text-xs">
                              {fund.order_id ? `${String(fund.order_id).substring(0, 8)}...` : '-'}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={fund.status ?? 'pending'} type="fund" />
                            </TableCell>
                            <TableCell>{fund.created_at ? formatDate(fund.created_at) : '-'}</TableCell>
                            <TableCell>{fund.release_at ? formatDate(fund.release_at) : '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{fund.release_at ? getReleaseDate(fund.release_at) : '-'}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="text-orange-600">{formatCurrency(fund.amount ?? '0')}</span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <TablePagination
                    currentPage={pfPagination?.page ?? pfPage}
                    totalPages={pfPagination?.total_pages ?? 1}
                    pageSize={pfPagination?.limit ?? pfPageSize}
                    totalCount={pfPagination?.total_count}
                    hasNext={pfPagination?.has_next}
                    hasPrev={pfPagination?.has_prev}
                    onPageChange={setPfPage}
                    onPageSizeChange={(size) => { setPfPageSize(size); setPfPage(1); }}
                  />
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg m-4">
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

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir Senha do Usuário</DialogTitle>
            <DialogDescription>
              Insira o email do usuário e a nova senha. A senha deve ter no mínimo 6 caracteres, 1 maiúscula, 1 minúscula e 1 número/símbolo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reset-email">Email do Usuário</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="usuario@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reset-password">Nova Senha</Label>
              <Input
                id="reset-password"
                type="password"
                placeholder="Nova senha..."
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="mt-1"
              />
              {resetPassword && !passwordValid && (
                <p className="text-xs text-red-500 mt-1">
                  Mínimo 6 caracteres, 1 maiúscula, 1 minúscula e 1 número/símbolo.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)} disabled={resetSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={!resetEmail || !passwordValid || resetSubmitting}
            >
              {resetSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

