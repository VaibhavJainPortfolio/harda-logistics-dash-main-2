import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Table as TableIcon, Download, Eye, ChevronLeft, ChevronRight, ArrowUpDown
} from 'lucide-react';

import { AccountMaster} from '@/types';

export interface ERPData {
  openingBalances: { acCode: string; opBalance: number }[];
  bankDetails: { accountNo: string; bank: string; city: string; ifscCode: string }[];
  gstDetails: { acCode: string; gstNo?: string; stateName?: string }[];
}

interface DataTableProps {
  filteredData: AccountMaster[];
  allData: ERPData;
}

const DataTable: React.FC<DataTableProps> = ({ filteredData, allData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  const enhancedData = filteredData.map(account => {
    const balance = allData.openingBalances.find(b => b.acCode === account.acCode);
    const bankDetail = allData.bankDetails.find(b => b.accountNo === account.acCode);
    const gstDetail = allData.gstDetails.find(g => g.acCode === account.acCode);

    return {
      ...account,
      balance: balance?.opBalance || 0,
      bank: bankDetail?.bank || 'N/A',
      city: bankDetail?.city || 'N/A',
      ifscCode: bankDetail?.ifscCode || 'N/A',
      gstNo: gstDetail?.gstNo || 'Not Registered',
      stateName: gstDetail?.stateName || 'N/A'
    };
  });

  const sortedData = [...enhancedData].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Account Code', 'Name', 'Short Name', 'PAN', 'Branch', 'Balance', 'Bank', 'City', 'IFSC', 'GST No', 'State'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(row => [
        row.acCode,
        `"${row.name}"`,
        `"${row.shortName}"`,
        row.pan || 'N/A',
        row.branchId,
        row.balance,
        `"${row.bank}"`,
        `"${row.city}"`,
        row.ifscCode,
        `"${row.gstNo}"`,
        `"${row.stateName}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'erp_accounts_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TableIcon className="h-5 w-5 text-blue-600" />
            <span>Account Details</span>
            <Badge variant="secondary" className="ml-2">
              {filteredData.length} records
            </Badge>
          </CardTitle>
          <Button onClick={exportToCSV} variant="outline" size="sm" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 bg-white/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="cursor-pointer hover:bg-gray-100/80 transition-colors" onClick={() => handleSort('acCode')}>
                  <div className="flex items-center space-x-1">
                    <span>Account Code</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100/80 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100/80 transition-colors" onClick={() => handleSort('balance')}>
                  <div className="flex items-center space-x-1">
                    <span>Balance</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>PAN</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>GST Status</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-100/80 transition-colors" onClick={() => handleSort('branchId')}>
                  <div className="flex items-center space-x-1">
                    <span>Branch</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((account) => (
                <TableRow key={account.acCode} className="hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-mono text-sm font-medium text-blue-600">
                    {account.acCode}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {account.name.length > 30 ? account.name.substring(0, 30) + '...' : account.name}
                      </div>
                      <div className="text-sm text-gray-500">{account.shortName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ₹{(account.balance / 100000).toFixed(1)}L
                      </div>
                      <div className="text-xs text-gray-500">
                        ₹{account.balance.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {account.pan ? (
                      <Badge variant="outline" className="font-mono text-xs">
                        {account.pan}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Missing
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {account.bank !== 'N/A' ? (
                        <div>
                          <div className="font-medium">{account.bank.length > 15 ? account.bank.substring(0, 15) + '...' : account.bank}</div>
                          <div className="text-xs text-gray-500">{account.city}</div>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          No Bank
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {account.gstNo !== 'Not Registered' ? (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                        Registered
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Not Registered
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {account.stateName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      Branch {account.branchId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
