import { useState, useEffect, useMemo } from "react";
import { couponService } from "../../../services/couponService";
import { ConfirmationDialog } from "../shared/confirmation_dialog";
import Toast from "../../toast";

// Generate random coupon code
const genCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const CloseIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Local storage key for quick persistence (front-end only)
const STORAGE_KEY = 'bbp_coupons_v1';

export const CouponModal = ({ isOpen, onClose, services = [] }) => {
  const todayISO = new Date().toISOString().split('T')[0];
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
  const [couponSearch, setCouponSearch] = useState('');
  const [couponFilter, setCouponFilter] = useState('active');

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

  const getCouponDisplayStatus = (coupon) => {
    // Filtering requested: use coupons.status directly (exact strings after normalization).
    // Deleted filter requested: use coupons.is_deleted (or status==='deleted' if that is how API marks it).

    const rawStatus = String(coupon?.status || '').trim().toLowerCase();
    const isDeleted = coupon?.is_deleted === true || rawStatus === 'deleted';
    if (isDeleted) return 'deleted';

    // Filtering requested: inactive/active/expired must come ONLY from coupons.status.
    // If is_deleted is false, an 'inactive' status must show in the Inactive filter.
    if (rawStatus === 'active') return 'active';
    if (rawStatus === 'inactive') return 'inactive';
    if (rawStatus === 'expired') return 'expired';

    // Unknown status: keep it out of active/inactive/expired.
    return 'unknown';
  };



  const filteredCoupons = useMemo(() => {
    const normalizedQuery = couponSearch.trim().toLowerCase();

    return coupons
      .map((coupon) => ({ ...coupon, _displayStatus: getCouponDisplayStatus(coupon) }))
      .filter((coupon) => {
        // Deleted must never appear when filtering for active/inactive/expired.
        if (couponFilter && couponFilter !== 'deleted' && coupon._displayStatus === 'deleted') return false;
        if (couponFilter && coupon._displayStatus !== couponFilter) return false;

        // Requested: filtering for active/inactive/expired must match coupon.status only.
        // (No end_date/date-based inference in this modal.)

        if (!normalizedQuery) return true;


        const searchableText = [
          coupon.code,
          coupon.description,
          coupon.value_type,
          coupon.value,
          coupon.start_date,
          coupon.end_date,
          coupon.status,
          coupon._displayStatus,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .sort((a, b) => {
        const order = { active: 1, inactive: 2, expired: 3, deleted: 4 };
        return (order[a._displayStatus] ?? 99) - (order[b._displayStatus] ?? 99);

      });
  }, [coupons, couponFilter, couponSearch, todayISO]);

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
    if (form.max_uses === '' || isNaN(Number(form.max_uses)) || Number(form.max_uses) <= 0) err.max_uses = 'Max uses is required';
    if (form.start_date && form.start_date < todayISO) err.start_date = 'Start date cannot be in the past';
    if (form.start_date && form.end_date && form.end_date < form.start_date) err.end_date = 'End date must be on or after the start date';
    if (form.start_date && form.start_date !== todayISO && form.status === 'active') {
      err.status = 'Future-dated coupons must stay inactive until their start date';
    }
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
        max_uses: Number(form.max_uses),
        status: form.start_date && form.start_date !== todayISO ? 'inactive' : form.status,
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
      setView('list');
      
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
      {toast && <Toast message={toast.message} type={toast.type} isVisible={Boolean(toast)} />}
      
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
                    <input
                      type="date"
                      value={form.start_date}
                      min={todayISO}
                      onChange={(e)=>{
                        const nextStartDate = e.target.value;
                        setForm(prev=>({
                          ...prev,
                          start_date: nextStartDate,
                          status: nextStartDate && nextStartDate !== todayISO ? 'inactive' : prev.status,
                          end_date: prev.end_date && nextStartDate && prev.end_date < nextStartDate ? '' : prev.end_date,
                        }));
                        if (errors.start_date) setErrors(prev=>({...prev,start_date:undefined}));
                        if (errors.end_date) setErrors(prev=>({...prev,end_date:undefined}));
                        if (errors.status) setErrors(prev=>({...prev,status:undefined}));
                      }}
                      style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.start_date? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}}
                    />
                    {errors.start_date && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.start_date}</p>}
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>End Date</label>
                    <input
                      type="date"
                      value={form.end_date}
                      min={form.start_date || todayISO}
                      disabled={!form.start_date}
                      onChange={(e)=>{ setForm(prev=>({...prev,end_date:e.target.value})); if (errors.end_date) setErrors(prev=>({...prev,end_date:undefined})); }}
                      style={{width:'100%',padding:12,background:!form.start_date ? 'rgba(26,15,0,0.35)' : 'rgba(26,15,0,0.5)',border:`1px solid ${errors.end_date? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5',cursor: !form.start_date ? 'not-allowed' : 'text'}}
                    />
                    {errors.end_date && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.end_date}</p>}
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Max Uses</label>
                    <input value={form.max_uses} onChange={(e)=>{ setForm(prev=>({...prev,max_uses:e.target.value})); if (errors.max_uses) setErrors(prev=>({...prev,max_uses:undefined})); }} type="number" min="1" step="1" placeholder="Enter max uses" style={{width:'100%',padding:12,background:'rgba(26,15,0,0.5)',border:`1px solid ${errors.max_uses? '#ef4444':'rgba(221,144,29,0.3)'}`,borderRadius:8,color:'#f5f5f5'}} />
                    {errors.max_uses && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.max_uses}</p>}
                  </div>
                  <div>
                    <label style={{color:'#dd901d',fontWeight:600,fontSize:13}}>Status</label>
                    <label style={{display:'flex',alignItems:'center',height:44,padding:'0 8px',background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,cursor:form.start_date && form.start_date !== todayISO ? 'not-allowed' : 'pointer', opacity: form.start_date && form.start_date !== todayISO ? 0.75 : 1}}>
                      <input
                        type="checkbox"
                        checked={form.status === 'active'}
                        disabled={!!form.start_date && form.start_date !== todayISO}
                        onChange={(e)=>setForm(prev=>({...prev,status:(prev.start_date && prev.start_date !== todayISO) ? 'inactive' : (e.target.checked ? 'active' : 'inactive')}))}
                        style={{marginRight:8,cursor:form.start_date && form.start_date !== todayISO ? 'not-allowed' : 'pointer',width:16,height:16,accentColor:'#dd901d'}}
                      />
                      <span style={{color:'#f5f5f5',fontSize:13}}>
                        {form.start_date && form.start_date !== todayISO ? 'Inactive (scheduled)' : form.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                    {errors.status && <p style={{color:'#ef4444',margin:'6px 0 0',fontSize:12}}>{errors.status}</p>}
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
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:20}}>
                  <h3 style={{color:'#f5f5f5',margin:0}}>Existing Coupons</h3>
                  <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                    <input
                      type="search"
                      value={couponSearch}
                      onChange={(e) => setCouponSearch(e.target.value)}
                      placeholder="Search coupons"
                      style={{width:220,padding:'10px 12px',background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'Inter,sans-serif'}}
                    />
                    <select
                      value={couponFilter}
                      onChange={(e) => setCouponFilter(e.target.value)}
                      style={{padding:'10px 12px',background:'rgba(26,15,0,0.5)',border:'1px solid rgba(221,144,29,0.3)',borderRadius:8,color:'#f5f5f5',fontFamily:'Inter,sans-serif',cursor:'pointer'}}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expired">Expired</option>
                      <option value="deleted">Deleted</option>

                    </select>
                  </div>
                </div>
                {filteredCoupons.length === 0 && <p style={{color:'#9a9a9a'}}>No coupons found.</p>}
                <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
                  {filteredCoupons.map(c => (
                    <div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:12,background:'rgba(26,15,0,0.3)',borderRadius:8,border:'1px solid rgba(221,144,29,0.15)'}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',gap:10,alignItems:'baseline',marginBottom:6}}>
                          <strong style={{color:'#f5f5f5',fontSize:14}}>{c.code}</strong>
                          <span style={{color:'#9a9a9a',fontSize:12}}>{c.value_type === 'percentage' ? `${c.value}%` : `₱${c.value}`}</span>
                          {c._displayStatus === 'deleted' && <span style={{color:'#ef4444',fontSize:11,fontWeight:600,marginLeft:8}}>DELETED</span>}
                          {c._displayStatus === 'upcoming' && <span style={{color:'#f59e0b',fontSize:11,fontWeight:600,marginLeft:8}}>UPCOMING</span>}
                          {c._displayStatus === 'inactive' && <span style={{color:'#f59e0b',fontSize:11,fontWeight:600,marginLeft:8}}>INACTIVE</span>}
                          {c._displayStatus === 'active' && <span style={{color:'#10b981',fontSize:11,fontWeight:600,marginLeft:8}}>ACTIVE</span>}
                        </div>
                        <div style={{color:'#9a9a9a',fontSize:13}}>{c.description || '—'}</div>
                        <div style={{color:'#6b7280',fontSize:12,marginTop:6}}>
                          Uses: {c.number_of_uses}/{c.max_uses ? c.max_uses : '∞'}
                        </div>
                        {c._displayStatus === 'expired' && (
                          <div style={{color:'#f59e0b',fontSize:12,marginTop:6}}>
                            End date: {c.end_date || '—'}
                          </div>
                        )}
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
