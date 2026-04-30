import { useState } from "react";

const CloseIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l10 10M15 5l-10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const AddServiceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    description: '',
    price: '',
    estimated_time: '',
    availability: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      if (!formData.name.trim()) {
        setError('Service name is required');
        setIsLoading(false);
        return;
      }

      if (!formData.price) {
        setError('Price is required');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/services/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category || 'General',
          description: formData.description,
          price: formData.price,
          estimated_time: formData.estimated_time,
          availability: formData.availability
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create service');
      }

      const result = await response.json();
      console.log('[AddServiceModal] Service created:', result);
      
      onSave(result);
      setFormData({ name: '', category: 'General', description: '', price: '', estimated_time: '', availability: true });
      onClose();
    } catch (err) {
      console.error('[AddServiceModal] Error:', err);
      setError(err.message || 'An error occurred while creating service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', category: 'General', description: '', price: '', estimated_time: '', availability: true });
    setError(null);
    onClose();
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
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        animation: 'fadeInScale 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#D4C5B9', fontSize: '18px', fontWeight: '600' }}>
            Add New Service
          </h2>
          <button
            onClick={handleClose}
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
              Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter service name"
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

          {/* Category Field */}
          <div>
            <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
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

          {/* Description Field */}
          <div>
            <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter service description"
              rows="3"
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
                fontFamily: 'inherit',
                resize: 'vertical'
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

          {/* Price Field */}
          <div>
            <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
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
                MozAppearance: 'textfield'
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

          {/* Estimated Time Field */}
          <div>
            <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              name="estimated_time"
              value={formData.estimated_time}
              onChange={handleChange}
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
                MozAppearance: 'textfield'
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

          {/* Availability Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              id="availability-check"
              style={{
                cursor: 'pointer',
                width: '16px',
                height: '16px'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={handleClose}
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
              {isLoading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

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
