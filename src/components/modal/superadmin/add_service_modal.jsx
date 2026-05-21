import { useEffect, useState } from "react";
import { databaseAPI } from "../../../services/databaseApi";

const CloseIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l10 10M15 5l-10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ConfirmationDialog = ({
  isOpen = false,
  title = "Leave without saving?",
  message = "Are you sure you want to exit? Any unsaved information will be lost.",
  confirmText = "Leave",
  cancelText = "Stay",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3000,
      backdropFilter: "none",
    }} onClick={onCancel}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px 24px",
        maxWidth: "360px",
        width: "90%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        animation: "fade-up 0.3s ease forwards",
      }} onClick={(event) => event.stopPropagation()}>
        <h2 style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#1a0f00",
          marginBottom: "12px",
          textAlign: "center",
          fontFamily: "Inter, sans-serif",
          marginTop: 0,
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: "14px",
          color: "#665544",
          marginBottom: "24px",
          textAlign: "center",
          lineHeight: "1.5",
          fontFamily: "Inter, sans-serif",
          marginTop: 0,
        }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "12px 16px",
              background: "#dd901d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "#c17a14";
              event.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "#dd901d";
              event.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "12px 16px",
              background: "transparent",
              color: "#dd901d",
              border: "1.5px solid #dd901d",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "rgba(221, 144, 29, 0.1)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "transparent";
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  estimated_time: "",
  availability: true,
};

export const AddServiceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || showConfirmation) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setShowConfirmation(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showConfirmation]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const dataResult = await databaseAPI.getTableData("services", 1000, 0);
        const uniqueCategories = [...new Set(
          (dataResult.data || [])
            .map((service) => service.category || service.service_category)
            .filter((value) => value && String(value).trim())
            .map((value) => String(value).trim())
        )].sort((left, right) => left.localeCompare(right));

        if (active) {
          setCategories(uniqueCategories.length > 0 ? uniqueCategories : ["General"]);
        }
      } catch (fetchError) {
        console.error("[AddServiceModal] Error fetching categories:", fetchError);
        if (active) {
          setCategories(["General"]);
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Service name is required");
      return false;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      return false;
    }

    if (formData.price === "" || formData.price === null || formData.price === undefined) {
      setError("Price is required");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    void handleConfirmAdd();
  };

  const handleExitAttempt = () => {
    if (isLoading || showConfirmation) return;
    setShowConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowConfirmation(false);
    setFormData(emptyForm);
    setError(null);
    onClose?.();
  };

  const handleConfirmAdd = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/services/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category.trim(),
          description: formData.description,
          price: formData.price,
          estimated_time: formData.estimated_time,
          availability: formData.availability,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "Failed to create service");
      }

      const result = await response.json();
      onSave?.(result.service || result);
      setFormData(emptyForm);
      onClose?.();
    } catch (saveError) {
      console.error("[AddServiceModal] Error:", saveError);
      setError(saveError.message || "An error occurred while creating service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(emptyForm);
    setError(null);
    setShowConfirmation(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const categoryOptions = categories.length > 0 ? categories : ["General"];

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(4px)",
      }} onClick={handleExitAttempt}>
        <div style={{
          backgroundColor: "#231D1A",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          borderRadius: "12px",
          padding: "32px",
          paddingRight: "36px",
          boxSizing: "border-box",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          scrollbarGutter: "stable both-edges",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
          animation: "fadeInScale 0.3s ease-out",
        }} onClick={(event) => event.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ margin: 0, color: "#D4C5B9", fontSize: "18px", fontWeight: "600" }}>Add New Service</h2>
            <button
              onClick={handleExitAttempt}
              disabled={isLoading}
              style={{
                background: "none",
                border: "none",
                color: "#988f81",
                cursor: isLoading ? "not-allowed" : "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s",
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={(event) => !isLoading && (event.currentTarget.style.color = "#D4C5B9")}
              onMouseLeave={(event) => !isLoading && (event.currentTarget.style.color = "#988f81")}
            >
              <CloseIcon />
            </button>
          </div>

          {error && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "16px",
              color: "#EF4444",
              fontSize: "13px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "#D4C5B9", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Service Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter service name"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(35, 29, 26, 0.8)",
                  border: "1px solid rgba(152, 143, 129, 0.3)",
                  borderRadius: "6px",
                  color: "#D4C5B9",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  outline: "none",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onFocus={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(221, 144, 29, 0.5)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.95)";
                }}
                onBlur={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(152, 143, 129, 0.3)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.8)";
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#D4C5B9", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading || categoriesLoading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(35, 29, 26, 0.8)",
                  border: "1px solid rgba(152, 143, 129, 0.3)",
                  borderRadius: "6px",
                  color: "#D4C5B9",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  outline: "none",
                  opacity: isLoading || categoriesLoading ? 0.6 : 1,
                  cursor: isLoading || categoriesLoading ? "not-allowed" : "pointer",
                  appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4C5B9' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  paddingRight: "32px",
                }}
                onFocus={(event) => {
                  if (isLoading || categoriesLoading) return;
                  event.target.style.borderColor = "rgba(221, 144, 29, 0.5)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.95)";
                }}
                onBlur={(event) => {
                  if (isLoading || categoriesLoading) return;
                  event.target.style.borderColor = "rgba(152, 143, 129, 0.3)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.8)";
                }}
              >
                <option value="">{categoriesLoading ? "Loading categories..." : "Select a category"}</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", color: "#D4C5B9", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter service description"
                rows="3"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(35, 29, 26, 0.8)",
                  border: "1px solid rgba(152, 143, 129, 0.3)",
                  borderRadius: "6px",
                  color: "#D4C5B9",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  outline: "none",
                  fontFamily: "inherit",
                  resize: "vertical",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onFocus={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(221, 144, 29, 0.5)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.95)";
                }}
                onBlur={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(152, 143, 129, 0.3)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.8)";
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#D4C5B9", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(35, 29, 26, 0.8)",
                  border: "1px solid rgba(152, 143, 129, 0.3)",
                  borderRadius: "6px",
                  color: "#D4C5B9",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  outline: "none",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onFocus={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(221, 144, 29, 0.5)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.95)";
                }}
                onBlur={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(152, 143, 129, 0.3)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.8)";
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#D4C5B9", fontSize: "13px", fontWeight: "500", marginBottom: "6px" }}>
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleChange}
                placeholder="30"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(35, 29, 26, 0.8)",
                  border: "1px solid rgba(152, 143, 129, 0.3)",
                  borderRadius: "6px",
                  color: "#D4C5B9",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  outline: "none",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onFocus={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(221, 144, 29, 0.5)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.95)";
                }}
                onBlur={(event) => {
                  if (isLoading) return;
                  event.target.style.borderColor = "rgba(152, 143, 129, 0.3)";
                  event.target.style.backgroundColor = "rgba(35, 29, 26, 0.8)";
                }}
              />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#D4C5B9", fontSize: "13px", fontWeight: "500" }}>
              <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} disabled={isLoading} />
              Service available
            </label>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleExitAttempt}
                disabled={isLoading}
                style={{
                  flex: "1 1 120px",
                  padding: "12px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(152, 143, 129, 0.3)",
                  borderRadius: "8px",
                  color: "#988f81",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: isLoading ? 0.6 : 1,
                }}
                onMouseEnter={(event) => {
                  if (isLoading) return;
                  event.currentTarget.style.borderColor = "rgba(152, 143, 129, 0.5)";
                  event.currentTarget.style.color = "#D4C5B9";
                }}
                onMouseLeave={(event) => {
                  if (isLoading) return;
                  event.currentTarget.style.borderColor = "rgba(152, 143, 129, 0.3)";
                  event.currentTarget.style.color = "#988f81";
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading || categoriesLoading}
                style={{
                  flex: "1 1 150px",
                  padding: "12px 16px",
                  backgroundColor: isLoading || categoriesLoading ? "#b8700a" : "#dd901d",
                  border: "none",
                  borderRadius: "8px",
                  color: "#1a1a1a",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: isLoading || categoriesLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: isLoading || categoriesLoading ? 0.7 : 1,
                }}
                onMouseEnter={(event) => {
                  if (isLoading || categoriesLoading) return;
                  event.currentTarget.style.backgroundColor = "#e6a326";
                }}
                onMouseLeave={(event) => {
                  if (isLoading || categoriesLoading) return;
                  event.currentTarget.style.backgroundColor = "#dd901d";
                }}
              >
                {isLoading ? "Adding..." : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Leave without saving?"
        message="Are you sure you want to exit? Any unsaved information will be lost."
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowConfirmation(false)}
      />

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default AddServiceModal;