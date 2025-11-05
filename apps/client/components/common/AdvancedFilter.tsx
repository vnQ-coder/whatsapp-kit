"use client";

import { useState } from "react";
import { Filter, X, Calendar, ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "../ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { cn } from "../../lib/utils";

export interface FilterOption {
  field: string;
  label: string;
  type: "select" | "text" | "date" | "daterange" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterState {
  [key: string]: string | { from: string; to: string } | undefined;
}

interface AdvancedFilterProps {
  options: FilterOption[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClear?: () => void;
  className?: string;
}

export function AdvancedFilter({
  options,
  filters,
  onFiltersChange,
  onClear,
  className,
}: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const activeFilterCount = Object.keys(filters).filter(
    (key) => {
      const value = filters[key];
      if (typeof value === "object" && value !== null) {
        return value.from || value.to;
      }
      return value !== undefined && value !== "";
    }
  ).length;

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleDateRangeChange = (field: string, type: "from" | "to", value: string) => {
    const currentRange = (localFilters[field] as { from: string; to: string }) || {
      from: "",
      to: "",
    };
    const newRange = { ...currentRange, [type]: value };
    const newFilters = { ...localFilters, [field]: newRange };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear?.();
  };

  const handleRemoveFilter = (field: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[field];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getActiveFilterLabel = (field: string): string | null => {
    const option = options.find((opt) => opt.field === field);
    const value = filters[field];
    
    if (!value || !option) return null;
    
    if (typeof value === "object" && value !== null) {
      if (value.from || value.to) {
        return `${option.label}: ${value.from || "..."} - ${value.to || "..."}`;
      }
      return null;
    }
    
    if (option.type === "select" && option.options) {
      const optionLabel = option.options.find((opt) => opt.value === value)?.label;
      return optionLabel ? `${option.label}: ${optionLabel}` : null;
    }
    
    return `${option.label}: ${value}`;
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                className="ml-2 h-5 min-w-5 px-1.5 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Advanced Filters</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>

            <Separator />

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {options.map((option) => (
                <div key={option.field} className="space-y-2">
                  <Label className="text-xs font-medium">{option.label}</Label>
                  
                  {option.type === "select" && option.options && (
                    <Select
                      value={localFilters[option.field] as string || undefined}
                      onValueChange={(value) => {
                        // Use undefined to clear instead of empty string
                        handleFilterChange(option.field, value === "__all__" ? undefined : value);
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder={option.placeholder || `All ${option.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All</SelectItem>
                        {option.options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {option.type === "text" && (
                    <Input
                      placeholder={option.placeholder || `Enter ${option.label}`}
                      value={localFilters[option.field] as string || ""}
                      onChange={(e) =>
                        handleFilterChange(option.field, e.target.value)
                      }
                      className="h-9"
                    />
                  )}

                  {option.type === "date" && (
                    <Input
                      type="date"
                      value={localFilters[option.field] as string || ""}
                      onChange={(e) =>
                        handleFilterChange(option.field, e.target.value)
                      }
                      className="h-9"
                    />
                  )}

                  {option.type === "daterange" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">From</Label>
                        <Input
                          type="date"
                          value={
                            ((localFilters[option.field] as { from: string; to: string })?.from) || ""
                          }
                          onChange={(e) =>
                            handleDateRangeChange(option.field, "from", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">To</Label>
                        <Input
                          type="date"
                          value={
                            ((localFilters[option.field] as { from: string; to: string })?.to) || ""
                          }
                          onChange={(e) =>
                            handleDateRangeChange(option.field, "to", e.target.value)
                          }
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}

                  {option.type === "number" && (
                    <Input
                      type="number"
                      placeholder={option.placeholder || `Enter ${option.label}`}
                      value={localFilters[option.field] as string || ""}
                      onChange={(e) =>
                        handleFilterChange(option.field, e.target.value)
                      }
                      className="h-9"
                    />
                  )}
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.keys(filters).map((field) => {
            const label = getActiveFilterLabel(field);
            if (!label) return null;
            
            return (
              <Badge
                key={field}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">{label}</span>
                <button
                  onClick={() => handleRemoveFilter(field)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

