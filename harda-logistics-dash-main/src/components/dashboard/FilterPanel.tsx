
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MockERPData } from '@/data/mockERPData';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    branchId: string;
    bankName: string;
    stateName: string;
    balanceRange: number[];
    searchTerm: string;
    year: string;
    accountStatus: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    branchId: string;
    bankName: string;
    stateName: string;
    balanceRange: number[];
    searchTerm: string;
    year: string;
    accountStatus: string;
  }>>;
  maxBalance: number;
  data: MockERPData;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, maxBalance, data }) => {
  const uniqueBranches = Array.from(new Set(data.accounts.map(acc => acc.branchId))).sort();
  const uniqueBanks = Array.from(new Set(data.bankDetails.map(bank => bank.bank))).sort();
  const uniqueStates = Array.from(new Set(data.gstDetails.map(gst => gst.stateName))).sort();

  const resetFilters = () => {
    setFilters({
      branchId: 'all',
      bankName: 'all',
      stateName: 'all',
      balanceRange: [0, maxBalance],
      searchTerm: '',
      year: 'all',
      accountStatus: 'all'
    });
  };

  const activeFiltersCount = [
    filters.branchId !== 'all',
    filters.bankName !== 'all',
    filters.stateName !== 'all',
    filters.balanceRange[0] > 0 || filters.balanceRange[1] < maxBalance,
    filters.searchTerm !== '',
    filters.year !== 'all',
    filters.accountStatus !== 'all'
  ].filter(Boolean).length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Filters</span>
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} active
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Search (Name/PAN/GST)
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search accounts..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Financial Year
          </Label>
          <Select
            value={filters.year}
            onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
          >
            <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2023-24">2023-24</SelectItem>
              <SelectItem value="2022-23">2022-23</SelectItem>
              <SelectItem value="2021-22">2021-22</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Account Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Account Status
          </Label>
          <Select
            value={filters.accountStatus}
            onValueChange={(value) => setFilters(prev => ({ ...prev, accountStatus: value }))}
          >
            <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Branch Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Branch
          </Label>
          <Select
            value={filters.branchId}
            onValueChange={(value) => setFilters(prev => ({ ...prev, branchId: value }))}
          >
            <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {uniqueBranches.map(branchId => (
                <SelectItem key={branchId} value={branchId.toString()}>
                  Branch {branchId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bank Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Bank
          </Label>
          <Select
            value={filters.bankName}
            onValueChange={(value) => setFilters(prev => ({ ...prev, bankName: value }))}
          >
            <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Banks</SelectItem>
              {uniqueBanks.map(bank => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            State
          </Label>
          <Select
            value={filters.stateName}
            onValueChange={(value) => setFilters(prev => ({ ...prev, stateName: value }))}
          >
            <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-300 focus:ring-blue-200">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {uniqueStates.map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Balance Range */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Opening Balance Range
          </Label>
          <div className="px-2">
            <Slider
              value={filters.balanceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, balanceRange: value }))}
              max={maxBalance}
              min={0}
              step={10000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>₹{(filters.balanceRange[0] / 100000).toFixed(1)}L</span>
            <span>₹{(filters.balanceRange[1] / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div>Quick Stats:</div>
            <div>• Branches: {uniqueBranches.length}</div>
            <div>• Banks: {uniqueBanks.length}</div>
            <div>• States: {uniqueStates.length}</div>
            <div>• Max Balance: ₹{(maxBalance / 100000).toFixed(1)}L</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
