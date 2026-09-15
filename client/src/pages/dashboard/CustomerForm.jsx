import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createCustomer,
  updateCustomer,
  fetchCustomerById,
} from "../../store/customersSlice";
import { notifySuccess, notifyError } from "../../lib/toast";
import CustomDropdown from "../../components/common/CustomDropdown";
import { FaArrowLeft } from "react-icons/fa";

export default function CustomerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentCustomer } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    companyName: "",
    customerType: "Enterprise",
    status: "Active",
    primaryContact: {
      firstName: "",
      lastName: "",
      role: "",
    },
    email: "",
    phone: "",
    accountId: "",
    industry: "Retail & Distribution",
    annualOrderValue: "",
    creditLimit: "",
    billingTerms: "Net 30",
    assignedAccountManager: "Alex Rivera",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
    },
    notes: "",
  });

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchCustomerById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentCustomer) {
      setFormData({
        companyName: currentCustomer.companyName || "",
        customerType: currentCustomer.customerType || "Enterprise",
        status: currentCustomer.status || "Active",
        primaryContact: {
          firstName: currentCustomer.primaryContact?.firstName || "",
          lastName: currentCustomer.primaryContact?.lastName || "",
          role: currentCustomer.primaryContact?.role || "",
        },
        email: currentCustomer.email || "",
        phone: currentCustomer.phone || "",
        accountId: currentCustomer.accountId || "",
        industry: currentCustomer.industry || "Retail & Distribution",
        annualOrderValue: currentCustomer.annualOrderValue || "",
        creditLimit: currentCustomer.creditLimit || "",
        billingTerms: currentCustomer.billingTerms || "Net 30",
        assignedAccountManager:
          currentCustomer.assignedAccountManager || "Alex Rivera",
        address: {
          addressLine1: currentCustomer.address?.addressLine1 || "",
          addressLine2: currentCustomer.address?.addressLine2 || "",
          city: currentCustomer.address?.city || "",
          state: currentCustomer.address?.state || "",
          postalCode: currentCustomer.address?.postalCode || "",
          country: currentCustomer.address?.country || "United States",
        },
        notes: currentCustomer.notes || "",
      });
    }
  }, [isEdit, currentCustomer]);

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
    try {
      if (isEdit) {
        await dispatch(updateCustomer({ id, customerData: formData })).unwrap();
        notifySuccess("Customer updated successfully");
      } else {
        await dispatch(createCustomer(formData)).unwrap();
        notifySuccess("Customer created successfully");
      }
      navigate("/dashboard/customers");
    } catch (err) {
      notifyError(err || "Failed to save customer");
    }
  };

  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() =>
              navigate(
                isEdit ? `/dashboard/customers/${id}` : "/dashboard/customers",
              )
            }
            className="flex items-center gap-2 text-sm text-faint hover:text-white transition-colors mb-3"
          >
            <FaArrowLeft size={11} />
            Customers
            {" / "}
          </button>
          <h1 className="text-3xl font-semibold text-white">
            {isEdit ? "Edit Client Profile" : "Add customer"}
          </h1>
          <p className="text-sm text-muted">
            {isEdit
              ? "Update account details."
              : "Create a new customer profile and save their contact details."}
          </p>
        </div>
      </div>

      <form
        id="customer-form"
        onSubmit={handleSubmit}
        className="rounded-xl border border-line bg-surface p-6 space-y-6 w-full"
      >
        {/* Basic Information */}
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
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Customer type
                </label>
                <CustomDropdown
                  value={formData.customerType}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerType: value,
                    }))
                  }
                  options={[
                    { value: "Enterprise", label: "Enterprise" },
                    { value: "SMB", label: "SMB" },
                    { value: "Wholesale", label: "Wholesale" },
                    { value: "Individual", label: "Individual" },
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
                    setFormData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
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

        {/* Account Details */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Account details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Account ID
              </label>
              <input
                type="text"
                name="accountId"
                placeholder="NSR-00184"
                value={formData.accountId}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Industry
              </label>
              <CustomDropdown
                value={formData.industry}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    industry: value,
                  }))
                }
                options={[
                  {
                    value: "Retail & Distribution",
                    label: "Retail & Distribution",
                  },
                  { value: "Manufacturing", label: "Manufacturing" },
                  { value: "Technology", label: "Technology" },
                  { value: "Healthcare", label: "Healthcare" },
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Annual order value ($)
              </label>
              <input
                type="number"
                name="annualOrderValue"
                placeholder="480000"
                value={formData.annualOrderValue}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Credit limit ($)
              </label>
              <input
                type="number"
                name="creditLimit"
                placeholder="75000"
                value={formData.creditLimit}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Payment terms
              </label>
              <CustomDropdown
                value={formData.billingTerms}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    billingTerms: value,
                  }))
                }
                options={[
                  { value: "Net 15", label: "Net 15" },
                  { value: "Net 30", label: "Net 30" },
                  { value: "Net 60", label: "Net 60" },
                  { value: "Due on Receipt", label: "Due on Receipt" },
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Assigned account manager
              </label>
              <input
                type="text"
                name="assignedAccountManager"
                placeholder="Alex Rivera"
                value={formData.assignedAccountManager}
                onChange={handleChange}
                className="w-full rounded-lg border border-line bg-panel px-3 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-line" />

        {/* Address */}
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
                placeholder="245 Market Street"
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
                placeholder="Suite 800"
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
                  placeholder="San Francisco"
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
                  placeholder="94105"
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
                      address: {
                        ...prev.address,
                        country: value,
                      },
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

        {/* Notes */}
        <div>
          <h2 className="text-bxlase font-semibold text-white mb-4">Notes</h2>
          <textarea
            name="notes"
            rows={3}
            placeholder="Priority enterprise account. High-volume buyer with recurring quarterly orders."
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
            onClick={() => navigate("/dashboard/customers")}
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="customer-form"
            className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            {`${isEdit ? "Save changes" : "Save Customer"}`}
          </button>
        </div>
      </form>
    </div>
  );
}
