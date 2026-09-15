// src/pages/dashboard/Customers.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { fetchCustomers } from '../../store/customersSlice';
import StatusBadge from '../../components/dashboard/StatusBadge';
// import Skeleton from '../../components/dashboard/skeleton/Skeleton';
import EmptyState from '../../components/dashboard/EmptyState';
import { usePermission } from '../../hooks/usePermission';
import CustomDropdown from '../../components/common/CustomDropdown';

export default function Customers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canWrite = usePermission('customers', 'write');
  const { items: customers, stats, loading } = useSelector((state) => state.customers);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchCustomers({ search, status: statusFilter }));
  }, [dispatch, search, statusFilter]);

  const getInitials = (name) => {
    if (!name) return 'CU'
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-start justify-between ">
        <div>
          <h1 className="text-3xl font-semibold text-white">Customers</h1>
          <p className="text-sm text-faint mt-1">Manage your customer relationships and account history.</p>
        </div>
        {canWrite && (
          <button
            onClick={() => navigate('/dashboard/customers/new')}
            className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
          >
            <FaPlus size={11} /> Add customer
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Total customers</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.totalCustomers.toLocaleString()}</p>
          <span className="text-xs font-medium text-emerald-400">+12.5% this month</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Active customers</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.activeCustomers.toLocaleString()}</p>
          <span className="text-xs font-medium text-emerald-400">+8.2%</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">New this month</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.newThisMonth.toLocaleString()}</p>
          <span className="text-xs font-medium text-emerald-400">+24.1%</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Average order value</p>
          <p className="mt-2 text-2xl font-bold text-white">${stats.avgOrderValue.toFixed(2)}</p>
          <span className="text-xs font-medium text-emerald-400">+5.7%</span>
        </div>
      </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-line bg-panel pl-9 pr-4 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <CustomDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "All", label: "All statuses" },
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
              className="w-40"
            />
            <button className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-muted hover:text-white">
              <FaFilter size={12} /> Filter
            </button>
          </div>
        </div>
      <div className="rounded-xl border border-line bg-surface  space-y-4">
        {/* Data List */}
        <div className="overflow-x-auto border-t border-line rounded-t-lg">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="bg-[#1d1d1f] text-left text-faint text-sm border-b border-line uppercase">
                <th className="px-4 py-4 font-semibold">Customer</th>
                <th className="px-4 py-4 font-semibold">Email</th>
                <th className="px-4 py-4 font-semibold">Orders</th>
                <th className="px-4 py-4 font-semibold">Total Spent</th>
                <th className="px-4 py-4 font-semibold">Last Order</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-faint">
                    Loading…
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0">
                    <EmptyState
                      title="No customers found"
                      description="Get started by creating your first customer profile."
                      actionLabel={canWrite ? "Add customer" : null}
                      onAction={() => navigate('/dashboard/customers/new')}
                    />
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => navigate(`/dashboard/customers/${c._id}`)}
                    className="border-b border-line last:border-0 hover:bg-panel/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-accent2">
                          {getInitials(c.companyName)}
                        </div>

                        <span className="font-medium text-white">
                          {c.companyName}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {c.email}
                    </td>

                    <td className="px-4 py-3 font-semibold text-white">
                      {c.totalOrders || 0}
                    </td>

                    <td className="px-4 py-3 font-semibold text-white">
                      ${(c.totalSpent || 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-3">
                      {c.lastOrderDate
                        ? new Date(c.lastOrderDate).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}