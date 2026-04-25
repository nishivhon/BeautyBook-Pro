import React, { useState } from "react";

// Format cell value for display
const formatCellValue = (cellValue, colName) => {
  if (typeof cellValue === 'boolean') {
    return String(cellValue);
  }
  
  // Parse JSON services if it's the services column
  if (colName === 'services' && cellValue && typeof cellValue === 'string') {
    try {
      const services = JSON.parse(cellValue);
      if (Array.isArray(services)) {
        return services.map(s => s.name || s).join(', ');
      }
    } catch (e) {
      // If not valid JSON, return as is
    }
  }
  
  return cellValue || '';
};

// Format column names for display
const formatColumnName = (colName) => {
  const columnMap = {
    'service_name': 'service name',
    'est_time': 'est. time',
    'time_slot': 'time slot',
    'customer_name': 'customer name',
    'customer_contact': 'customer contact',
    'assigned_staff': 'assigned staff'
  };
  return columnMap[colName] || colName;
};

export default function DatabaseTableModal({
  showModal,
  modalTable,
  modalMode,
  setShowModal,
  handleSaveChanges,
}) {
  const [editingCell, setEditingCell] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showModal || !modalTable) return null;

  const handleClose = () => {
    if (modalMode === 'edit') {
      setShowConfirm(true);
    } else {
      setShowModal(false);
      setHasChanges(false);
    }
  };

  const confirmClose = () => {
    setShowModal(false);
    setHasChanges(false);
    setShowConfirm(false);
  };

  const handleSaveWithReset = () => {
    setHasChanges(false);
    handleSaveChanges();
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1000 }} onClick={(e) => {if(e.target === e.currentTarget) handleClose()}}>
      <div className="modal" style={{ maxWidth: '70vw', maxHeight: '85vh', width: '70vw', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{modalTable.name} - {modalMode === 'view' ? 'View' : 'Edit'}</span>
          <button 
            onClick={handleClose} 
            onMouseEnter={(e) => e.currentTarget.style.color = '#DD901D'} 
            onMouseLeave={(e) => e.currentTarget.style.color = '#998F81'}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#998F81', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}
          >
            x
          </button>
        </div>
        <div className="modal-sub">
          {modalMode === 'view' 
            ? `${modalTable.meta} · Last updated: ${modalTable.lastUpdated}`
            : 'Click any cell to edit. Changes are saved on confirmation.'
          }
        </div>

        {/* Table */}
        <div style={{flex: 1, marginTop:'16px', overflow: 'auto'}}>
          <table className="data-table">
            <thead>
              <tr>
                {modalTable.cols.map((col) => (
                  <th key={col}>{formatColumnName(col)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modalTable.rows.map((row, idx) => {
                return (
                  <tr key={idx} style={{ cursor: 'pointer', transition: 'background-color 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(221, 144, 29, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {modalTable.cols.map((col) => {
                      const cellId = `${idx}-${col}`;
                      const isEditing = editingCell === cellId;
                      const cellValue = row[col];
                      // Convert boolean to string for display and format special columns
                      const displayValue = formatCellValue(cellValue, col);
                      return (
                        <td key={col} style={{ padding: 0, position: 'relative' }}>
                          {modalMode === 'edit' && !col.startsWith('id') 
                            ? <input 
                                defaultValue={displayValue} 
                                onChange={() => setHasChanges(true)}
                                style={{
                                  background: isEditing ? 'rgba(221, 144, 29, 0.2)' : 'transparent',
                                  border: isEditing ? '2px solid #DD901D' : '1px solid transparent',
                                  outline: 'none',
                                  color:'white', 
                                  fontSize:'13px', 
                                  width:'100%',
                                  padding: isEditing ? '10px 11px' : '12px',
                                  cursor: 'text',
                                  transition: 'all 0.1s'
                                }}
                                onFocus={() => setEditingCell(cellId)}
                                onBlur={() => setEditingCell(null)}
                              />
                            : <span style={{ display: 'block', padding: '12px' }}>{displayValue}</span>
                          }
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="modal-actions">
          <button className="btn-gold" onClick={handleSaveWithReset}>
            {modalMode === 'view' ? 'Close' : 'Save Changes'}
          </button>
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ background: 'var(--bg-darker)', border: '1px solid rgba(221, 144, 29, 0.2)', borderRadius: '12px', padding: '24px', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
              <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 700, fontSize: '18px', color: '#ffffff', marginBottom: '12px' }}>Unsaved Changes</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '13px', color: '#D4C5B9', marginBottom: '24px' }}>You have unsaved changes. Are you sure you want to close without saving?</div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowConfirm(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(152, 143, 129, 0.3)', background: 'transparent', color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(152, 143, 129, 0.1)'; e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(152, 143, 129, 0.3)'; }}>Keep Editing</button>
                <button onClick={confirmClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #DD901D', background: 'rgba(221, 144, 29, 0.15)', color: '#DD901D', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(221, 144, 29, 0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(221, 144, 29, 0.15)'; }}>Discard Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
