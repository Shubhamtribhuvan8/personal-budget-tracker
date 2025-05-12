"use client"

import { useState, useEffect } from "react"
import { EditIcon, Trash2Icon, PlusIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { CategoryDialog } from "./category-dialog"
import { categoryService } from '../apis/categoryService'
// import { useToast } from "./ui/use-toast"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

export function CategoriesList() {
  // const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [editCategory, setEditCategory] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await categoryService.getCategories()
      if (response.success) {
        setCategories(response?.data?.categories)
      } else {
        // toast({
        //   title: "Error",
        //   description: response.message || "Failed to fetch categories",
        //   variant: "destructive"
        // })
      }
    } catch (error) {
      console.error("Fetch categories error:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to load categories",
      //   variant: "destructive"
      // })
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((category) =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenDialog = (category = null) => {
    setEditCategory(category)
    setDialogOpen(true)
  }

  const handleConfirmDelete = (category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!categoryToDelete) return
    
    try {
      const response = await categoryService.deleteCategory(categoryToDelete.id)
      
      if (response.success) {
        // toast({
        //   title: "Category Deleted",
        //   description: `Successfully deleted category "${categoryToDelete.name}"`
        // })
        
        // Update local state to remove deleted category
        setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id))
      } else {
        // toast({
        //   title: "Error",
        //   description: response.message || "Failed to delete category",
        //   variant: "destructive"
        // })
      }
    } catch (error) {
      console.error("Delete category error:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to delete category",
      //   variant: "destructive"
      // })
    } finally {
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const handleCategoryChange = (updatedCategory) => {
    // Update local state after successful create/update
    if (editCategory) {
      // Update existing category
      setCategories(prev => 
        prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
      )
    } else {
      // Add new category
      setCategories(prev => [...prev, updatedCategory])
    }
    
    // Clear edit state
    setEditCategory(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>View and manage your transaction categories</CardDescription>
          </div>

          <Button onClick={() => handleOpenDialog()} className="ml-auto" style={{ backgroundColor: 'gray', border: '1px solid blue' }}>
          <PlusIcon className="h-4 w-4" />
            Add Category
          </Button>
        </div>
        <div className="mt-4">
          <Input
            type="search"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={category.type === "income" ? "outline" : "secondary"}
                        className={
                          category.type === "income"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-50 hover:text-rose-700 dark:bg-rose-950 dark:text-rose-400 dark:hover:bg-rose-950 dark:hover:text-rose-400"
                        }
                      >
                        {category.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: category.color }} 
                        />
                        <span>{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive !== false ? "default" : "outline"}>
                        {category.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleConfirmDelete(category)}
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
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Category Dialog for Add/Edit */}
      <CategoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        category={editCategory} 
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent style={{ backgroundColor: 'gray' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{categoryToDelete?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}