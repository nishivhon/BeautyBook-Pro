import { useState, useEffect } from "react";
import { databaseAPI } from "../../../services/databaseApi";
import { ConfirmationDialog } from "../customer/confirmation_dialog";
import { useToast } from "../../toast";

const CloseIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l10 10M15 5l-10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const AddStaffModal = ({ isOpen, onClose, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    names: '',
    category_specialty: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || showConfirmation) return;

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setShowConfirmation(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showConfirmation]);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const tablesInfo = await databaseAPI.getTablesInfo(['services']);
      if (tablesInfo && Array.isArray(tablesInfo) && tablesInfo.length > 0) {
        const dataResult = await databaseAPI.getTableData('services', 1000, 0);
        const data = dataResult.data || [];
        
        const uniqueCategories = [...new Set(
          data
            .map(s => s.category || s.service_category)
            .filter(c => c && c.trim())
        )].sort();
        
        setCategories(uniqueCategories.length > 0 ? uniqueCategories : ['General']);
      }
    } catch (err) {
      console.error('[AddStaffModal] Error fetching categories:', err);
      setCategories(['General']);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => {
      const selected = Array.isArray(prev.category_specialty) ? prev.category_specialty : [];
      const nextSelected = selected.includes(specialty)
        ? selected.filter(item => item !== specialty)
        : [...selected, specialty];

      return {
        ...prev,
        category_specialty: nextSelected,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.names.trim()) {
      showToast({ message: 'Staff name is required', type: 'error', duration: 3000 });
      return;
    }

    if (!Array.isArray(formData.category_specialty) || formData.category_specialty.length === 0) {
      showToast({ message: 'Select at least one specialty', type: 'error', duration: 3000 });
      return;
    }

    await handleConfirmAdd();
  };

  const handleExitAttempt = () => {
    if (isLoading || showConfirmation) return;
    setShowConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowConfirmation(false);
    setFormData({ names: '', category_specialty: [] });
    onClose();
  };

  const selectedSpecialties = Array.isArray(formData.category_specialty) ? formData.category_specialty : [];

  const handleConfirmAdd = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/staffs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names: formData.names,
          category_specialty: selectedSpecialties.join(', ')
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create staff');
      }

      const result = await response.json();
      console.log('[AddStaffModal] Staff created:', result);
      
      onSave(result.staff);
      setFormData({ names: '', category_specialty: [] });
      onClose();
    } catch (err) {
      console.error('[AddStaffModal] Error:', err);
      showToast({
        message: err.message || 'An error occurred while creating staff',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ names: '', category_specialty: [] });
    setShowConfirmation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)'
      }} onClick={handleExitAttempt}>
        <div style={{
          backgroundColor: '#231D1A',
          border: '1px solid rgba(221, 144, 29, 0.2)',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          animation: 'fadeInScale 0.3s ease-out'
        }} onClick={(event) => event.stopPropagation()}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: '#D4C5B9', fontSize: '18px', fontWeight: '600' }}>
              Add New Staff Member
            </h2>
            <button
              onClick={handleExitAttempt}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                color: '#988f81',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
                opacity: isLoading ? 0.5 : 1
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.color = '#D4C5B9')}
              onMouseLeave={(e) => !isLoading && (e.currentTarget.style.color = '#988f81')}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Error Message */}
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name Field */}
            <div>
              <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                Staff Name
              </label>
              <input
                type="text"
                name="names"
                value={formData.names}
                onChange={handleChange}
                placeholder="Enter staff name"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(35, 29, 26, 0.8)',
                  border: '1px solid rgba(152, 143, 129, 0.3)',
                  borderRadius: '6px',
                  color: '#D4C5B9',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                  outline: 'none',
                  opacity: isLoading ? 0.6 : 1
                }}
                onFocus={(e) => !isLoading && (e.target.style.borderColor = 'rgba(221, 144, 29, 0.5)', e.target.style.backgroundColor = 'rgba(35, 29, 26, 0.95)')}
                onBlur={(e) => !isLoading && (e.target.style.borderColor = 'rgba(152, 143, 129, 0.3)', e.target.style.backgroundColor = 'rgba(35, 29, 26, 0.8)')}
              />
            </div>

            {/* Specialty Field - Checkboxes */}
            <div>
              <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                Specialty / Category
              </label>
              <div style={{
                width: '100%',
                padding: '5px 5px',
                backgroundColor: 'rgba(35, 29, 26, 0.8)',
                border: '1px solid rgba(152, 143, 129, 0.3)',
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                boxSizing: 'border-box',
                opacity: (isLoading || categoriesLoading) ? 0.6 : 1,
                paddingRight: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  boxSizing: 'border-box',
                  padding: '5px 5px'
                }} className="service-list-scroll-limited">
                  {categoriesLoading ? (
                    <div style={{ color: '#988f81', fontSize: '13px' }}>Loading categories...</div>
                  ) : (
                    categories.map((category) => {
                      const checked = selectedSpecialties.includes(category);
                      return (
                        <label
                          key={category}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: checked ? '#D4C5B9' : '#988f81',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            className="staff-specialty-checkbox"
                            checked={checked}
                            disabled={isLoading || categoriesLoading}
                            onChange={() => handleSpecialtyToggle(category)}
                          />
                          <span>{category}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
              <div style={{ color: '#988f81', fontSize: '12px', marginTop: '6px' }}>
                Select one or more specialties.
              </div>
            </div>

            {/* Buttons */}
            <button
              type="submit"
              disabled={isLoading || categoriesLoading}
              style={{
                padding: '12px 16px',
                marginTop: '8px',
                background: '#dd901d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (isLoading || categoriesLoading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: (isLoading || categoriesLoading) ? 0.6 : 1
              }}
              onMouseEnter={(e) => !isLoading && !categoriesLoading && (e.target.style.background = '#c17a14', e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isLoading && !categoriesLoading && (e.target.style.background = '#dd901d', e.target.style.transform = 'translateY(0)')}
            >
              {isLoading ? 'Adding...' : 'Add Staff Member'}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        zIndex={3000}
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
        select {
          appearance: none;
        }
        .staff-specialty-checkbox {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border: 1.5px solid rgba(152, 143, 129, 0.8);
          border-radius: 5px;
          background: rgba(35, 29, 26, 0.95);
          display: inline-grid;
          place-content: center;
          flex: 0 0 auto;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .staff-specialty-checkbox::before {
          content: '';
          width: 10px;
          height: 10px;
          transform: scale(0);
          transition: transform 0.15s ease-in-out;
          box-shadow: inset 1em 1em #1a1a1a;
          clip-path: polygon(14% 44%, 0 65%, 38% 100%, 100% 18%, 82% 0, 37% 56%);
        }
        .staff-specialty-checkbox:checked {
          background: #dd901d;
          border-color: #dd901d;
        }
        .staff-specialty-checkbox:checked::before {
          transform: scale(1);
        }
        .staff-specialty-checkbox:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </>
  );
};
