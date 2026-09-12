import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaEllipsisH, FaCube } from "react-icons/fa";
import { fetchProducts, fetchCategories } from "../../store/productsSlice.js";
import { usePermission } from "../../hooks/usePermission.js";
import StatusBadge from "../../components/dashboard/StatusBadge.jsx";
import CustomDropdown from "../../components/common/CustomDropdown.jsx";

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canWrite = usePermission("products", "write");

  const { items, total, page, limit, categories } = useSelector(
    (s) => s.products,
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Low Stock", label: "Low Stock" },
    { value: "Out of Stock", label: "Out of Stock" },
    { value: "Inactive", label: "Inactive" },
  ];

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        search,
        status: statusFilter,
        category: activeCategory,
        page: currentPage,
        limit: 8,
      }),
    );
  }, [dispatch, search, statusFilter, activeCategory, currentPage]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="text-sm text-faint mt-1">Manage your product catalog</p>
        </div>
        {canWrite && (
          <button
            onClick={() => navigate("/dashboard/products/new")}
            className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
          >
            <FaPlus size={11} /> Add Product
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm flex-1">
          <FaSearch size={12} className="text-faint" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search products by name or SKU"
            className="bg-transparent outline-none text-white placeholder:text-faint flex-1"
          />
        </div>
            
        <CustomDropdown
          options={[
            { value: "All", label: "All Categories" },
            ...categories.map((c) => ({
              value: c,
              label: c,
            })),
          ]}
          value={activeCategory}
          onChange={(value) => {
            setActiveCategory(value);
            setCurrentPage(1);
          }}
          className="w-44"
        />
        <CustomDropdown
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          className="w-40"
        />
      </div>

      <div className="flex items-center gap-1 mt-4 border-b border-line overflow-x-auto">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeCategory === cat
                ? "text-white border-white"
                : "text-faint border-transparent hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-line bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-faint border-b border-line text-xs">
              <th className="px-4 py-3 font-normal">Product</th>
              <th className="px-4 py-3 font-normal">SKU</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Stock</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-faint text-sm"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr
                  key={p._id}
                  onClick={() => navigate(`/dashboard/products/${p._id}`)}
                  className="border-b border-line last:border-0 hover:bg-white/[0.02] cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-8 w-8 rounded-md bg-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaCube size={12} className="text-faint" />
                        )}
                      </span>
                      {p.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted font-mono">{p.sku}</td>
                  <td className="px-4 py-3 text-muted">{p.category}</td>
                  <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{p.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td
                    className="px-4 py-3 text-faint"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaEllipsisH
                      size={12}
                      className="cursor-pointer hover:text-white"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-faint">
        <span>
          Showing {items.length === 0 ? 0 : (currentPage - 1) * limit + 1}-
          {Math.min(currentPage * limit, total)} of {total} products
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="disabled:opacity-40 hover:text-white"
          >
            Previous
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="disabled:opacity-40 hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
