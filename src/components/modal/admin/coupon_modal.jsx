import { useState, useEffect } from "react";

// Reusable small ID generator (no external deps)
const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;

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

const loadCoupons = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveCoupons = (list) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
};

export const CouponModal = ({ isOpen, onClose, services = [] }) => {
  const emptyForm = {
    id: null,
    code: '',
    type: 'discount',
    valueType: 'percentage',
    value: '',
    description: '',
    applicableServices: [],
    startDate: '',
    endDate: '',
    maxUses: '',
    active: true,
    deleted: false,
    usesCount: 0,
    createdAt: null
  };

  const [form, setForm] = useState(JSON.parse(JSON.stringify(emptyForm)));
  const [initialForm, setInitialForm] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [view, setView] = useState('form'); // 'form' or 'list'
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setCoupons(loadCoupons());
  }, []);

  useEffect(() => {
    if (isOpen) {
      const newForm = JSON.parse(JSON.stringify(emptyForm));
      newForm.code = genCode();
      setForm(newForm);
      setInitialForm(JSON.parse(JSON.stringify(newForm)));
      setView('form');
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
    const exists = coupons.find(c => c.code?.toLowerCase() === form.code?.toLowerCase() && c.id !== form.id && !c.deleted);
    if (exists) err.code = 'Code already exists';
    if (form.type !== 'free' && (form.value === '' || isNaN(Number(form.value)))) err.value = 'Value is required';
    if (!form.startDate) err.startDate = 'Start date is required';
    if (!form.endDate) err.endDate = 'End date is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const persist = (next) => { setCoupons(next); saveCoupons(next); };

  const handleSave = () => {
    if (!validate()) return;
    const now = new Date().toISOString();
    const isNew = !form.id;
    
    if (form.id) {
      const updated = coupons.map(c => c.id === form.id ? { ...c, ...form } : c);
      persist(updated);
    } else {
      const newCoupon = { ...form, id: genId(), createdAt: now, usesCount: 0, deleted: false };
      persist([newCoupon, ...coupons]);
    }
    
    setToast({ message: isNew ? 'Coupon created successfully!' : 'Coupon updated successfully!', type: 'success' });
    const newForm = JSON.parse(JSON.stringify(emptyForm));
    newForm.code = genCode();
    setForm(newForm);
    setInitialForm(JSON.parse(JSON.stringify(newForm)));
    setErrors({});
  };

  const handleEdit = (coupon) => {
    setForm({ ...coupon });
    setInitialForm({ ...coupon });
    setView('form');
    setErrors({});
  };

  const requestDelete = (id) => { setPendingDeleteId(id); setShowConfirm(true); };

  const confirmDelete = () => {
    const updated = coupons.map(c => c.id === pendingDeleteId ? { ...c, deleted: true } : c);
    persist(updated);
    setToast({ message: 'Coupon deleted successfully!', type: 'success' });
    setShowConfirm(false);
    setPendingDeleteId(null);
  };

  const restore = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, deleted: false } : c);
    persist(updated);
    setToast({ message: 'Coupon restored successfully!', type: 'success' });
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
        title={pendingDeleteId ? "Delete Coupon" : "Close Modal?"}
        message={pendingDeleteId ? "This will soft-delete the coupon (kept for reporting). Continue?" : "Are you sure you want to close this modal?"}
        onConfirm={pendingDeleteId ? confirmDelete : confirmClose}
        onCancel={() => { setShowConfirm(false); setPendingDeleteId(null); }}
        confirmText={pendingDeleteId ? "Delete" : "Close"}
      />

      <div style={{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,fontFamily:'Inter, sans-serif'}} onClick={handleClose}>
        <div style={{backgroundColor:'#1a1a1a',borderRadius:12,width:'92%',height:'74vh',maxWidth:820,boxShadow:'0 20px 60px rgba(0,0,0,0.8)',border:'1px solid rgba(221,144,29,0.15)',display:'flex',flexDirection:'column'}} onClick={(e)=>e.stopPropagation()}>
          
          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:24,borderBottom:'1px solid rgba(255,255,255,0.04)',flexShrink:0}}>
            <h2 style={{color:'#f5f5f5',margin:0}}>{view === 'form' ? 'Create/Edit Coupon' : 'Manage Coupons'}</h2>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              {view === 'form' && (
                <button onClick={() => setView('list')} style={{padding:'8px 16px',background:'rgba(221,144,29,0.1)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#dd901d',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                  View List
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
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Type</label>
                    <select value={form.type} onChange={(e)=>setForm(prev=>({...prev,type:e.target.value}))} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'Inter,sans-serif',cursor:'pointer',appearance:'none',paddingRight:28,backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dd901d' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 8px center',backgroundSize:'20px'}}>
                      <option value="discount">Discount</option>
                      <option value="promo">Promo</option>
                    </select>
                  </div>
                  <div style={{width:160}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Value Type</label>
                    <select value={form.valueType} onChange={(e)=>setForm(prev=>({...prev,valueType:e.target.value}))} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'Inter,sans-serif',cursor:'pointer',appearance:'none',paddingRight:28,backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dd901d' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 8px center',backgroundSize:'20px'}}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₱)</option>
                    </select>
                  </div>
                  <div style={{width:140}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Value</label>
                    <input value={form.value} onChange={(e)=>{ setForm(prev=>({...prev,value:e.target.value})); if (errors.value) setErrors(prev=>({...prev,value:undefined})); }} placeholder={form.valueType==='percentage' ? 'e.g., 20' : 'e.g., 500'} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.value? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}} />
                    {errors.value && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.value}</p>}
                  </div>
                </div>

                <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:12}}>
                  <div style={{flex:1}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Description</label>
                    <textarea value={form.description} onChange={(e)=>setForm(prev=>({...prev,description:e.target.value}))} placeholder="Optional details" style={{width:'100%',minHeight:140,padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'Inter,sans-serif'}} />
                  </div>
                  <div style={{width:220}}>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13,display:'block',marginBottom:8}}>Applicable Services</label>
                    <div style={{maxHeight:140,overflow:'auto',padding:8,background:'rgba(0,0,0,0.15)',borderRadius:8}}>
                      {services.length === 0 && <p style={{color:'#9a9a9a',fontSize:13,margin:0}}>No services available</p>}
                      {services && services.length > 0 && services.map((s, idx) => {
                        const serviceId = String(s.id);
                        const isSelected = form.applicableServices && form.applicableServices.map(String).includes(serviceId);
                        return (
                          <label key={idx} style={{display:'flex',alignItems:'center',marginBottom:10,gap:10,padding:'6px 0',cursor:'pointer'}}>
                            <input 
                              type="checkbox" 
                              id={`service-${s.id}`}
                              checked={isSelected || false} 
                              onChange={(e)=>{
                                const selectedServices = form.applicableServices.map(String);
                                const next = e.target.checked 
                                  ? [...selectedServices, serviceId]
                                  : selectedServices.filter(id => id !== serviceId);
                                setForm(prev=>({...prev,applicableServices:next}));
                              }} 
                              style={{width:18,height:18,margin:'0 4px 0 0',cursor:'pointer',accentColor:'#dd901d',flexShrink:0,borderRadius:3,border:'2px solid rgba(221,144,29,0.5)',backgroundColor:'rgba(0,0,0,0.3)',appearance:'auto'}} 
                            />
                            <span style={{fontSize:13,color:'#f5f5f5',userSelect:'none',flex:1}}>
                              {s.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 160px 140px',gap:12,marginBottom:18}}>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Start Date</label>
                    <input type="date" value={form.startDate} onChange={(e)=>{ setForm(prev=>({...prev,startDate:e.target.value})); if (errors.startDate) setErrors(prev=>({...prev,startDate:undefined})); }} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.startDate? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}} />
                    {errors.startDate && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.startDate}</p>}
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>End Date</label>
                    <input type="date" value={form.endDate} onChange={(e)=>{ setForm(prev=>({...prev,endDate:e.target.value})); if (errors.endDate) setErrors(prev=>({...prev,endDate:undefined})); }} style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.endDate? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}} />
                    {errors.endDate && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.endDate}</p>}
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Max Uses</label>
                    <input value={form.maxUses} onChange={(e)=>setForm(prev=>({...prev,maxUses:e.target.value}))} placeholder="optional" style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5'}} />
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Status</label>
                    <label style={{display:'flex',alignItems:'center',height:44,padding:'0 8px',background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,cursor:'pointer'}}>
                      <input type="checkbox" checked={form.active} onChange={(e)=>setForm(prev=>({...prev,active:e.target.checked}))} style={{marginRight:8,cursor:'pointer',width:16,height:16,accentColor:'#dd901d'}} />
                      <span style={{color:'#f5f5f5',fontSize:13}}>{form.active ? 'Active' : 'Inactive'}</span>
                    </label>
                  </div>
                </div>

                <div style={{display:'flex',gap:12,justifyContent:'flex-end',marginTop:24}}>
                  <button onClick={() => { const newForm = JSON.parse(JSON.stringify(emptyForm)); newForm.code = genCode(); setForm(newForm); setInitialForm(JSON.parse(JSON.stringify(newForm))); setErrors({}); }} style={{padding:'10px 18px',background:'transparent',border:'1px solid rgba(221,144,29,0.4)',color:'#dd901d',borderRadius:8,cursor:'pointer',fontWeight:600}}>Reset</button>
                  <button onClick={handleSave} style={{padding:'10px 18px',background:'#dd901d',border:'none',borderRadius:8,color:'#1a1a1a',fontWeight:600,cursor:'pointer'}}>Save Coupon</button>
                </div>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column'}}>
                {/* List View */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                  <h3 style={{color:'#f5f5f5',margin:0}}>Existing Coupons</h3>
                  <button onClick={() => setView('form')} style={{padding:'8px 16px',background:'rgba(221,144,29,0.1)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#dd901d',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                    ← Back
                  </button>
                </div>
                {coupons.length === 0 && <p style={{color:'#9a9a9a'}}>No coupons yet.</p>}
                <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
                  {coupons.map(c => (
                    <div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:12,background:'rgba(26,15,0,0.3)',borderRadius:8,border:'1px solid rgba(221,144,29,0.15)'}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:10,alignItems:'baseline',marginBottom:6}}>
                          <strong style={{color:'#f5f5f5',fontSize:14}}>{c.code}</strong>
                          <span style={{color:'#9a9a9a',fontSize:12}}>{c.type} • {c.valueType === 'percentage' ? `${c.value}%` : `₱${c.value}`}</span>
                          {c.deleted && <span style={{color:'#ef4444',fontSize:11,fontWeight:600,marginLeft:8}}>DELETED</span>}
                          {!c.deleted && !c.active && <span style={{color:'#f59e0b',fontSize:11,fontWeight:600,marginLeft:8}}>INACTIVE</span>}
                        </div>
                        <div style={{color:'#9a9a9a',fontSize:13}}>{c.description || '—'}</div>
                        <div style={{color:'#6b7280',fontSize:12,marginTop:6}}>Services: {c.applicableServices?.length > 0 ? `${c.applicableServices.length} selected` : 'All'}</div>
                      </div>
                      <div style={{display:'flex',gap:8,alignItems:'center'}}>
                        {c.deleted ? (
                          <button onClick={()=>restore(c.id)} style={{padding:'6px 12px',borderRadius:6,background:'rgba(16,185,129,0.2)',border:'1px solid rgba(16,185,129,0.4)',color:'#10b981',cursor:'pointer',fontSize:12,fontWeight:600}}>Restore</button>
                        ) : (
                          <>
                            <button onClick={()=>handleEdit(c)} style={{padding:'6px 12px',borderRadius:6,background:'rgba(221,144,29,0.2)',border:'1px solid rgba(221,144,29,0.4)',color:'#dd901d',cursor:'pointer',fontSize:12,fontWeight:600}}>Edit</button>
                            <button onClick={()=>requestDelete(c.id)} style={{padding:'6px 12px',borderRadius:6,color:'#fff',background:'#ef4444',border:'none',cursor:'pointer',fontSize:12,fontWeight:600}}>Delete</button>
                          </>
                        )}
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
