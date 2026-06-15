import { useEffect, useMemo, useState } from "react";

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
    <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const modalStyles = `
  .assign-stylist-modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .assign-stylist-modal-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .assign-stylist-modal-content::-webkit-scrollbar-thumb {
    background: rgba(221, 144, 29, 0.4);
    border-radius: 3px;
  }

  .assign-stylist-modal-content::-webkit-scrollbar-thumb:hover {
    background: rgb(221, 144, 29);
  }
`;

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const isStylistAvailable = (staff) => {
  const statusValue = normalizeValue(staff?.status);
  const inServiceValue = normalizeValue(staff?.in_service);

  if (!statusValue && !inServiceValue) return false;

  if (["off", "on-break"].includes(statusValue) || ["off", "on-break"].includes(inServiceValue)) {
    return false;
  }

  if (inServiceValue === "in-service") {
    return false;
  }

  return statusValue === "avail" || inServiceValue === "avail";
};

const getStaffStatusLabel = (staff) => {
  const statusValue = normalizeValue(staff?.status);
  const inServiceValue = normalizeValue(staff?.in_service);

  if (inServiceValue === "in-service") return "In Service";
  if (inServiceValue === "on-break" || statusValue === "on-break") return "On Break";
  if (statusValue === "off" || inServiceValue === "off") return "Off Today";
  if (statusValue === "avail" || inServiceValue === "avail") return "Available";

  return staff?.status || staff?.in_service || "Unknown";
};

export const AssignStylistModal = ({ isOpen, title, message, onClose, onSelect, initialStaffName = null, initialStaffId = null }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setStaff([]);
      setLoading(false);
      setError(null);
      setSelectedStaffId(null);
      return undefined;
    }

    let cancelled = false;

    const loadStaff = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/staffs/with-any');
        if (!response.ok) {
          throw new Error('Failed to load available stylists');
        }

        const result = await response.json();
        const allStaff = Array.isArray(result.staff) ? result.staff : [];
        const availableStaff = allStaff.filter(isStylistAvailable);

        // Ensure the originally assigned staff is present in the choices even if not available
        let mergedStaff = [...availableStaff];
        if (initialStaffId || initialStaffName) {
          const normName = initialStaffName ? String(initialStaffName).toLowerCase().trim() : null;
          const orig = allStaff.find(s => (
            (initialStaffId && String(s.id) === String(initialStaffId)) ||
            (normName && String(s.names).toLowerCase().trim() === normName)
          ));

          if (orig) {
            const exists = mergedStaff.some(s => String(s.id) === String(orig.id));
            if (!exists) mergedStaff = [orig, ...mergedStaff];
          }
        }

        if (!cancelled) {
          setStaff(mergedStaff);
          // Preselect staff if initialStaffId or initialStaffName provided
          let preselectId = null;
          if (initialStaffId) {
            preselectId = mergedStaff.find(s => String(s.id) === String(initialStaffId))?.id ?? null;
          }
          if (!preselectId && initialStaffName) {
            const norm = String(initialStaffName).toLowerCase().trim();
            preselectId = mergedStaff.find(s => String(s.names).toLowerCase().trim() === norm)?.id ?? null;
          }
          setSelectedStaffId(preselectId ?? mergedStaff[0]?.id ?? null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
          setStaff([]);
          setSelectedStaffId(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStaff();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const selectedStaff = useMemo(
    () => staff.find((member) => String(member.id) === String(selectedStaffId)) || null,
    [staff, selectedStaffId]
  );

  if (!isOpen) return null;

  const handleSelect = () => {
    if (!selectedStaff) return;
    onSelect?.(selectedStaff);
  };

  return (
    <>
      <style>{modalStyles}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.72)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px',
          fontFamily: 'Inter, sans-serif',
        }}
        onClick={onClose}
      >
        <div
          className="assign-stylist-modal-content"
          style={{
            width: 'min(640px, 100%)',
            maxHeight: '84vh',
            overflowY: 'auto',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(221, 144, 29, 0.18)',
            borderRadius: '16px',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8)',
            padding: '28px',
            color: '#f5f5f5',
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{title || 'Choose a stylist'}</h2>
              <p style={{ margin: '8px 0 0', color: '#b9b1a8', lineHeight: 1.5 }}>{message || 'Select an available stylist to start this appointment.'}</p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#988f81',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close stylist picker"
            >
              <CloseIcon size={20} color="currentColor" />
            </button>
          </div>

          {loading && (
            <div style={{ padding: '20px 0', textAlign: 'center', color: '#b9b1a8' }}>
              Loading available stylists...
            </div>
          )}

          {!loading && error && (
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          {!loading && !error && staff.length === 0 && (
            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.04)', color: '#d6cfc7' }}>
              No available stylists right now.
            </div>
          )}

          {!loading && !error && staff.length > 0 && (
            <div style={{ display: 'grid', gap: '12px', marginTop: '8px' }}>
              {staff.map((member) => {
                const isSelected = String(member.id) === String(selectedStaffId);
                const statusLabel = getStaffStatusLabel(member);
                const specialtyLabel = Array.isArray(member.category_specialty)
                  ? member.category_specialty.filter(Boolean).join(', ')
                  : String(member.category_specialty || 'General').trim() || 'General';

                return (
                  <button
                    key={member.id}
                    onClick={() => setSelectedStaffId(member.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: '14px',
                      border: isSelected ? '1px solid rgba(221, 144, 29, 0.9)' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: isSelected ? 'rgba(221, 144, 29, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      padding: '14px 16px',
                      color: '#f5f5f5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700 }}>{member.names}</span>
                        <span style={{ fontSize: '12px', color: '#b9b1a8' }}>{statusLabel}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#c8c0b7' }}>{specialtyLabel}</div>
                    </div>

                    <span style={{
                      minWidth: '28px',
                      height: '28px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isSelected ? '1px solid rgba(221, 144, 29, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: isSelected ? '#dd901d' : '#988f81',
                    }}>
                      {isSelected ? <CheckIcon size={14} color="currentColor" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={onClose}
              style={{
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'transparent',
                color: '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedStaff}
              style={{
                borderRadius: '12px',
                padding: '12px 18px',
                border: 'none',
                backgroundColor: selectedStaff ? '#dd901d' : '#6b6b6b',
                color: '#fff',
                cursor: selectedStaff ? 'pointer' : 'not-allowed',
                fontWeight: 700,
              }}
            >
              Use Selected Stylist
            </button>
          </div>
        </div>
      </div>
    </>
  );
};