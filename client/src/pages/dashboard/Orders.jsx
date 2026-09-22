import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { fetchOrders } from '../../store/ordersSlice';
import StatusBadge from '../../components/dashboard/StatusBadge';
import EmptyState from '../../components/dashboard/EmptyState';
import CustomDropdown from '../../components/common/CustomDropdown';

export default function Orders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: orders, stats, loading } = useSelector((state) => state.orders);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchOrders({ search, status: statusFilter }));
  }, [dispatch, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Orders</h1>
          <p className="text-sm text-faint mt-1">Track customer orders, fulfillment, and delivery status.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/orders/new')}
          className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
        >
          <FaPlus size={11} /> Create order
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Total orders</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.totalOrders.toLocaleString()}</p>
          <span className="text-xs font-medium text-emerald-400">+18.4% this month</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Processing</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.processingCount}</p>
          <span className="text-xs font-medium text-amber-400">42 due today</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Shipped</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.shippedCount.toLocaleString()}</p>
          <span className="text-xs font-medium text-emerald-400">+9.2%</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Revenue</p>
          <p className="mt-2 text-2xl font-bold text-white">
            ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <span className="text-xs font-medium text-emerald-400">+14.8%</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input
            type="text"
            placeholder="Search order number or customer"
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
              { value: "Processing", label: "Processing" },
              { value: "Shipped", label: "Shipped" },
              { value: "Delivered", label: "Delivered" },
            ]}
            className="w-40"
          />
          <button className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-muted hover:text-white">
            <FaFilter size={12} /> Filter
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-line bg-surface space-y-4">
        <div className="overflow-x-auto border-t border-line rounded-t-lg">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="bg-[#1d1d1f] text-left text-faint text-sm border-b border-line uppercase">
                <th className="px-4 py-4 font-semibold">Order</th>
                <th className="px-4 py-4 font-semibold">Customer</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Items</th>
                <th className="px-4 py-4 font-semibold">Total</th>
                <th className="px-4 py-4 font-semibold">Payment</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-faint">
                    Loading…mj
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <EmptyState
                      title="No orders found"
                      description="Get started by placing your first order."
                      actionLabel="Create order"
                      onAction={() => navigate('/dashboard/orders/new')}
                    />
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr
                    key={ord._id}
                    onClick={() => navigate(`/dashboard/orders/${ord._id}`)}
                    className="border-b border-line last:border-0 hover:bg-panel/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-accent2">
                      {ord.orderNumber}
                    </td>

                    <td className="px-4 py-3 font-medium text-white">
                      {ord.customerName}
                    </td>

                    <td className="px-4 py-3 text-faint">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="px-4 py-3 text-white">
                      {ord.items?.length || 0}
                    </td>

                    <td className="px-4 py-3 font-semibold text-white">
                      ${(ord.totalAmount || 0).toFixed(2)}
                    </td>

                    <td className="px-4 py-3">
                      <span className={ord.paymentStatus === 'Paid' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={ord.fulfillmentStatus} />
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