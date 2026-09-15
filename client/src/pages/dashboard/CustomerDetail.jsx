import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaArrowLeft,
} from "react-icons/fa";
import { fetchCustomerById } from "../../store/customersSlice";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { usePermission } from "../../hooks/usePermission";
import { SkeletonText } from "../../components/dashboard/skeleton/Skeleton";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canWrite = usePermission("customers", "write");
  const { currentCustomer: customer } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomerById(id));
  }, [dispatch, id]);

  if (!customer) {
    return <SkeletonText />;
  }

  const initials = customer.companyName
    ? customer.companyName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CU";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <button
        onClick={() => navigate('/dashboard/customers')}
        className="flex items-center gap-2 text-sm text-faint hover:text-white transition-colors mb-3"
      >
        <FaArrowLeft size={11} />
        Warehouses
        {" / "}
      </button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {customer.companyName}
          </h1>
          <p className="text-sm text-muted">
            {customer.customerType} customer since{" "}
            {new Date(customer.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-3">
          
          {canWrite && (
            <button
              onClick={() => navigate(`/dashboard/customers/${id}/edit`)}
              className="flex items-center gap-2 rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              <FaEdit size={12} /> Edit client
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/20 text-base font-bold text-accent2">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {customer.companyName}
              </h2>
              <p className="text-sm text-muted">
                {customer.primaryContact?.firstName}{" "}
                {customer.primaryContact?.lastName}
                {customer.primaryContact?.role &&
                  ` - ${customer.primaryContact.role}`}
              </p>
              <p className="text-xs text-accent2">{customer.email}</p>
            </div>
          </div>
          <StatusBadge
            status={`${customer.customerType} - ${customer.status}`}
          />
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-muted pt-2 border-t border-line/50">
          {customer.phone && (
            <div className="flex items-center gap-2">
              <FaPhone size={12} /> {customer.phone}
            </div>
          )}
          {customer.address?.city && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt size={12} /> {customer.address.city},{" "}
              {customer.address.state}
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaEnvelope size={12} /> {customer.email}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Total orders</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {customer.totalOrders || 0}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Total spent</p>
          <p className="mt-2 text-2xl font-bold text-white">
            ${(customer.totalSpent || 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">
            Average order value
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            $
            {customer.totalOrders
              ? (customer.totalSpent / customer.totalOrders).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2 },
                )
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Account Info & Address */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">
            Account information
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted">Account type</p>
              <p className="text-white font-medium">{customer.customerType}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Primary contact</p>
              <p className="text-white font-medium">
                {customer.primaryContact?.firstName}{" "}
                {customer.primaryContact?.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Contact role</p>
              <p className="text-white">
                {customer.primaryContact?.role || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Billing terms</p>
              <p className="text-white">{customer.billingTerms}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Preferred contact</p>
              <p className="text-white">{customer.preferredContact}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">
            Billing and shipping
          </h3>
          <div className="text-sm text-white space-y-1">
            <p className="font-medium">{customer.companyName}</p>
            <p>{customer.address?.addressLine1 || "—"}</p>
            {customer.address?.addressLine2 && (
              <p>{customer.address.addressLine2}</p>
            )}
            <p>
              {[
                customer.address?.city,
                customer.address?.state,
                customer.address?.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p>{customer.address?.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
