"use client"

import { useState, useEffect } from "react"
import { ArrowDownIcon, ArrowUpIcon, EditIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { TransactionDialog } from "./transaction-dialog"
import {transactionService} from '../apis/transactionService'

export function TransactionsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [editTransaction, setEditTransaction] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [transactionData, setTransactionData] = useState({ transactions: [], pagination: { totalDocs: 0 } })
  const [isLoading, setIsLoading] = useState(false)

  const getTransactions = async () => {
    setIsLoading(true)
    try {
      const res = await transactionService.getTransactions()
      if (res?.success && res?.data) {
        setTransactionData(res.data)
      } else {
        console.error("Failed to fetch transactions:", res?.message)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getTransactions()
  }, [])

  const filteredTransactions = transactionData?.transactions?.filter((transaction) => {
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "" || transaction.category?.name === categoryFilter
    const matchesType = typeFilter === "" || transaction.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  }) || []

  const handleEdit = (transaction) => {
    setEditTransaction(transaction)
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const res = await transactionService.deleteTransaction(id)
      if (res?.success) {
        // Update UI by removing the deleted transaction
        setTransactionData(prev => ({
          ...prev,
          transactions: prev.transactions.filter(t => t.id !== id),
          pagination: {
            ...prev.pagination,
            totalDocs: prev.pagination.totalDocs - 1
          }
        }))
        console.log("Transaction deleted successfully")
      } else {
        console.error("Failed to delete transaction:", res?.message)
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const handleTransactionSaved = (newTransaction, isEdit = false) => {
    if (isEdit) {
      // Update the existing transaction in the list
      setTransactionData(prev => ({
        ...prev,
        transactions: prev.transactions.map(t => 
          t.id === newTransaction.id ? newTransaction : t
        )
      }))
    } else {
      // Add the new transaction to the list
      setTransactionData(prev => ({
        ...prev,
        transactions: [newTransaction, ...prev.transactions],
        pagination: {
          ...prev.pagination,
          totalDocs: prev.pagination.totalDocs + 1
        }
      }))
    }
    
    // Reset the edit transaction and close the dialog
    setEditTransaction(null)
    setDialogOpen(false)
  }

  const handleAddNew = () => {
    setEditTransaction(null)
    setDialogOpen(true)
  }

  const uniqueCategories = Array.from(
    new Set(transactionData?.transactions?.map((t) => t.category?.name) || [])
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>View and manage all your transactions</CardDescription>
          </div>
          <Button variant="primary" onClick={handleAddNew} style={{ backgroundColor: 'gray', border: '1px solid blue' }}> <PlusIcon className="h-4 w-4" />Add Transaction</Button>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row mt-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.type === "income" ? "outline" : "secondary"}
                        className={
                          transaction.type === "income"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-50 hover:text-rose-700 dark:bg-rose-950 dark:text-rose-400 dark:hover:bg-rose-950 dark:hover:text-rose-400"
                        }
                      >
                        {transaction.category?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`flex items-center justify-end ${
                          transaction.type === "income"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpIcon className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="mr-1 h-4 w-4" />
                        )}
                        ${parseFloat(transaction.amount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-200 dark:bg-gray-700">
                            <span className="sr-only">Open menu</span>
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction.id)}
                            className="text-rose-600 dark:text-rose-400"
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium">{filteredTransactions.length}</span> of{" "}
            <span className="font-medium">{transactionData?.pagination?.totalDocs || 0}</span> transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
      {/* <Button onClick={() => setDialogOpen(true)} className="gap-1">
        <PlusIcon className="h-4 w-4" />
        Add Transaction
      </Button> */}
      <TransactionDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        transaction={editTransaction} 
        onTransactionSaved={handleTransactionSaved}
      />
    </Card>
  )
}