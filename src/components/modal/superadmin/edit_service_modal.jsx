import { useEffect, useState } from "react";
import { databaseAPI } from "../../../services/databaseApi";
import { ConfirmationDialog } from "../customer/confirmation_dialog";
import { useToast } from "../../toast";

const CloseIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l10 10M15 5l-10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TrashIcon = ({ color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4h12M6 4V2h4v2M3 4l1 10a1 1 0 001 1h6a1 1 0 001-1l1-10M6 7v6M10 7v6" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  estimated_time: "",
  availability: true,
};

const normalizeService = (service = {}) => ({
  name: service.name ?? service.service_name ?? service.serviceName ?? "",
  category: service.category ?? service.service_category ?? service.serviceCategory ?? "",
  description: service.description ?? service.meta ?? "",
  price: service.price ?? "",
  estimated_time: service.estimated_time ?? service.est_time ?? "",
  availability: service.availability ?? service.available ?? true,
});

export const EditServiceModal = ({ isOpen, service, onClose, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(emptyForm);
  const [initialFormData, setInitialFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(emptyForm);
      setInitialFormData(emptyForm);
      setShowSaveConfirmation(false);
      setShowDiscardConfirmation(false);
      setShowRemoveConfirmation(false);
      return;
    }

    const nextForm = normalizeService(service);
    setFormData(nextForm);
    setInitialFormData(nextForm);
    setShowSaveConfirmation(false);
    setShowDiscardConfirmation(false);
    setShowRemoveConfirmation(false);
  }, [isOpen, service]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const dataResult = await databaseAPI.getTableData("services", 1000, 0);
        const uniqueCategories = [...new Set(
          (dataResult.data || [])
            .map((item) => item.category || item.service_category)
            .filter((value) => value && String(value).trim())
            .map((value) => String(value).trim())
        )].sort((left, right) => left.localeCompare(right));

        if (active) {
          setCategories(uniqueCategories.length > 0 ? uniqueCategories : ["General"]);
        }
      } catch (fetchError) {
        console.error("[EditServiceModal] Error fetching categories:", fetchError);
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

  useEffect(() => {
    if (!isOpen || showDiscardConfirmation) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setShowDiscardConfirmation(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showDiscardConfirmation]);

  const resetAndClose = () => {
    setFormData(emptyForm);
    setInitialFormData(emptyForm);
    setShowSaveConfirmation(false);
    setShowDiscardConfirmation(false);
    setShowRemoveConfirmation(false);
    onClose?.();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast({ message: "Service name is required", type: "error", duration: 3000 });
      return false;
    }

    if (!formData.category.trim()) {
      showToast({ message: "Category is required", type: "error", duration: 3000 });
      return false;
    }

    if (formData.price === "" || formData.price === null || formData.price === undefined) {
      showToast({ message: "Price is required", type: "error", duration: 3000 });
      return false;
    }

    return true;
  };

  const handleCloseAttempt = () => {
    if (isLoading) return;
    setShowDiscardConfirmation(true);
  };

  const handleConfirmDiscard = () => {
    resetAndClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setShowSaveConfirmation(true);
  };

  const submitUpdate = async (payload) => {
    const serviceId = service?.id;
    if (serviceId === undefined || serviceId === null) {
      throw new Error("Service ID is missing");
    }

    const response = await fetch(`/api/services/update?id=${encodeURIComponent(serviceId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || "Failed to update service");
    }

    return response.json();
  };

  const handleConfirmSave = async () => {
    setShowSaveConfirmation(false);
    setIsLoading(true);

    try {
      const result = await submitUpdate({
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description,
        price: formData.price,
        estimated_time: formData.estimated_time,
        availability: formData.availability,
      });

      const savedService = result.service || { ...service, ...result };
      onSave?.(savedService);
      resetAndClose();
    } catch (saveError) {
      console.error("[EditServiceModal] Error saving service:", saveError);
      showToast({
        message: saveError.message || "An error occurred while updating service",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRemove = async () => {
    setShowRemoveConfirmation(false);
    setIsLoading(true);

    try {
      const result = await submitUpdate({
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description,
        price: formData.price,
        estimated_time: formData.estimated_time,
        availability: false,
        is_deleted: true,
      });

      const removedService = result.service || { ...service, ...result, is_deleted: true, availability: false };
      onSave?.(removedService);
      resetAndClose();
    } catch (removeError) {
      console.error("[EditServiceModal] Error removing service:", removeError);
      showToast({
        message: removeError.message || "An error occurred while removing service",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const categoryOptions = [
    ...categories,
    ...(formData.category && !categories.includes(formData.category) ? [formData.category] : []),
  ];

  return (
    <>
      <ConfirmationDialog
        isOpen={showDiscardConfirmation}
        zIndex={3000}
        title="Leave without saving?"
        message="Are you sure you want to exit? Any unsaved information will be lost."
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowDiscardConfirmation(false)}
      />

      <ConfirmationDialog
        isOpen={showSaveConfirmation}
        zIndex={3000}
        title="Save Changes?"
        message="Apply these updates to the service?"
        confirmText="Save Changes"
        cancelText="Cancel"
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveConfirmation(false)}
      />

      <ConfirmationDialog
        isOpen={showRemoveConfirmation}
        zIndex={3000}
        title="Remove Service?"
        message="This will hide the service from the dashboard and mark it as deleted."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowRemoveConfirmation(false)}
      />

      <div style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(4px)",
      }} onClick={handleCloseAttempt}>
        <div style={{
          backgroundColor: "#231D1A",
          border: "1px solid rgba(221, 144, 29, 0.2)",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "520px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
          animation: "fadeInScale 0.3s ease-out",
        }} onClick={(event) => event.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ margin: 0, color: "#D4C5B9", fontSize: "18px", fontWeight: "600" }}>Edit Service</h2>
            <button
              onClick={handleCloseAttempt}
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
              <input type="checkbox" name="availability" checked={Boolean(formData.availability)} onChange={handleChange} disabled={isLoading} />
              Service available
            </label>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={handleCloseAttempt}
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
                type="button"
                onClick={() => setShowRemoveConfirmation(true)}
                disabled={isLoading}
                style={{
                  flex: "1 1 140px",
                  padding: "12px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "8px",
                  color: "#ef4444",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: isLoading ? 0.6 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(event) => {
                  if (isLoading) return;
                  event.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
                  event.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.55)";
                }}
                onMouseLeave={(event) => {
                  if (isLoading) return;
                  event.currentTarget.style.backgroundColor = "transparent";
                  event.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.35)";
                }}
              >
                <TrashIcon color="currentColor" />
                Remove
              </button>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  flex: "1 1 150px",
                  padding: "12px 16px",
                  backgroundColor: isLoading ? "#b8700a" : "#dd901d",
                  border: "none",
                  borderRadius: "8px",
                  color: "#1a1a1a",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(event) => {
                  if (isLoading) return;
                  event.currentTarget.style.backgroundColor = "#e6a326";
                }}
                onMouseLeave={(event) => {
                  if (isLoading) return;
                  event.currentTarget.style.backgroundColor = "#dd901d";
                }}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

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
      </div>
    </>
  );
};

export default EditServiceModal;