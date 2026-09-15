import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createSupplier,
  updateSupplier,
  fetchSupplierById,
} from "../../store/suppliersSlice.js";
import { notifySuccess, notifyError } from "../../lib/toast.js";
import CustomDropdown from "../../components/common/CustomDropdown.jsx";
import { FaArrowLeft } from "react-icons/fa";

const EMPTY_FORM = {
  companyName: "",
  supplierType: "Strategic manufacturer",
  status: "Active",
  primaryContact: { firstName: "", lastName: "", role: "" },
  email: "",
  phone: "",
  supplierId: "",
  category: "",
  annualPurchaseValue: "",
  paymentTerms: "Net 30",
  averageLeadTime: "",
  assignedBuyer: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  },
  notes: "",
};

export default function SupplierForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentSupplier } = useSelector((state) => state.suppliers);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isEdit) dispatch(fetchSupplierById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentSupplier) {
      setFormData({
        companyName: currentSupplier.companyName || "",
        supplierType: currentSupplier.supplierType || "Strategic manufacturer",
        status: currentSupplier.status || "Active",
        primaryContact: {
          firstName: currentSupplier.primaryContact?.firstName || "",
          lastName: currentSupplier.primaryContact?.lastName || "",
          role: currentSupplier.primaryContact?.role || "",
        },
        email: currentSupplier.email || "",
        phone: currentSupplier.phone || "",
        supplierId: currentSupplier.supplierId || "",
        category: currentSupplier.category || "",
        annualPurchaseValue: currentSupplier.annualPurchaseValue ?? "",
        paymentTerms: currentSupplier.paymentTerms || "Net 30",
        averageLeadTime: currentSupplier.averageLeadTime ?? "",
        assignedBuyer: currentSupplier.assignedBuyer || "",
        address: {
          addressLine1: currentSupplier.address?.addressLine1 || "",
          addressLine2: currentSupplier.address?.addressLine2 || "",
          city: currentSupplier.address?.city || "",
          state: currentSupplier.address?.state || "",
          postalCode: currentSupplier.address?.postalCode || "",
          country: currentSupplier.address?.country || "United States",
        },
        notes: currentSupplier.notes || "",
      });
    }
  }, [isEdit, currentSupplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name.startsWith("primaryContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        primaryContact: { ...prev.primaryContact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      annualPurchaseValue: Number(formData.annualPurchaseValue) || 0,
      averageLeadTime: Number(formData.averageLeadTime) || 0,
    };

    try {
      if (isEdit) {
        await dispatch(updateSupplier({ id, supplierData: payload })).unwrap();
        notifySuccess("Supplier updated successfully");
      } else {
        await dispatch(createSupplier(payload)).unwrap();
        notifySuccess("Supplier created successfully");
      }
      navigate("/dashboard/suppliers");
    } catch (err) {
      notifyError(err || "Failed to save supplier");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() =>
              navigate(
                isEdit ? `/dashboard/suppliers/${id}` : "/dashboard/suppliers",
              )
            }
            className="flex items-center gap-2 text-sm text-faint hover:text-white transition-colors mb-3"
          >
            <FaArrowLeft size={11} />
            Suppliers
            {" / "}
          </button>
          <h1 className="text-3xl font-semibold text-white">
            {isEdit ? "Edit supplier" : "Add supplier"}
          </h1>
          <p className="text-sm text-muted">
            {isEdit
              ? "Update supplier account details."
              : "Create a supplier profile and manage purchasing details."}
          </p>
        </div>
        
      </div>

      <form
        id="supplier-form"
        onSubmit={handleSubmit}
        className="rounded-xl border border-line bg-surface p-6 space-y-6 w-full"
      >
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Basic information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Company name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                required
                placeholder="Company name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Supplier type
                </label>
                <CustomDropdown
                  value={formData.supplierType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, supplierType: value }))
                  }
                  options={[
                    {
                      value: "Strategic manufacturer",
                      label: "Strategic manufacturer",
                    },
                    { value: "Distributor", label: "Distributor" },
                    { value: "Wholesaler", label: "Wholesaler" },
                    { value: "Local vendor", label: "Local vendor" },
                  ]}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Account status
                </label>
                <CustomDropdown
                  value={formData.status}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                    { value: "Pending review", label: "Pending review" },
                  ]}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Primary contact first name
                </label>
                <input
                  type="text"
                  name="primaryContact.firstName"
                  placeholder="First name"
                  value={formData.primaryContact.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Primary contact last name
                </label>
                <input
                  type="text"
                  name="primaryContact.lastName"
                  placeholder="Last name"
                  value={formData.primaryContact.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Business email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Business phone
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-line" />

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Supplier details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Supplier ID
              </label>
              <input
                type="text"
                name="supplierId"
                placeholder="Auto-generated if left blank"
                value={formData.supplierId}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Category
              </label>
              <CustomDropdown
                value={formData.category}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                options={[
                  { value: "Electronics", label: "Electronics" },
                  { value: "Packaging", label: "Packaging" },
                  { value: "Hardware", label: "Hardware" },
                  { value: "Textiles", label: "Textiles" },
                  { value: "Logistics", label: "Logistics" },
                  { value: "Office supplies", label: "Office supplies" },
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Annual purchase value ($)
              </label>
              <input
                type="number"
                name="annualPurchaseValue"
                placeholder="480000"
                value={formData.annualPurchaseValue}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Payment terms
              </label>
              <CustomDropdown
                value={formData.paymentTerms}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, paymentTerms: value }))
                }
                options={[
                  { value: "Net 15", label: "Net 15" },
                  { value: "Net 30", label: "Net 30" },
                  { value: "Net 45", label: "Net 45" },
                  { value: "Net 60", label: "Net 60" },
                  { value: "Due on Receipt", label: "Due on Receipt" },
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Average lead time (days)
              </label>
              <input
                type="number"
                name="averageLeadTime"
                placeholder="9"
                value={formData.averageLeadTime}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Assigned buyer
              </label>
              <input
                type="text"
                name="assignedBuyer"
                placeholder="Alex Rivera"
                value={formData.assignedBuyer}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-line" />

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Address line 1
              </label>
              <input
                type="text"
                name="address.addressLine1"
                placeholder="880 Innovation Drive"
                value={formData.address.addressLine1}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Address line 2
              </label>
              <input
                type="text"
                name="address.addressLine2"
                placeholder="Building 4"
                value={formData.address.addressLine2}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  placeholder="San Jose"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  State / province
                </label>
                <input
                  type="text"
                  name="address.state"
                  placeholder="CA"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Postal code
                </label>
                <input
                  type="text"
                  name="address.postalCode"
                  placeholder="95134"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Country
                </label>
                <CustomDropdown
                  value={formData.address.country}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, country: value },
                    }))
                  }
                  options={[
                    { value: "United States", label: "United States" },
                    { value: "Canada", label: "Canada" },
                    { value: "United Kingdom", label: "United Kingdom" },
                  ]}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-line" />

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
          <textarea
            name="notes"
            rows={3}
            placeholder="Strategic supplier for electronic components. Preferred for high-volume quarterly purchase orders."
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-lg border border-line bg-panel p-3 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none resize-none"
          />
        </div>

        <p className="text-xs text-faint">Fields marked with * are required.</p>
                 <hr className="border-line" />
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard/suppliers")}
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            
            Cancel
          </button>
          <button
            type="submit"
            form="supplier-form"
            className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Save supplier
          </button>
        </div>
      </form>


    </div>
  );
}
