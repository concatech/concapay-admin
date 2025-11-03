"use client";

import { useEffect, useState } from 'react';
import { Contest } from '@/types';
import { api } from '@/services/api';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, Check, X, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { TablePagination } from '@/components/shared/TablePagination';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | 'view'>('view');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadContests();
  }, [selectedStatuses, currentPage, pageSize]);

  const loadContests = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (selectedStatuses.length > 0) {
        filters.status = selectedStatuses[0];
      }
      const data = await api.getContests(filters);
      setContests(data.contests);
      setTotalItems(data.total || (data.contests?.length ?? 0));
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedContests = contests?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? [];

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'rejected', label: 'Rejeitado' },
  ];

  const handleOpenDialog = (contest: Contest, type: 'approve' | 'reject' | 'view') => {
    setSelectedContest(contest);
    setDialogType(type);
    setAdminNotes('');
    setDialogOpen(true);
  };

  const handleSubmitDecision = async () => {
    if (!selectedContest) return;

    setSubmitting(true);
    try {
      if (dialogType === 'approve') {
        await api.approveContest(selectedContest.id, adminNotes);
        toast.success('Contestação aprovada com sucesso');
      } else if (dialogType === 'reject') {
        await api.rejectContest(selectedContest.id, adminNotes);
        toast.success('Contestação rejeitada com sucesso');
      }
      setDialogOpen(false);
      loadContests();
    } catch (error) {
      console.error('Error processing contest:', error);
      toast.error('Erro ao processar contestação');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Contestações</h1>
        <p className="text-muted-foreground">Gerencie solicitações de cancelamento de compras</p>
      </div>

      <FilterSection>
        <FilterGroup label="Status">
          <MultiSelectFilter
            options={statusOptions}
            placeholder="Todos"
            onSelectionChange={setSelectedStatuses}
          />
        </FilterGroup>
      </FilterSection>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contestações ({totalItems})</CardTitle>
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
              {contests?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma contestação encontrada</div>
              ) : (
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContests.map((contest) => (
                    <TableRow key={contest.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(contest.created_at)}</TableCell>
                      <TableCell>
                        <div>
                          <div>{contest.user.name}</div>
                          <div className="text-xs text-muted-foreground">{contest.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{contest.reason}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatCurrency(contest.pending_fund.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={contest.status} type="contest" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(contest, 'view')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {contest.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(contest, 'approve')}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(contest, 'reject')}
                                className="text-destructive hover:text-destructive hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'approve'
                ? 'Aprovar Contestação'
                : dialogType === 'reject'
                ? 'Rejeitar Contestação'
                : 'Detalhes da Contestação'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'view' && 'Informações completas sobre a contestação'}
              {dialogType === 'approve' &&
                'Ao aprovar, os fundos serão devolvidos ao comprador'}
              {dialogType === 'reject' &&
                'Ao rejeitar, os fundos permanecerão com o vendedor'}
            </DialogDescription>
          </DialogHeader>

          {selectedContest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Comprador</Label>
                  <p className="text-sm">{selectedContest?.user?.name ?? 'N/A'}</p>
                  <p className="text-xs text-gray-500">{selectedContest.user.email}</p>
                </div>
                <div>
                  <Label>Valor</Label>
                  <p className="text-sm">{formatCurrency(selectedContest?.pending_fund?.amount ?? 0)}</p>
                </div>
                <div>
                  <Label>Data da Contestação</Label>
                  <p className="text-sm">{formatDate(selectedContest.created_at)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge status={selectedContest.status} type="contest" />
                </div>
              </div>

              <div>
                <Label>Motivo da Contestação</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedContest.reason}</p>
              </div>

              <div>
                <Label>ID do Pedido</Label>
                <p className="text-sm text-gray-600">{selectedContest.pending_fund.order_id}</p>
              </div>

              {dialogType !== 'view' && (
                <div>
                  <Label htmlFor="admin-notes">Observações do Admin *</Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Digite suas observações sobre esta decisão..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>
              )}

              {selectedContest.admin_notes && (
                <div>
                  <Label>Observações Anteriores</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedContest.admin_notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
              {dialogType === 'view' ? 'Fechar' : 'Cancelar'}
            </Button>
            {dialogType !== 'view' && (
              <Button
                onClick={handleSubmitDecision}
                disabled={!adminNotes.trim() || submitting}
                className={
                  dialogType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-destructive hover:bg-destructive/90'
                }
              >
                {submitting ? 'Processando...' : dialogType === 'approve' ? 'Aprovar' : 'Rejeitar'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

