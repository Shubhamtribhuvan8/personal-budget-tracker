"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { PlusIcon } from "lucide-react"
import Label from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { transactionService } from '../apis/transactionService'

export function TransactionDialog({ open, onOpenChange, transaction, onTransactionSaved }) {
  const [type, setType] = useState("expense")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Reset form when dialog opens or transaction changes
  useEffect(() => {
    if (transaction) {
      // Edit mode - populate form with transaction data
      setType(transaction.type || "expense")
      setAmount(transaction.amount || "")
      setDate(transaction.date || new Date().toISOString().split("T")[0])
      setCategory(transaction.category?.name || "")
      setDescription(transaction.description || "")
    } else {
      // Add mode - reset form
      setType("expense")
      setAmount("")
      setDate(new Date().toISOString().split("T")[0])
      setCategory("")
      setDescription("")
    }
    setError("")
  }, [transaction, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const transactionData = {
        amount: parseFloat(amount),
        description,
        type,
        categoryName: category,
        date,
      }

      let response

      if (transaction) {
        // Update existing transaction
        response = await transactionService.updateTransaction(
          transaction.id, 
          transactionData
        )
      } else {
        // Create new transaction
        response = await transactionService.createTransaction(
          transactionData.amount,
          transactionData.description,
          transactionData.type,
          transactionData.categoryName,
          transactionData.date
        )
      }

      if (response?.success && response?.data) {
        // Format the response data to match our component's expected structure
        const formattedTransaction = {
          id: response.data.id || response.data._id,
          amount: parseFloat(response.data.amount),
          description: response.data.description,
          type: response.data.type,
          date: response.data.date,
          category: {
            name: response.data.category?.name || category
          }
        }

        // Notify parent component of successful save
        onTransactionSaved(formattedTransaction, !!transaction)
        
        // Reset form and close dialog
        resetForm()
      } else {
        setError(response?.message || "Failed to save transaction")
      }
    } catch (err) {
      console.error("Transaction save error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setType("expense")
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])
    setCategory("")
    setDescription("")
    setError("")
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
            <DialogDescription>
              {transaction ? "Make changes to your transaction here." : "Add a new transaction to your budget tracker."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-rose-50 text-rose-700 p-2 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {type === "income" ? (
                    <>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Investments">Investments</SelectItem>
                      <SelectItem value="Gifts">Gifts</SelectItem>
                      <SelectItem value="Other">Other Income</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Housing">Housing</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Other">Other Expense</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter transaction details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}