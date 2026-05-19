import { useState, useEffect } from "react";
import { couponService } from "../../../services/couponService";

// Generate random coupon code
const genCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Toast Component
const Toast = ({ message, type = 'success' }) => (
  <div style={{
    position: 'fixed',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 20px',
    backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
    color: '#fff',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    zIndex: 2000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    animation: 'slideIn 0.3s ease-out'
  }}>
    <style>{`@keyframes slideIn { from { transform: translateX(-50%) translateY(-20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }`}</style>
    {message}
  </div>
);

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;
  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display:'flex',alignItems:'center',justifyContent:'center',zIndex:1001}}>
      <div style={{backgroundColor:'#1a1a1a',padding:24,borderRadius:12,width:'90%',maxWidth:420,border:'1px solid rgba(221,144,29,0.15)'}}>
        <h3 style={{margin:0,color:'#f5f5f5'}}> {title} </h3>
        <p style={{color:'#b0ada5'}}>{message}</p>
        <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
          <button onClick={onCancel} style={{padding:'8px 14px',background:'transparent',border:'1px solid rgba(221,144,29,0.4)',color:'#dd901d',borderRadius:6}}> {cancelText} </button>
          <button onClick={onConfirm} style={{padding:'8px 14px',background:'#ef4444',color:'#fff',border:'none',borderRadius:6}}> {confirmText} </button>
        </div>
      </div>
    </div>
  );
};

// Local storage key for quick persistence (front-end only)
const STORAGE_KEY = 'bbp_coupons_v1';

export const CouponModal = ({ isOpen, onClose, services = [] }) => {
  const emptyForm = {
    id: null,
    code: '',
    value_type: 'percentage',
    value: '',
    description: '',
    start_date: '',
    end_date: '',
    number_of_uses: 0,
    max_uses: '',
    status: 'active',
    is_deleted: false,
  };

  const [form, setForm] = useState(JSON.parse(JSON.stringify(emptyForm)));
  const [initialForm, setInitialForm] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [view, setView] = useState('list'); // 'form' or 'list'
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load coupons from API on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const data = await couponService.getCoupons();
        setCoupons(data);
      } catch (err) {
        console.error('Error loading coupons:', err);
        setToast({ message: 'Failed to load coupons', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (isOpen) {
      const newForm = JSON.parse(JSON.stringify(emptyForm));
      newForm.code = genCode();
      setForm(newForm);
      setInitialForm(JSON.parse(JSON.stringify(newForm)));
      setView('list');
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const hasUnsaved = () => {
    if (!initialForm) return false;
    return Object.keys(form).some(k => JSON.stringify(form[k]) !== JSON.stringify(initialForm[k]));
  };

  const validate = () => {
    const err = {};
    if (!form.code?.trim()) err.code = 'Code is required';
    const exists = coupons.find(c => c.code?.toLowerCase() === form.code?.toLowerCase() && c.id !== form.id && !c.is_deleted);
    if (exists) err.code = 'Code already exists';
    if (form.value === '' || isNaN(Number(form.value))) err.value = 'Value is required';
    if (!form.start_date) err.start_date = 'Start date is required';
    if (!form.end_date) err.end_date = 'End date is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    
    try {
      const payload = {
        code: form.code,
        value_type: form.value_type,
        value: Number(form.value),
        description: form.description,
        start_date: form.start_date,
        end_date: form.end_date,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        status: form.status,
      };

      console.log('[CouponModal] Sending payload:', payload);

      if (form.id) {
        // Update existing coupon
        await couponService.updateCoupon(form.id, payload);
      } else {
        // Create new coupon
        await couponService.createCoupon(payload);
      }

      // Refresh coupons list
      const updatedCoupons = await couponService.getCoupons();
      setCoupons(updatedCoupons);

      const isNew = !form.id;
      setToast({ message: isNew ? 'Coupon created successfully!' : 'Coupon updated successfully!', type: 'success' });
      
      const newForm = JSON.parse(JSON.stringify(emptyForm));
      newForm.code = genCode();
      setForm(newForm);
      setInitialForm(JSON.parse(JSON.stringify(newForm)));
      setErrors({});
    } catch (err) {
      console.error('Error saving coupon:', err);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setForm({ ...coupon });
    setInitialForm({ ...coupon });
    setView('form');
    setErrors({});
  };

  const handleStatusChange = async (couponId, newStatus) => {
    setLoading(true);
    try {
      await couponService.updateCoupon(couponId, { status: newStatus });
      
      // Refresh coupons list
      const updatedCoupons = await couponService.getCoupons();
      setCoupons(updatedCoupons);
      
      setToast({ message: 'Coupon status updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Error updating coupon status:', err);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const requestDelete = (id) => { setPendingDeleteId(id); setShowConfirm(true); };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await couponService.deleteCoupon(pendingDeleteId);

      // Refresh coupons list
      const updatedCoupons = await couponService.getCoupons();
      setCoupons(updatedCoupons);

      setToast({ message: 'Coupon deleted successfully!', type: 'success' });
      setShowConfirm(false);
      setPendingDeleteId(null);
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirm(true);
    setPendingDeleteId(null);
  };

  const confirmClose = () => {
    setShowConfirm(false);
    setPendingDeleteId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <ConfirmationDialog
        isOpen={showConfirm}
        title={pendingDeleteId ? "Delete Coupon" : "Exit Modal?"}
        message={pendingDeleteId ? "This will soft-delete the coupon (kept for reporting). Continue?" : "Are you sure you want to exit? Any unsaved information will be lost."}
        onConfirm={pendingDeleteId ? confirmDelete : confirmClose}
        onCancel={() => { setShowConfirm(false); setPendingDeleteId(null); }}
        confirmText={pendingDeleteId ? "Delete" : "Leave"}
        cancelText={pendingDeleteId ? "Cancel" : "Stay"}
      />

      <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,fontFamily:'Inter, sans-serif'}} onClick={handleClose}>
        <div style={{backgroundColor:'#1a1a1a',borderRadius:12,width:'92%',height:'74vh',maxWidth:820,boxShadow:'0 20px 60px rgba(0,0,0,0.8)',border:'1px solid rgba(221,144,29,0.15)',display:'flex',flexDirection:'column'}} onClick={(e)=>e.stopPropagation()}>
          
          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:24,borderBottom:'1px solid rgba(255,255,255,0.04)',flexShrink:0}}>
            <h2 style={{color:'#f5f5f5',margin:0}}>{view === 'form' ? 'Create/Edit Coupon' : 'Manage Coupons'}</h2>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              {view === 'form' && (
                <button onClick={() => setView('list')} style={{padding:'8px 16px',background:'rgba(221,144,29,0.1)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#dd901d',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                  ← Back
                </button>
              )}
              {view === 'list' && (
                <button onClick={() => { const newForm = JSON.parse(JSON.stringify(emptyForm)); newForm.code = genCode(); setForm(newForm); setInitialForm(JSON.parse(JSON.stringify(newForm))); setErrors({}); setView('form'); }} style={{padding:'8px 16px',background:'rgba(221,144,29,0.1)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#dd901d',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                  Create New Coupon
                </button>
              )}
              <button onClick={handleClose} style={{background:'none',border:'none',cursor:'pointer',color:'#988f81'}}>
                <CloseIcon/>
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div style={{flex:1,overflow:'auto',padding:24,display:'flex',flexDirection:'column'}}>
            <style>{`
              ::-webkit-scrollbar { width: 6px; }
              ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
              ::-webkit-scrollbar-thumb { background: rgba(221,144,29,0.4); border-radius: 3px; }
              ::-webkit-scrollbar-thumb:hover { background: rgba(221,144,29,0.6); }
            `}</style>

            {view === 'form' ? (
              <div style={{display:'flex',flexDirection:'column'}}>
                {/* Form View */}
                <div style={{display:'flex',gap:20,marginBottom:18,paddingTop:0}}>
                  <div style={{flex:1}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Code</label>
                    <div style={{display:'flex',gap:8}}>
                      <input value={form.code} readOnly style={{flex:1,padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'monospace'}} />
                      <button onClick={() => { const newCode = genCode(); setForm(prev=>({...prev,code:newCode})); }} style={{padding:'12px 14px',background:'rgba(221,144,29,0.2)',border:'1px solid rgba(221,144,29,0.4)',borderRadius:8,color:'#dd901d',cursor:'pointer',fontWeight:600,fontSize:13}}>Generate</button>
                    </div>
                  </div>
                  <div style={{width:160}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Value Type</label>
                    <select value={form.value_type} onChange={(e)=>setForm(prev=>({...prev,value_type:e.target.value}))} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'Inter,sans-serif',cursor:'pointer',appearance:'none',paddingRight:28,backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dd901d' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 8px center',backgroundSize:'20px'}}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₱)</option>
                    </select>
                  </div>
                  <div style={{width:140}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Value</label>
                    <input value={form.value} onChange={(e)=>{ setForm(prev=>({...prev,value:e.target.value})); if (errors.value) setErrors(prev=>({...prev,value:undefined})); }} placeholder={form.value_type==='percentage' ? 'e.g., 20' : 'e.g., 500'} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.value? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}} />
                    {errors.value && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.value}</p>}
                  </div>
                </div>

                <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:12}}>
                  <div style={{flex:1}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Description</label>
                    <textarea value={form.description} onChange={(e)=>setForm(prev=>({...prev,description:e.target.value}))} placeholder="Optional details" style={{width:'100%',minHeight:140,padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'Inter,sans-serif'}} />
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 160px 140px',gap:12,marginBottom:18}}>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Start Date</label>
                    <input type="date" value={form.start_date} onChange={(e)=>{ setForm(prev=>({...prev,start_date:e.target.value})); if (errors.start_date) setErrors(prev=>({...prev,start_date:undefined})); }} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.start_date? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}} />
                    {errors.start_date && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.start_date}</p>}
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>End Date</label>
                    <input type="date" value={form.end_date} onChange={(e)=>{ setForm(prev=>({...prev,end_date:e.target.value})); if (errors.end_date) setErrors(prev=>({...prev,end_date:undefined})); }} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.end_date? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}} />
                    {errors.end_date && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.end_date}</p>}
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Max Uses</label>
                    <input value={form.max_uses} onChange={(e)=>setForm(prev=>({...prev,max_uses:e.target.value}))} placeholder="optional" style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5'}} />
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Status</label>
                    <label style={{display:'flex',alignItems:'center',height:44,padding:'0 8px',background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,cursor:'pointer'}}>
                      <input type="checkbox" checked={form.status === 'active'} onChange={(e)=>setForm(prev=>({...prev,status:e.target.checked ? 'active' : 'inactive'}))} style={{marginRight:8,cursor:'pointer',width:16,height:16,accentColor:'#dd901d'}} />
                      <span style={{color:'#f5f5f5',fontSize:13}}>{form.status === 'active' ? 'Active' : 'Inactive'}</span>
                    </label>
                  </div>
                </div>

                <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:24}}>
                  <button onClick={() => { const newForm = JSON.parse(JSON.stringify(emptyForm)); newForm.code = genCode(); setForm(newForm); setInitialForm(JSON.parse(JSON.stringify(newForm))); setErrors({}); }} disabled={loading} style={{padding:'10px 18px',background:'transparent',border:'1px solid rgba(221,144,29,0.4)',color:'#dd901d',borderRadius:8,cursor:'pointer',fontWeight:600,opacity:loading ? 0.5 : 1}}>Reset</button>
                  <button onClick={handleSave} disabled={loading} style={{padding:'10px 18px',background:'#dd901d',border:'none',borderRadius:8,color:'#1a1a1a',fontWeight:600,cursor:'pointer',opacity:loading ? 0.7 : 1}}>{loading ? 'Saving...' : 'Save Coupon'}</button>
                </div>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column'}}>
                {/* List View */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                  <h3 style={{color:'#f5f5f5',margin:0}}>Existing Coupons</h3>
                </div>
                {coupons.length === 0 && <p style={{color:'#9a9a9a'}}>No coupons yet.</p>}
                <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
                  {coupons.map(c => (
                    <div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:12,background:'rgba(26,15,0,0.3)',borderRadius:8,border:'1px solid rgba(221,144,29,0.15)'}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:10,alignItems:'baseline',marginBottom:6}}>
                          <strong style={{color:'#f5f5f5',fontSize:14}}>{c.code}</strong>
                          <span style={{color:'#9a9a9a',fontSize:12}}>{c.value_type === 'percentage' ? `${c.value}%` : `₱${c.value}`}</span>
                          {c.is_deleted && <span style={{color:'#ef4444',fontSize:11,fontWeight:600,marginLeft:8}}>DELETED</span>}
                          {!c.is_deleted && c.status === 'inactive' && <span style={{color:'#f59e0b',fontSize:11,fontWeight:600,marginLeft:8}}>INACTIVE</span>}
                        </div>
                        <div style={{color:'#9a9a9a',fontSize:13}}>{c.description || '—'}</div>
                        <div style={{color:'#6b7280',fontSize:12,marginTop:6}}>Uses: {c.number_of_uses}/{c.max_uses ? c.max_uses : '∞'}</div>
                      </div>
                      <div style={{display:'flex',gap:8,alignItems:'center'}}>
                        {!c.is_deleted ? (
                          <>
                            <button onClick={()=>handleEdit(c)} disabled={loading} style={{padding:'6px 12px',borderRadius:6,background:'rgba(221,144,29,0.2)',border:'1px solid rgba(221,144,29,0.4)',color:'#dd901d',cursor:'pointer',fontSize:12,fontWeight:600,opacity:loading ? 0.5 : 1}}>Edit</button>
                            <select value={c.status} onChange={(e)=>handleStatusChange(c.id, e.target.value)} disabled={loading} style={{padding:'6px 8px',borderRadius:6,background:'rgba(221,144,29,0.2)',border:'1px solid rgba(221,144,29,0.4)',color:'#dd901d',cursor:'pointer',fontSize:12,fontWeight:600,opacity:loading ? 0.5 : 1,appearance:'none',paddingRight:20,backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dd901d' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 4px center',backgroundSize:'14px'}}>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponModal;
