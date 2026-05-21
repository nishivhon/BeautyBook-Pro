import { useEffect, useState } from "react";

const CloseIcon = ({ color = "currentColor" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l10 10M15 5l-10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ConfirmationDialog = ({ 
  isOpen = false,
  title = "Leave without saving?",
  message = "Are you sure you want to exit? Any unsaved information will be lost.",
  confirmText = "Leave",
  cancelText = "Stay",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px 24px',
        maxWidth: '360px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'fade-up 0.3s ease forwards',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a0f00', marginBottom: '12px', textAlign: 'center', fontFamily: 'Inter, sans-serif', marginTop: 0 }}>
          {title}
        </h2>
        <p style={{ fontSize: '14px', color: '#665544', marginBottom: '24px', textAlign: 'center', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', marginTop: 0 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '12px 16px',
              background: '#dd901d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#c17a14';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#dd901d';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '12px 16px',
              background: 'transparent',
              color: '#dd901d',
              border: '1.5px solid #dd901d',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(221, 144, 29, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AddClientModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Client name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
    setFormData({ name: '', email: '', phone: '' });
    setError(null);
    onClose();
  };

  const handleConfirmAdd = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create client');
      }

      const result = await response.json();
      console.log('[AddClientModal] Client created:', result);
      
      onSave(result);
      setFormData({ name: '', email: '', phone: '' });
      onClose();
    } catch (err) {
      console.error('[AddClientModal] Error:', err);
      setError(err.message || 'An error occurred while creating client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '' });
    setError(null);
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
              Add New Client
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
                Client Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
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

            {/* Email Field */}
            <div>
              <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
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

            {/* Phone Field */}
            <div>
              <label style={{ display: 'block', color: '#D4C5B9', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 16px',
                marginTop: '8px',
                background: '#dd901d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.background = '#c17a14', e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isLoading && (e.target.style.background = '#dd901d', e.target.style.transform = 'translateY(0)')}
            >
              {isLoading ? 'Adding...' : 'Add Client'}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        title="Leave without saving?"
        message="Are you sure you want to exit? Any unsaved information will be lost."
        confirmText="Leave"
        cancelText="Stay"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowConfirmation(false)}
      />
    </>
  );
};
