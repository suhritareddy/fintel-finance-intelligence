"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { bulkDeleteTransactions } from "@/actions/accounts";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export default function TransactionTable({ transactions }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchLower) ||
          t.category?.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (recurringFilter) {
      result = result.filter((t) => {
        if (recurringFilter === "recurring") return t.isRecurring;
        return !t.isRecurring;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#10B981" />
      )}

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 bg-emerald-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] bg-emerald-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-emerald-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] bg-emerald-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className="bg-emerald-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete ({selectedIds.length})
            </Button>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              className="bg-emerald-50 dark:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">

            <TableHeader>
              <TableRow className="bg-emerald-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">

                <TableHead className="w-[40px] bg-emerald-50 dark:bg-slate-800">
                  <Checkbox
                    checked={
                      selectedIds.length === paginatedTransactions.length &&
                      paginatedTransactions.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    className="border-gray-400 dark:border-gray-500"
                  />
                </TableHead>

                <TableHead
                  className="cursor-pointer bg-emerald-50 dark:bg-slate-800"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center font-semibold text-slate-800 dark:text-slate-100">
                    Date
                    {sortConfig.field === "date" ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : null}
                  </div>
                </TableHead>

                <TableHead className="bg-emerald-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100">
                  Description
                </TableHead>

                <TableHead
                  className="cursor-pointer bg-emerald-50 dark:bg-slate-800"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center font-semibold text-slate-800 dark:text-slate-100">
                    Category
                    {sortConfig.field === "category" ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : null}
                  </div>
                </TableHead>

                <TableHead
                  className="cursor-pointer text-right bg-emerald-50 dark:bg-slate-800"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center justify-end font-semibold text-slate-800 dark:text-slate-100">
                    Amount
                    {sortConfig.field === "amount" ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : null}
                  </div>
                </TableHead>

                <TableHead className="bg-emerald-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100">
                  Recurring
                </TableHead>

                <TableHead className="w-[40px] bg-emerald-50 dark:bg-slate-800" />

              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-slate-500 dark:text-slate-400"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-emerald-100/40 dark:hover:bg-slate-700/60 transition-colors border-slate-200 dark:border-slate-700"
                  >

                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(transaction.id)}
                        onCheckedChange={() => handleSelect(transaction.id)}
                        className="border-gray-400 dark:border-gray-500"
                      />
                    </TableCell>

                    <TableCell className="text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {format(new Date(transaction.date), "PP")}
                    </TableCell>

                    <TableCell className="text-slate-700 dark:text-slate-200 max-w-[180px] truncate">
                      {transaction.description}
                    </TableCell>

                    <TableCell className="capitalize">
                      <span
                        className={`inline-flex items-center justify-center
                        w-24 px-2 py-1 text-xs font-medium rounded-md text-white truncate
                        ${transaction.type === "EXPENSE"
                            ? "bg-gradient-to-r from-red-400 to-red-600"
                            : "bg-gradient-to-r from-emerald-400 to-emerald-600"
                          }`}
                      >
                        {transaction.category}
                      </span>
                    </TableCell>

                    <TableCell
                      className={cn(
                        "text-right font-medium whitespace-nowrap",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-emerald-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"}₹
                      {transaction.amount.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {transaction.isRecurring ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge
                                className="gap-1 bg-emerald-100 text-emerald-700
                                dark:bg-emerald-900/40 dark:text-emerald-300
                                hover:bg-emerald-200 dark:hover:bg-emerald-900/60
                                transition-colors whitespace-nowrap"
                              >
                                <RefreshCw className="h-3 w-3" />
                                {RECURRING_INTERVALS[transaction.recurringInterval]}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <div className="font-medium">Next Date:</div>
                                <div>
                                  {format(
                                    new Date(transaction.nextRecurringDate),
                                    "PPP"
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-slate-700 dark:text-slate-300 border border-emerald-200/50 dark:border-emerald-500/20">
                          <Clock className="h-3 w-3 mr-1" />
                          One-time
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/transaction/create?edit=${transaction.id}`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => deleteFn([transaction.id])}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-slate-200 dark:border-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-slate-200 dark:border-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}