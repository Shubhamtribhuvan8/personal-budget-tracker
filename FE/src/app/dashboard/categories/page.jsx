import { CategoriesHeader } from "../../../components/categories-header"
import { CategoriesList } from "../../../components/categories-list"

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen w-full p-6">
      <div className="w-full space-y-6 px-4">
      <CategoriesHeader />
      <CategoriesList />
    </div>
    </div>
  )
}
