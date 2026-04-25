import { useState, useEffect } from "react";

const CloseIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l10 10M15 5l-10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const EditStaffModal = ({ staff, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    names: '',
    category_specialty: '',
    employment: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (staff && isOpen) {
      setFormData({
        names: staff.names || '',
        category_specialty: staff.category_specialty || '',
        employment: staff.employment !== false
      });
      setError(null);
    }
  }, [staff, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!staff || !staff.id) {
        setError('Staff ID is missing');
        setIsLoading(false);
        return;
      }

      if (!formData.names.trim()) {
        setError('Staff name is required');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/staffs/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: staff.id,
          names: formData.names,
          category_specialty: formData.category_specialty,
          employment: formData.employment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to update staff');
      }

      const result = await response.json();
      console.log('[EditStaffModal] Staff updated:', result);
      
      onSave(result.staff);
      onClose();
    } catch (err) {
      console.error('[EditStaffModal] Error:', err);
      setError(err.message || 'An error occurred while updating staff');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
    }}>
      <div style={{
        backgroundColor: '#231D1A',
        border: '1px solid rgba(221, 144, 29, 0.2)',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        animation: 'fadeInScale 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#D4C5B9', fontSize: '18px', fontWeight: '600' }}>
            Edit Staff Member
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#988f81',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#D4C5B9'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#988f81'}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#EF4444',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}

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
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(221, 144, 29, 0.5)';
                e.target.style.backgroundColor = 'rgba(35, 29, 26, 0.95)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                e.target.style.backgroundColor = 'rgba(35, 29, 26, 0.8)';
              }}
            />
          </div>

          {/* Specialty Field */}
          <div>
            <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
              Specialty / Category
            </label>
            <input
              type="text"
              name="category_specialty"
              value={formData.category_specialty}
              onChange={handleChange}
              placeholder="e.g., Hair Styling, Nail Art"
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
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(221, 144, 29, 0.5)';
                e.target.style.backgroundColor = 'rgba(35, 29, 26, 0.95)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                e.target.style.backgroundColor = 'rgba(35, 29, 26, 0.8)';
              }}
            />
          </div>

          {/* Employment Status Field */}
          <div>
            <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
              Employment Status
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, employment: true }))}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  backgroundColor: formData.employment ? '#dd901d' : 'rgba(35, 29, 26, 0.8)',
                  border: `1px solid ${formData.employment ? 'rgba(221, 144, 29, 0.5)' : 'rgba(152, 143, 129, 0.3)'}`,
                  borderRadius: '6px',
                  color: formData.employment ? '#1a1a1a' : '#D4C5B9',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!formData.employment) {
                    e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                    e.currentTarget.style.backgroundColor = 'rgba(35, 29, 26, 0.95)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!formData.employment) {
                    e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                    e.currentTarget.style.backgroundColor = 'rgba(35, 29, 26, 0.8)';
                  }
                }}
              >
                True (Employed)
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, employment: false }))}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  backgroundColor: !formData.employment ? '#dd901d' : 'rgba(35, 29, 26, 0.8)',
                  border: `1px solid ${!formData.employment ? 'rgba(221, 144, 29, 0.5)' : 'rgba(152, 143, 129, 0.3)'}`,
                  borderRadius: '6px',
                  color: !formData.employment ? '#1a1a1a' : '#D4C5B9',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (formData.employment) {
                    e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                    e.currentTarget.style.backgroundColor = 'rgba(35, 29, 26, 0.95)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.employment) {
                    e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                    e.currentTarget.style.backgroundColor = 'rgba(35, 29, 26, 0.8)';
                  }
                }}
              >
                False (Not Employed)
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(152, 143, 129, 0.3)',
                borderRadius: '6px',
                color: '#988f81',
                fontSize: '13px',
                fontWeight: '500',
                cursor: isLoading ? 'default' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)';
                  e.currentTarget.style.color = '#D4C5B9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)';
                  e.currentTarget.style.color = '#988f81';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: isLoading ? '#b8700a' : '#dd901d',
                border: 'none',
                borderRadius: '6px',
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: '600',
                cursor: isLoading ? 'default' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#e6a326';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#dd901d';
                }
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
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
  );
};
