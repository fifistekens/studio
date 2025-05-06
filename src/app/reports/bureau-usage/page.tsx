"use client";
import type { NextPage } from "next";
import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBureauUsageReport,
  type BureauUsageInputCatReportRequest,
  type BureauUsageReportRecord,
} from "@/services/bureau-usage-report";
import { ReportDataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  CartesianGrid,
} from "recharts";
import { DatePicker } from "@/components/date-picker";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

const BureauUsageReportPage: NextPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BureauUsageInputCatReportRequest>({
    SearchCriteria: "Search Input Report",
    Category: "ALL CATEGORY",
    DateFrom: format(addDays(new Date(), -365 * 3), "yyyy-MM-dd"), // default to 3 years ago
    DateTo: format(new Date(), "yyyy-MM-dd"), // default to today
  });

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -365 * 3),
    to: new Date(),
  });

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setFilters(prev => ({
        ...prev,
        DateFrom: format(dateRange.from as Date, "yyyy-MM-dd"),
        DateTo: format(dateRange.to as Date, "yyyy-MM-dd"),
      }));
    }
  }, [dateRange]);


  const { data, isLoading, error, refetch } = useQuery<
    BureauUsageReportRecord[],
    Error
  >({
    queryKey: ["bureauUsageReport", filters],
    queryFn: () => getBureauUsageReport(filters),
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, Category: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    queryClient.invalidateQueries({ queryKey: ["bureauUsageReport", filters] });
    refetch();
  };

  const chartData = useMemo(() => {
    if (!data) return [];
    const counts: { [key: string]: number } = {};
    data.forEach((record) => {
      const userId = record.UserId || "Unknown";
      counts[userId] = (counts[userId] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);


  const uniqueUserIds = useMemo(() => {
    if (!data) return [];
    const ids = new Set(data.map(item => item.UserId).filter(Boolean));
    return Array.from(ids);
  }, [data]);


  return (
    <div className="container mx-auto py-4 px-2 md:px-4 lg:px-6">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bureau Usage Report</CardTitle>
          <CardDescription>
            Filter and view bureau usage data. The API provides sample data.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="SearchCriteria">Search Criteria</Label>
                <Input
                  id="SearchCriteria"
                  name="SearchCriteria"
                  value={filters.SearchCriteria || ""}
                  onChange={handleFilterChange}
                  placeholder="e.g., Input Report"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Category">Category</Label>
                <Select
                  name="Category"
                  value={filters.Category || "ALL CATEGORY"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL CATEGORY">All Categories</SelectItem>
                    <SelectItem value="Category A">Category A</SelectItem>
                    <SelectItem value="Category B">Category B</SelectItem>
                    {/* Add more categories as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
                <Label htmlFor="dateRange">Date Range</Label>
                 <DatePicker
                    id="dateRange"
                    dateRange={dateRange}
                    onDateChange={setDateRange}
                    numberOfMonths={2}
                    className="w-full"
                  />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Apply Filters"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Card className="mb-6 bg-destructive text-destructive-foreground">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && <p className="text-center py-4">Loading data...</p>}
      
      {!isLoading && data && (
        <>
          <ReportDataTable columns={columns(uniqueUserIds)} data={data} />

          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Report Count by User</CardTitle>
              <CardDescription>
                Visual representation of report submissions per user.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Report Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
       {!isLoading && !data && !error && (
        <p className="text-center py-4">No data available for the selected filters.</p>
      )}
    </div>
  );
};

export default BureauUsageReportPage;
