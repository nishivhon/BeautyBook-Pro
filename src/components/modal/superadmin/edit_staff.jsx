import { useState, useEffect } from "react";

import { databaseAPI } from "../../../services/databaseApi";
import { ConfirmationDialog } from "../customer/confirmation_dialog";
import { useToast } from "../../toast";



const CloseIcon = ({ color = "currentColor" }) => (

  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">

    <path d="M5 5l10 10M15 5l-10 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>

  </svg>

);



const parseCategorySpecialty = (value) => {

  if (!value) return [];

  if (Array.isArray(value)) {

    return value.map((item) => String(item).trim()).filter(Boolean);

  }

  return String(value)

    .split(',')

    .map((item) => item.trim())

    .filter(Boolean);

};



export const EditStaffModal = ({ staff, isOpen, onClose, onSave }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({

    names: '',

    category_specialty: [],

    employment: true

  });

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [categories, setCategories] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(false);



  useEffect(() => {

    if (isOpen && categories.length === 0) {

      fetchCategories();

    }

  }, [isOpen]);

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

    if (staff && isOpen) {

      setFormData({

        names: staff.names || '',

        category_specialty: parseCategorySpecialty(staff.category_specialty),

        employment: staff.employment !== false

      });

    }

  }, [staff, isOpen]);



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

      console.error('[EditStaffModal] Error fetching categories:', err);

      setCategories(['General']);

    } finally {

      setCategoriesLoading(false);

    }

  };



  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData(prev => ({

      ...prev,

      [name]: type === 'checkbox' ? checked : value

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

  const handleExitAttempt = () => {
    if (isLoading || showConfirmation) return;
    setShowConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowConfirmation(false);
    if (staff && isOpen) {
      setFormData({
        names: staff.names || '',
        category_specialty: parseCategorySpecialty(staff.category_specialty),
        employment: staff.employment !== false,
      });
    }
    onClose();
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setIsLoading(true);



    try {

      if (!staff || !staff.id) {

        showToast({ message: 'Staff ID is missing', type: 'error', duration: 3000 });

        setIsLoading(false);

        return;

      }



      if (!formData.names.trim()) {

        showToast({ message: 'Staff name is required', type: 'error', duration: 3000 });

        setIsLoading(false);

        return;

      }



      const selectedSpecialties = Array.isArray(formData.category_specialty)

        ? formData.category_specialty

        : [];



      if (selectedSpecialties.length === 0) {

        showToast({ message: 'Please select at least one specialty', type: 'error', duration: 3000 });

        setIsLoading(false);

        return;

      }



      const response = await fetch('/api/staffs/update', {

        method: 'PUT',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          id: staff.id,

          names: formData.names,

          category_specialty: selectedSpecialties.join(', '),

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

      showToast({
        message: err.message || 'An error occurred while updating staff',
        type: 'error',
        duration: 3000,
      });

    } finally {

      setIsLoading(false);

    }

  };



  if (!isOpen) return null;



  const selectedSpecialties = Array.isArray(formData.category_specialty)

    ? formData.category_specialty

    : [];

  const legacyCategories = selectedSpecialties.filter(

    (specialty) => !categories.includes(specialty)

  );

  const displayCategories = [...categories, ...legacyCategories];



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

            Edit Staff Member

          </h2>

          <button

            type="button"
            onClick={handleExitAttempt}
            disabled={isLoading}

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

                  displayCategories.map((category) => {

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

              onClick={handleExitAttempt}

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

    </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        zIndex={3000}
        title="Leave without saving?"
        message="Are you sure you want to exit? Any unsaved changes will be lost."
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


