"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FilterSection, FilterGroup } from '@/components/filters/FilterSection';
import { MultiSelectFilter } from '@/components/filters/MultiSelectFilter';
import { Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TablePagination } from '@/components/shared/TablePagination';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useWithdrawals, WithdrawalFilters } from '@/hooks/useWithdrawals';
import type { Withdrawal } from '@/types';

export default function WithdrawalsPage() {
  const router = useRouter();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Monta os filtros para o hook
  const filters: WithdrawalFilters = useMemo(() => {
    const f: WithdrawalFilters = {
      page: currentPage,
      limit: pageSize,
    };
    if (selectedStatuses.length > 0) {
      f.status = selectedStatuses[0];
    }
    return f;
  }, [selectedStatuses, currentPage, pageSize]);

  // Usa o hook React Query
  const { data, isLoading: loading } = useWithdrawals(filters);
  const withdrawals = data?.data ?? [];
  const pagination = data?.pagination;

  const handleCopyId = async (withdrawalId: string) => {
    try {
      // Tentativa principal com Clipboard API moderna
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(withdrawalId);
        toast.success('ID copiado para a área de transferência');
        return;
      }

      // Fallback para ambientes sem HTTPS ou sem Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = withdrawalId;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        toast.success('ID copiado para a área de transferência');
      } else {
        throw new Error('Falha ao copiar');
      }
    } catch {
      toast.error('Não foi possível copiar o ID');
    }
  };

  const handleStatusChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getProcessedAt = (withdrawal: Withdrawal) => {
    const processedAt = withdrawal.approved_at ?? withdrawal.rejected_at;
    return processedAt ? formatDate(processedAt) : '-';
  };

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'rejected', label: 'Rejeitado' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#20304c] mb-2">Saques</h1>
        <p className="text-lg text-[#20304c]">Visualize todos os saques solicitados na plataforma</p>
      </div>

      <FilterSection>
        <FilterGroup label="Status">
          <MultiSelectFilter
            options={statusOptions}
            placeholder="Todos"
            onSelectionChange={handleStatusChange}
          />
        </FilterGroup>
      </FilterSection>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Saques ({pagination?.total_count ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              {withdrawals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhum saque encontrado</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-100">
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Data</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Usuário</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Valor</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Chave PIX</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Status</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">Processado em</TableHead>
                        <TableHead className="text-base font-bold text-gray-900 px-6 py-3">ID do saque</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((withdrawal, index) => (
                        <TableRow key={withdrawal.id} className={index % 2 === 1 ? "bg-[#f5f9fe]" : "bg-white"}>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {formatDate(withdrawal.requested_at)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {withdrawal.user ? (
                              <div>
                                <div>{withdrawal.user.name}</div>
                                <div className="text-xs text-muted-foreground">{withdrawal.user.email}</div>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/users/${withdrawal.user_id}`)}
                                className="text-primary hover:text-primary hover:bg-primary/10 font-mono text-xs"
                                title={withdrawal.user_id}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                {withdrawal.user_id.slice(0, 8)}…
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {formatCurrency(withdrawal.amount)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="font-mono text-sm block max-w-xs truncate" title={withdrawal.pix_key}>
                              {withdrawal.pix_key}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span title={withdrawal.status === 'rejected' && withdrawal.reason ? withdrawal.reason : undefined}>
                              <StatusBadge status={withdrawal.status} type="withdrawal" />
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            {getProcessedAt(withdrawal)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => handleCopyId(withdrawal.id)}
                              className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline text-left"
                            >
                              {withdrawal.id}
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <TablePagination
                currentPage={pagination?.page ?? currentPage}
                totalPages={pagination?.total_pages ?? 1}
                pageSize={pagination?.limit ?? pageSize}
                totalCount={pagination?.total_count}
                hasNext={pagination?.has_next}
                hasPrev={pagination?.has_prev}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
