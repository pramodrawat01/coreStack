import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import {
  fetchProduct,
  createProduct,
  updateProduct,
  addProductWarehouse,
  clearCurrentProduct,
} from "../../store/productsSlice.js";
import { notifySuccess, notifyError } from "../../lib/toast.js";
import { fetchWarehouses } from "../../store/warehousesSlice.js";
import CustomDropdown from "../../components/common/CustomDropdown.jsx";
import { clearProductStock, fetchProductStock } from "../../store/inventorySlice.js";

const CATEGORY_OPTIONS = [
  "Hardware",
  "Electrical",
  "Safety Gear",
  "Packaging",
  "Tools",
];

const EMPTY_FORM = {
  name: "",
  sku: "",
  price: "",
  cost: "",
  category: CATEGORY_OPTIONS[0],
  stockQuantity: "",
  reorderPoint: "",
  description: "",
  warehouse: null,
  supplier: "",
  weight: "",
  isActive: true,
};

// One row per warehouse this product is being stocked in at creation time.
const EMPTY_WAREHOUSE_ROW = { warehouseId: "", quantity: "" };

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: existingProduct } = useSelector((s) => s.products);
  const { items: warehouses } = useSelector((s) => s.warehouses);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const { productStock } = useSelector((s) => s.inventory);
  // Create mode: one row per warehouse to seed stock into.
  const [warehouseRows, setWarehouseRows] = useState([EMPTY_WAREHOUSE_ROW]);

  // Edit mode: a small form for assigning the product to a warehouse it isn't in yet.
  const [newWarehouseId, setNewWarehouseId] = useState("");
  const [newWarehouseQty, setNewWarehouseQty] = useState("");
  const [addingWarehouse, setAddingWarehouse] = useState(false);

  useEffect(() => {
    dispatch(fetchWarehouses());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) dispatch(fetchProduct(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit) dispatch(fetchProductStock(id));
    return () => dispatch(clearProductStock());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && existingProduct) {
      setForm({
        name: existingProduct.name,
        sku: existingProduct.sku,
        price: existingProduct.price,
        cost: existingProduct.cost,
        category: existingProduct.category,
        stockQuantity: existingProduct.stockQuantity,
        reorderPoint: existingProduct.reorderPoint,
        description: existingProduct.description,
        warehouse: existingProduct.warehouse,
        supplier: existingProduct.supplier,
        weight: existingProduct.weight,
        isActive: existingProduct.isActive,
      });
      setImagePreview(existingProduct.images?.[0] || null);
    }
  }, [isEdit, existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      notifyError("Image must be under 5MB");
      return;
    }
    const base64 = await fileToBase64(file);
    setImagePreview(base64);
  };

  const updateWarehouseRow = (index, field, value) => {
    setWarehouseRows((rows) =>
      rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  };
  const addWarehouseRow = () =>
    setWarehouseRows((rows) => [...rows, EMPTY_WAREHOUSE_ROW]);
  const removeWarehouseRow = (index) =>
    setWarehouseRows((rows) =>
      rows.length > 1 ? rows.filter((_, i) => i !== index) : rows,
    );

  const usedWarehouseIds = (excludeIndex) =>
    new Set(
      warehouseRows
        .filter((_, i) => i !== excludeIndex)
        .map((r) => r.warehouseId)
        .filter(Boolean),
    );

  const handleAddWarehouse = async () => {
    if (!newWarehouseId || !newWarehouseQty || Number(newWarehouseQty) < 0) {
      notifyError("Pick a warehouse and enter a quantity");
      return;
    }
    setAddingWarehouse(true);
    try {
      await dispatch(
        addProductWarehouse({
          id,
          warehouseId: newWarehouseId,
          quantity: Number(newWarehouseQty),
        }),
      ).unwrap();
      notifySuccess("Added to warehouse");
      dispatch(fetchProductStock(id));
      setNewWarehouseId("");
      setNewWarehouseQty("");
    } catch (err) {
      notifyError(err || "Could not add warehouse");
    } finally {
      setAddingWarehouse(false);
    }
  };

  const availableWarehousesToAdd = warehouses.filter(
    (w) => !productStock.some((r) => r.warehouse._id === w._id),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.sku.trim()) {
      notifyError("Product name and SKU are required");
      return;
    }

    // const payload = {
    //   ...form,
    //   price: Number(form.price) || 0,
    //   cost: Number(form.cost) || 0,
    //   stockQuantity: Number(form.stockQuantity) || 0,
    //   reorderPoint: Number(form.reorderPoint) || 0,
    //   weight: Number(form.weight) || 0,
    //   images: imagePreview ? [imagePreview] : [],
    // };

    const validRows = warehouseRows.filter(
      (r) => r.warehouseId && Number(r.quantity) >= 0 && r.quantity !== "",
    );
    if (!isEdit && validRows.length === 0) {
      notifyError(
        "Assign the product to at least one warehouse with a quantity",
      );
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      reorderPoint: Number(form.reorderPoint) || 0,
      weight: Number(form.weight) || 0,
      images: imagePreview ? [imagePreview] : [],
    };

    if (!isEdit) {
      delete payload.stockQuantity;
      delete payload.warehouse;
      payload.warehouseStocks = validRows.map((r) => ({
        warehouseId: r.warehouseId,
        quantity: Number(r.quantity),
      }));
    } else {
      payload.stockQuantity = Number(form.stockQuantity) || 0;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, ...payload })).unwrap();
        notifySuccess("Product updated");
        navigate(`/dashboard/products/${id}`);
      } else {
        const created = await dispatch(createProduct(payload)).unwrap();
        notifySuccess("Product created");
        navigate(`/dashboard/products/${created._id}`);
      }
    } catch (err) {
      notifyError(err || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="">
      <p className="text-sm text-faint mb-5 flex">
        <Link
          to="/dashboard/products"
          className="hover:text-white flex gap-2 items-center"
        >
          <FaArrowLeft size={11} />
          Products /
        </Link>
        {isEdit && existingProduct && (
          <>
            <span className="mr-1"></span>
            <span className="text-white">{existingProduct.name}</span>
            <span className="mx-1">/</span>
            <span className="text-white">Edit</span>
          </>
        )}
      </p>
      <h1 className="text-3xl font-semibold mt-1">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="rounded-xl border border-line bg-panel p-8 mt-6 flex flex-col gap-4"
      >
        {/* Image upload */}
        <div className="flex gap-2">
          {imagePreview && (
            <div className="relative h-20 w-20 rounded-md overflow-hidden border border-line">
              <img
                src={imagePreview}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center"
              >
                <FaTimes size={9} className="text-white" />
              </button>
            </div>
          )}

          <label className="flex flex-col w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-line bg-surface px-4 py-1 text-center cursor-pointer hover:border-white/30 transition-colors">
            <FaCloudUploadAlt size={22} className="text-faint" />
            <span className="text-xs text-faint">
              Drag and drop an image, or click to browse
            </span>
            <span className="text-[10px] text-faint">PNG or JPG up to 5MB</span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Fields */}
        <div className="flex gap-4 mt-6  gap-x-8 ">
          <div className="w-1/2 flex  flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">
                Product name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">SKU</span>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Category</span>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 ">
              <span className="text-xs font-medium text-muted">
                Description
              </span>
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2 resize-none"
              />
            </label>
          </div>

          <div className="w-1/2 flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Price</span>
              <div className="flex items-center rounded-md border border-line bg-surface focus-within:border-accent2">
                <span className="pl-3 text-sm text-faint">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Cost</span>
              <div className="flex items-center rounded-md border border-line bg-surface focus-within:border-accent2">
                <span className="pl-3 text-sm text-faint">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </label>

            {/* <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">
                Stock quantity
              </span>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                required
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
              />
            </label> */}

            {isEdit && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Total stock quantity</span>
                <input type="number" value={form.stockQuantity} disabled
                  className="rounded-md border border-line bg-surface/50 px-3 py-2.5 text-sm text-faint outline-none cursor-not-allowed" />
                <span className="text-[11px] text-faint">
                  Sum across every warehouse below — change it via Inventory's Stock Adjustment, not here.
                </span>
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">
                Weight (kg)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">
                Reorder point
              </span>
              <input
                type="number"
                min="0"
                name="reorderPoint"
                value={form.reorderPoint}
                onChange={handleChange}
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
              />
            </label>

            {/* <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Warehouse</span>
              <CustomDropdown
                options={[
                  { value: "", label: "No warehouse assigned" },
                  ...warehouses.map((w) => ({
                    value: w._id,
                    label: w.name,
                  })),
                ]}
                value={form.warehouse || ""}
                onChange={(value) =>
                  setForm((f) => ({ ...f, warehouse: value }))
                }
                className="w-full"
              />
            </label> */}

            {!isEdit ? (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-medium text-muted">Warehouses &amp; starting quantity</span>
    {warehouseRows.map((row, index) => {
      const used = usedWarehouseIds(index);
      return (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1">
            <CustomDropdown
              options={warehouses.filter((w) => !used.has(w._id)).map((w) => ({ value: w._id, label: w.name }))}
              value={row.warehouseId}
              onChange={(value) => updateWarehouseRow(index, "warehouseId", value)}
              placeholder="Select warehouse"
              className="w-full"
            />
          </div>
          <input type="number" min="0" placeholder="Qty" value={row.quantity}
            onChange={(e) => updateWarehouseRow(index, "quantity", e.target.value)}
            className="w-24 rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
          <button type="button" onClick={() => removeWarehouseRow(index)} disabled={warehouseRows.length === 1}
            className="rounded-md border border-line px-2.5 py-2.5 text-faint hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">
            <FaTimes size={11} />
          </button>
        </div>
      );
    })}
    <button type="button" onClick={addWarehouseRow} className="self-start text-xs text-accent2 hover:underline mt-1">
      + Add another warehouse
    </button>
  </div>
) : (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-medium text-muted">Stock by warehouse</span>
    <div className="rounded-md border border-line bg-surface divide-y divide-line">
      {productStock.length === 0 ? (
        <p className="px-3 py-2.5 text-sm text-faint">Not yet assigned to a warehouse.</p>
      ) : (
        productStock.map((r) => (
          <div key={r.warehouse._id} className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span className="text-white">{r.warehouse.name}</span>
            <span className="text-faint">{r.quantity} units</span>
          </div>
        ))
      )}
    </div>

    {availableWarehousesToAdd.length > 0 && (
      <div className="flex gap-2 items-center mt-1">
        <div className="flex-1">
          <CustomDropdown
            options={availableWarehousesToAdd.map((w) => ({ value: w._id, label: w.name }))}
            value={newWarehouseId}
            onChange={setNewWarehouseId}
            placeholder="Add to another warehouse"
            className="w-full"
          />
        </div>
        <input type="number" min="0" placeholder="Qty" value={newWarehouseQty}
          onChange={(e) => setNewWarehouseQty(e.target.value)}
          className="w-20 rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
        <button type="button" onClick={handleAddWarehouse} disabled={addingWarehouse}
          className="rounded-md border border-line px-3 py-2.5 text-sm text-white hover:border-white/40 disabled:opacity-60">
          {addingWarehouse ? "Adding…" : "Add"}
        </button>
      </div>
    )}
  </div>
)}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">Supplier</span>
              <input
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="Vantage Corp"
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-5 border-t border-line  ">
          <div className="flex w-full items-center justify-between gap-4">
            <span>
              <span className="text-sm text-white block">Active</span>
              <span className="text-xs text-faint">
                Visible in catalog and orderable
              </span>
            </span>

            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className={`relative flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-0 p-0 transition-colors ${
                form.isActive ? "bg-accent2" : "bg-line"
              }`}
            >
              <span
                className={`absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  form.isActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </form>

      <div className="border-t border-white/10 my-10"></div>

      <div className="flex justify-end gap-2 ">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-line px-4 py-2.5 text-sm text-white hover:border-white/40 transition-colors"
        >
          Cancel
        </button>
        <button
          form="product-form"
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/70 disabled:opacity-60 transition-colors"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </div>
  );
}
