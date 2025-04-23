"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, CalendarDays, ArrowDownUp, X, Download } from "lucide-react"

export interface ActivityFiltersProps {
  onFilterChange: (filters: any) => void
  onExport: () => void
}

export function ActivityFilters({ onFilterChange, onExport }: ActivityFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      const newFilters = [...activeFilters, filter]
      setActiveFilters(newFilters)
    }
  }

  const removeFilter = (filter: string) => {
    const newFilters = activeFilters.filter((f) => f !== filter)
    setActiveFilters(newFilters)
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm">Transaction Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pos" onCheckedChange={() => addFilter("POS")} />
                      <Label htmlFor="pos" className="text-sm">
                        POS Sales
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="invoice" onCheckedChange={() => addFilter("Invoice")} />
                      <Label htmlFor="invoice" className="text-sm">
                        Invoices
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 text-sm">Amount Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="min-amount" className="text-xs">
                        Min (USDC)
                      </Label>
                      <Input
                        id="min-amount"
                        type="number"
                        placeholder="0"
                        className="h-8"
                        onChange={() => addFilter("Amount")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-amount" className="text-xs">
                        Max (USDC)
                      </Label>
                      <Input id="max-amount" type="number" placeholder="1000" className="h-8" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 text-sm">Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="confirmed" defaultChecked onCheckedChange={() => addFilter("Status")} />
                      <Label htmlFor="confirmed" className="text-sm">
                        Confirmed
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pending" defaultChecked />
                      <Label htmlFor="pending" className="text-sm">
                        Pending
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 text-sm">Network</h4>
                  <Select onValueChange={() => addFilter("Network")}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="All Networks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blockdag">BlockDAG (Demo)</SelectItem>
                      <SelectItem value="celo">Celo</SelectItem>
                      <SelectItem value="all">All Networks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 text-sm">Tags</h4>
                  <Select onValueChange={() => addFilter("Tag")}>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="custom">Custom...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={() => onFilterChange(activeFilters)}>
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Date Range</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" numberOfMonths={2} onSelect={() => addFilter("Date Range")} />
              <div className="p-3 border-t">
                <Button size="sm" className="w-full" onClick={() => onFilterChange(activeFilters)}>
                  Apply Date Range
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ArrowDownUp className="h-3.5 w-3.5" />
                <span>Sort</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <div className="space-y-2">
                <div className="font-medium text-sm mb-2">Sort By</div>
                <div className="grid gap-1.5">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sort-date" defaultChecked />
                    <Label htmlFor="sort-date" className="text-sm">
                      Date (Newest First)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sort-amount" />
                    <Label htmlFor="sort-amount" className="text-sm">
                      Amount (Highest First)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sort-type" />
                    <Label htmlFor="sort-type" className="text-sm">
                      Transaction Type
                    </Label>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-2" onClick={() => onFilterChange(activeFilters)}>
                  Apply Sorting
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={onExport}>
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="h-8" onClick={() => setActiveFilters([])}>
          Clear All
        </Button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1 px-2 py-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
