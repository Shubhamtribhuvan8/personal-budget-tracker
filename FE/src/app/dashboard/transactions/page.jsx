import { TransactionsHeader } from "../../../components/transactions-header"
import { TransactionsList } from "../../../components/transactions-list"

export default function TransactionsPage() {
  
  return (
    <div className="flex min-h-screen w-full p-6">
      <div className="w-full space-y-6 px-4">
        <TransactionsHeader />
        <TransactionsList />
      </div>
    </div>
  )
}
