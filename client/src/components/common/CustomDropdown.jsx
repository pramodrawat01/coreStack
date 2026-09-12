import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close with Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex w-full items-center justify-between
          rounded-md border border-line
          bg-surface px-3 py-2
          text-sm
          transition-colors
          ${open ? "border-accent2" : ""}
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <span className={selectedOption ? "text-white" : "text-muted"}>
          {selectedOption?.label || placeholder}
        </span>

        <FiChevronDown
          size={17}
          className={`text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-md border border-line bg-panel shadow-xl">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    flex w-full items-center justify-between
                    rounded-md px-3 py-2.5
                    text-left text-sm
                    transition-colors
                    ${
                      isSelected
                        ? "bg-white/[0.08] text-white"
                        : "text-muted hover:bg-white/[0.05] hover:text-white"
                    }
                  `}
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <FiCheck size={16} className="text-accent2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}