import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { AccountMaster} from '@/types';
import { useERPData } from '@/hooks/useERPData';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, MapPin } from 'lucide-react';

interface useERPData {
  vehicles: any[];
  drivers: any[];
  routes: any[];
  openingBalances: { acCode: string; opBalance: number }[];
  gstDetails: { acCode: string; stateName: string }[];
  bankDetails: { accountNo: string; bank: string }[];
}

interface ChartSectionProps {
  filteredData: AccountMaster[];
  allData: useERPData;
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

const ChartSection: React.FC<ChartSectionProps> = ({ filteredData, allData }) => {
  // Branch-wise balance data
  const branchData = useMemo(() => {
    const branchBalances: { [key: number]: number } = {};
    const branchCounts: { [key: number]: number } = {};
    
    filteredData.forEach(account => {
      const balance = allData.openingBalances.find(b => b.acCode === account.acCode)?.opBalance || 0;
      branchBalances[account.branchId] = (branchBalances[account.branchId] || 0) + balance;
      branchCounts[account.branchId] = (branchCounts[account.branchId] || 0) + 1;
    });

    return Object.keys(branchBalances).map(branchId => ({
      branch: `Branch ${branchId}`,
      balance: Math.round(branchBalances[parseInt(branchId)] / 100000), // in Lakhs
      accounts: branchCounts[parseInt(branchId)]
    }));
  }, [filteredData, allData]);

  // State-wise distribution
  const stateData = useMemo(() => {
    const stateCounts: { [key: string]: number } = {};
    
    filteredData.forEach(account => {
      const gstDetail = allData.gstDetails.find(g => g.acCode === account.acCode);
      if (gstDetail) {
        stateCounts[gstDetail.stateName] = (stateCounts[gstDetail.stateName] || 0) + 1;
      } else {
        stateCounts['Not Registered'] = (stateCounts['Not Registered'] || 0) + 1;
      }
    });

    return Object.entries(stateCounts)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 states
  }, [filteredData, allData]);

  // Bank-wise distribution
  const bankData = useMemo(() => {
    const bankCounts: { [key: string]: number } = {};
    
    filteredData.forEach(account => {
      const bankDetail = allData.bankDetails.find(b => b.accountNo === account.acCode);
      if (bankDetail) {
        bankCounts[bankDetail.bank] = (bankCounts[bankDetail.bank] || 0) + 1;
      } else {
        bankCounts['No Bank Details'] = (bankCounts['No Bank Details'] || 0) + 1;
      }
    });

    return Object.entries(bankCounts)
      .map(([bank, count]) => ({ bank: bank.length > 15 ? bank.substring(0, 15) + '...' : bank, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredData, allData]);

  // Top accounts by balance
  const topAccounts = useMemo(() => {
    return filteredData
      .map(account => {
        const balance = allData.openingBalances.find(b => b.acCode === account.acCode)?.opBalance || 0;
        return {
          name: account.name.length > 20 ? account.name.substring(0, 20) + '...' : account.name,
          balance: Math.round(balance / 100000), // in Lakhs
          acCode: account.acCode
        };
      })
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);
  }, [filteredData, allData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Branch-wise Balance */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Balance by Branch</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'balance' ? `₹${value}L` : value,
                  name === 'balance' ? 'Balance' : 'Accounts'
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="balance" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* State-wise Distribution */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5 text-green-600" />
            <span>Parties by State</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ state, percent }) => `${state}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Accounts by Balance */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Top 10 Accounts by Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={topAccounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any) => [`₹${value}L`, 'Balance']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#8B5CF6" 
                fill="url(#colorBalance)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bank Distribution */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            <span>Bank-wise Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bankData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                dataKey="bank" 
                type="category" 
                tick={{ fontSize: 10 }}
                width={100}
              />
              <Tooltip 
                formatter={(value: any) => [value, 'Accounts']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
