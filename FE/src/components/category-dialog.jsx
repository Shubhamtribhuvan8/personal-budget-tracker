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
import Label  from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { categoryService } from "../apis/categoryService"
// import { useToast } from "./ui/use-toast"

export function CategoryDialog({ open, onOpenChange, category, onCategoryChange }) {
  // const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    color: "#10b981",
    isActive: true
  })

  // Initialize form with category data when editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        type: category.type || "expense",
        color: category.color || "#10b981",
        isActive: category.isActive !== false // Default to true if not specified
      })
    } else {
      // Reset form when adding new category
      setFormData({
        name: "",
        type: "expense",
        color: "#10b981",
        isActive: true
      })
    }
  }, [category, open])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      // toast({
      //   title: "Validation Error",
      //   description: "Category name is required",
      //   variant: "destructive"
      // })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      let response
      
      if (category?.id) {
        // Update existing category
        response = await categoryService.updateCategory(
          category.id, 
          formData.name, 
          formData.color,
          formData.isActive
        )
      } else {
        // Create new category
        response = await categoryService.createCategory(
          formData.name,
          formData.type,
          formData.color,
          formData.isActive
        )
      }
      
      if (response.success) {
        // toast({
        //   title: category ? "Category Updated" : "Category Created",
        //   description: `Successfully ${category ? "updated" : "created"} category "${formData.name}"`,
        // })
        
        // Notify parent component that a category was added/updated
        if (onCategoryChange) {
          onCategoryChange(response.data)
        }
        
        onOpenChange(false)
      } else {
        // toast({
        //   title: "Error",
        //   description: response.message || "An error occurred",
        //   variant: "destructive"
        // })
      }
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to save category",
      //   variant: "destructive"
      // })
      console.error("Category save error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {category ? "Make changes to your category here." : "Create a new category for your transactions."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input 
                id="name" 
                placeholder="Enter category name" 
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                disabled={!!category} // Disable type change when editing
              >
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
              <Label htmlFor="color">Color</Label>
              <Select 
                value={formData.color}
                onValueChange={(value) => handleChange("color", value)}
              >
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#10b981">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-emerald-500" />
                      <span>Green</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="#3b82f6">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500" />
                      <span>Blue</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="#6366f1">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-indigo-500" />
                      <span>Indigo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="#8b5cf6">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-purple-500" />
                      <span>Purple</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="#ec4899">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-pink-500" />
                      <span>Pink</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="#f43f5e">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-rose-500" />
                      <span>Red</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="#f97316">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-orange-500" />
                      <span>Orange</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="#eab308">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-yellow-500" />
                      <span>Yellow</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
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