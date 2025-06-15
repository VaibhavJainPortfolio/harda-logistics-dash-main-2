import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Filter, TrendingUp, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

import KPICards from './dashboard/KPICards';
import ComplianceKPICards from './dashboard/ComplianceKPICards';
import ChartSection from './dashboard/ChartSection';
import ComplianceCharts from './dashboard/ComplianceCharts';
import ComplianceInsights from './dashboard/ComplianceInsights';
import DataTable from './dashboard/DataTable';
import FilterPanel from './dashboard/FilterPanel';
import { useERPData } from '@/hooks/useERPData';
import { mockComplianceData } from '@/data/mockComplianceData';
import { useFilteredERPData } from '@/hooks/useFilteredERPData';


const ERPDashboard = () => {
  
  // Poll every 15 seconds
const { data: erpData, loading, error } = useERPData(15000);

const [filters, setFilters] = useState({
  branchId: 'all',
  bankName: 'all',
  stateName: 'all',
  balanceRange: [0, 10000000],
  searchTerm: '',
  year: 'all',
  accountStatus: 'all'
});

const [isFilterOpen, setIsFilterOpen] = useState(true);
const [selectedTab, setSelectedTab] = useState('financial');
const tabListRef = useRef(null);

const filteredData = useFilteredERPData(erpData, filters);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }
  
  if (!erpData) {
    return <div className="p-4 text-gray-600">No data available</div>;
  }  

  const maxBalance = Math.max(...erpData.openingBalances.map(b => b.opBalance));

  const scrollTabs = (direction) => {
    if (!tabListRef.current) return;
    const scrollAmount = 150;
    tabListRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md w-full">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ERP Compliance Intelligence Platform
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">Logistics Management & Compliance System</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>{isFilterOpen ? 'Hide' : 'Show'} Filters</span>
              </Button>
              <Badge variant="secondary" className="text-sm">
                {/* Connected to: HardaIndoreERP2223 */}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {isFilterOpen && (
            <div className="col-span-12 md:col-span-4 lg:col-span-3 min-w-0">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                maxBalance={maxBalance}
                data={erpData}
              />
            </div>
          )}

          <div className={`col-span-12 ${isFilterOpen ? 'md:col-span-8 lg:col-span-9' : 'lg:col-span-12'} min-w-0`}>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar min-w-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center justify-center"
                  onClick={() => scrollTabs('left')}
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="overflow-x-auto w-full no-scrollbar">
                  <TabsList
                    ref={tabListRef}
                    className="flex min-w-max space-x-2 overflow-x-auto no-scrollbar whitespace-nowrap"
                  >
                    <TabsTrigger value="financial" className="min-w-[140px] flex-shrink-0">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="compliance" className="min-w-[140px] flex-shrink-0">
                      Compliance Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="min-w-[140px] flex-shrink-0">
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="accounts" className="min-w-[140px] flex-shrink-0">
                      Account Details
                    </TabsTrigger>
                  </TabsList>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center justify-center"
                  onClick={() => scrollTabs('right')}
                  aria-label="Scroll tabs right"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Tabs Content */}
              <TabsContent value="financial" className="space-y-6 min-h-[200px]">
                <KPICards filteredData={filteredData} allData={erpData} />
                <ChartSection filteredData={filteredData} allData={erpData} />
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6 min-h-[200px]">
                <ComplianceKPICards complianceData={mockComplianceData} />
                <ComplianceInsights complianceData={mockComplianceData} />
                <ComplianceCharts complianceData={mockComplianceData} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 min-h-[200px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl min-w-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span>Performance Metrics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Accounts with GST</span>
                          <span className="font-semibold text-green-600">
                            {((filteredData.filter(acc =>
                              erpData.gstDetails.some(gst => gst.acCode === acc.acCode)
                            ).length / filteredData.length) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Accounts with PAN</span>
                          <span className="font-semibold text-blue-600">
                            {((filteredData.filter(acc => acc.pan).length / filteredData.length) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avg Balance per Account</span>
                          <span className="font-semibold text-purple-600">
                            ₹{(filteredData.reduce((sum, acc) => {
                              const balance = erpData.openingBalances.find(b => b.acCode === acc.acCode)?.opBalance || 0;
                              return sum + balance;
                            }, 0) / filteredData.length).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compliance Overview */}
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl min-w-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span>Compliance Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Vehicles in Fleet</span>
                          <Badge variant="default">{mockComplianceData.vehicles.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active Drivers</span>
                          <Badge variant="default">{mockComplianceData.drivers.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active Routes</span>
                          <Badge variant="default">
                            {new Set(mockComplianceData.routes.map(r => r.routeId)).size}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="accounts" className="space-y-6 min-h-[200px]">
                <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] min-w-0">
                  <DataTable filteredData={filteredData} allData={erpData} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPDashboard;

