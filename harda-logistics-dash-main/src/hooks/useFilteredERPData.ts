// useFilteredERPData.ts
import { useMemo } from "react";

export function useFilteredERPData(erpData, filters) {
  return useMemo(() => {
    if (!erpData) return [];

    return erpData.accounts.filter(account => {
      if (filters.branchId !== 'all' && account.branchId !== parseInt(filters.branchId)) return false;

      if (filters.bankName !== 'all') {
        const bankDetails = erpData.bankDetails.find(b => b.accountNo === account.acCode);
        if (!bankDetails || bankDetails.bank !== filters.bankName) return false;
      }

      if (filters.stateName !== 'all') {
        const gstDetails = erpData.gstDetails.find(g => g.acCode === account.acCode);
        if (!gstDetails || gstDetails.stateName !== filters.stateName) return false;
      }

      const balance = erpData.openingBalances.find(b => b.acCode === account.acCode)?.opBalance || 0;
      if (balance < filters.balanceRange[0] || balance > filters.balanceRange[1]) return false;

      if (filters.accountStatus !== 'all') {
        const hasBalance = balance > 0;
        if ((filters.accountStatus === 'active' && !hasBalance) || (filters.accountStatus === 'inactive' && hasBalance)) {
          return false;
        }
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const hasMatchingPAN = account.pan?.toLowerCase().includes(searchLower);
        const hasMatchingName = account.name?.toLowerCase().includes(searchLower);
        const gstDetails = erpData.gstDetails.find(g => g.acCode === account.acCode);
        const hasMatchingGST = gstDetails?.gstNo?.toLowerCase().includes(searchLower);

        if (!hasMatchingPAN && !hasMatchingName && !hasMatchingGST) return false;
      }

      return true;
    });
  }, [filters, erpData]);
}
