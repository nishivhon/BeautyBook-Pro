/* ══════════════════════════════════════════
   IMPORTS
══════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "../confirmation_dialog";
import { Toast } from "../../../toast";

/* ══════════════════════════════════════════
   INLINE SVG ICONS
══════════════════════════════════════════ */

/* Scissors icon for the service row */
const ScissorsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={22} height={22}>
    <circle cx="6" cy="7"  r="3.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    <circle cx="6" cy="17" r="3.5" stroke="#1a0f00" strokeWidth="1.8" fill="none"/>
    <path d="M9 5.5 L22 12"  stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 18.5 L22 12" stroke="#1a0f00" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="6" cy="7"  r="1.4" fill="#1a0f00"/>
    <circle cx="6" cy="17" r="1.4" fill="#1a0f00"/>
  </svg>
);

/* Person / user icon */
const PersonIcon = () => (
  <svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={20} style={{ flexShrink: 0 }}>
    <circle cx="10" cy="6" r="5" stroke="#988f81" strokeWidth="1.5" fill="none"/>
    <path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke="#988f81" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Envelope icon */
const EnvelopeIcon = () => (
  <svg viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={20} height={16} style={{ flexShrink: 0 }}>
    <rect x="1" y="1" width="20" height="14" rx="2" stroke="#988f81" strokeWidth="1.5" fill="none"/>
    <path d="M1 4l10 6 10-6" stroke="#988f81" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* Phone icon */
const PhoneIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={18} style={{ flexShrink: 0 }}>
    <path
      d="M4 1h4l2 5-2.5 1.5C8.3 10 10 11.7 12.5 12.5L14 10l5 2v4c0 1.7-1.3 3-3 3C6.3 19 1 13.7 1 7c0-1.7 1.3-3 3-3z"
      stroke="#988f81" strokeWidth="1.5" fill="none" strokeLinejoin="round"
    />
  </svg>
);

/* Stylist / person with hair (comb-like) icon */
const StylistIcon = () => (
  <svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={20} style={{ flexShrink: 0 }}>
    <circle cx="10" cy="6" r="4.5" stroke="#988f81" strokeWidth="1.5" fill="none"/>
    <path d="M1 20c0-5 4-9 9-9s9 4 9 9" stroke="#988f81" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    {/* comb tines on top of head */}
    <path d="M7 2.5 Q10 1 13 2.5" stroke="#988f81" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>
);

/* Back arrow */
const BackArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
    <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Download/Print icon */
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={18} height={18} style={{ flexShrink: 0 }}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* ══════════════════════════════════════════
   DATA — in real app these would be props
══════════════════════════════════════════ */
const BOOKING = {
  service:   "Haircut",
  duration:  "30 mins",
  dateTime:  "12/15/2025 | 9:00AM",
  price:     "₱150",
  name:      "Jake Quaker",
  email:     "quakerjake@gmail.com",
  phone:     "09xxxxxxxxx",
  stylist:   "Any Available Stylist",
  refNo:     "18xxx-xxxx",
};

const STEPS = [
  { number: 1, label: "Schedule" },
  { number: 2, label: "Service"  },
  { number: 3, label: "Stylist"  },
  { number: 4, label: "Confirm"  },
];

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

/* ── Header ── */
const BookingHeader = ({ onBack, isConfirmed }) => (
  <header className="appt-header">
    <button 
      className="appt-back-btn" 
      onClick={onBack} 
      aria-label="Go back"
      disabled={isConfirmed}
      style={{ opacity: isConfirmed ? 0.5 : 1, cursor: isConfirmed ? "not-allowed" : "pointer" }}
    >
      <BackArrowIcon />
      Back
    </button>
    <h1 className="appt-header-title">Book Appointment</h1>
    <div className="appt-back-btn" aria-hidden style={{ visibility: "hidden" }}>Back</div>
  </header>
);

/* ── Progress bar — Phase 4 state ── */
/* Steps 1, 2, 3 done (✓); all connectors amber; step 4 active */
const ProgressIndicator = ({ currentStep = 4 }) => (
  <div className="appt-progress">
    <div className="appt-progress-track">
      {STEPS.map((step, i) => {
        const isDone   = step.number < currentStep;
        const isActive = step.number === currentStep;
        return (
          <div key={step.number} className="appt-progress-item">
            <div className={`appt-step-circle${isActive ? " active" : isDone ? " done" : ""}`}>
              {isDone
                ? <svg viewBox="0 0 12 12" fill="none" width={13} height={13}>
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                : step.number
              }
            </div>
            {/* all connectors amber in phase 4 */}
            {i < STEPS.length - 1 && (
              <div className="appt-step-line done" />
            )}
          </div>
        );
      })}
    </div>
    <div className="appt-progress-labels">
      {STEPS.map((step) => (
        <span
          key={step.number}
          className={`appt-step-label${step.number === currentStep ? " active" : " done"}`}
        >
          {step.label}
        </span>
      ))}
    </div>
  </div>
);

/* ── Thin divider ── */
const Divider = () => (
  <div style={{ width: "100%", height: 1, background: "rgba(152,143,129,0.25)", flexShrink: 0 }} />
);

/* ══════════════════════════════════════════
   MAIN COMPONENT — Phase 4
══════════════════════════════════════════ */
export const AppointmentFormPhase4 = ({ onBack, onConfirm, onCancel, booking = BOOKING }) => {
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showReceiptReminder, setShowReceiptReminder] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showConfirmationToast, setShowConfirmationToast] = useState(false);

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (showConfirmationToast) {
      const timer = setTimeout(() => {
        setShowConfirmationToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmationToast]);

  // Debug render logging
  // eslint-disable-next-line no-console
  console.log('[Phase4] render - showConfirmationToast:', showConfirmationToast, 'showReceiptReminder:', showReceiptReminder, 'isConfirmed:', isConfirmed);
  // Safety check: if booking is missing, return null
  if (!booking) {
    return <div style={{ padding: "20px", textAlign: "center", color: "#988f81" }}>Loading booking details...</div>;
  }

  // Handle both array (old format) and object (new format) for backward compatibility
  const isArrayFormat = Array.isArray(booking);
  const services = isArrayFormat ? booking : (booking?.services || []);
  const bookingData = isArrayFormat ? (booking[0] || booking) : booking;
  
  // Get the first service for the top display
  const mainService = services[0] || {};
  
  // Calculate total price and duration from all services
  const totalPrice = Array.isArray(services) && services.length > 0 ? services.reduce((sum, svc) => {
    const price = parseFloat(svc?.price?.toString().replace(/[^0-9.]/g, '') || 0);
    return sum + price;
  }, 0) : 0;
  
  const totalDuration = Array.isArray(services) && services.length > 0 ? services.reduce((sum, svc) => {
    const mins = parseInt(svc?.duration?.toString().match(/\d+/) || 0);
    return sum + mins;
  }, 0) : 0;

  /* Handle final confirmation */
  const handleConfirmBooking = async () => {
    try {
      console.log('[Phase4] Confirm button clicked!');
      console.log('[Phase4] Current state - isConfirmed:', isConfirmed, 'showConfirmationToast:', showConfirmationToast);
      
      // Show confirmation toast immediately
      console.log('[Phase4] Setting toast visible...');
      setShowConfirmationToast(true);
      setIsConfirmed(true);
      console.log('[Phase4] Toast and confirmed state set - about to log states');
      
      // Log state updates
      setTimeout(() => {
        console.log('[Phase4] After state update - isConfirmed:', isConfirmed, 'showConfirmationToast:', showConfirmationToast);
      }, 0);
      
      // Extract service(s) - get first one or join all
      const serviceList = Array.isArray(booking.services) && booking.services.length > 0
        ? booking.services.map(s => s.title || s.name).join(', ')
        : booking.service || 'General Service';
      
      // Determine contact (either email or phone, whichever is provided)
      const email = booking.email?.trim();
      const phone = booking.phone?.trim();
      const contact = email || phone;
      
      // Extract booking data
      const bookingData = {
        name: booking.name?.trim(),
        email: email,
        phone: phone,
        date: booking.date,
        time: booking.time,
        service: serviceList,
        staff_assigned: booking.stylist
      };
      
      console.log('[Phase4] Booking data:', bookingData);
      
      // Validate required fields (email OR phone, not both required)
      if (!bookingData.name || !contact || !bookingData.date || !bookingData.time || !bookingData.service || !bookingData.staff_assigned) {
        console.error('[Phase4] Missing fields:', {
          name: !!bookingData.name,
          contact: !!contact,
          date: !!bookingData.date,
          time: !!bookingData.time,
          service: !!bookingData.service,
          staff_assigned: !!bookingData.staff_assigned
        });
        return;
      }
      
      // Call the appointment creation API
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('[Phase4] API error:', result);
        return;
      }
      
      console.log('[Phase4] Booking confirmed:', result);
      
    } catch (error) {
      console.error('[Phase4] Error confirming booking:', error);
    }
  };

  /* Generate printable receipt */
  const handleDownloadReceipt = () => {
    console.log('[Phase4] Download Receipt clicked');
    // Show receipt generated - now remind user to save it
    console.log('[Phase4] Setting showReceiptReminder to true');
    setShowReceiptReminder(true);
    console.log('[Phase4] Generating receipt...');
    generateReceipt();
  };

  /* Generate the receipt HTML and open print dialog */
  const generateReceipt = () => {
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>BeautyBook Pro - Receipt</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f5f5; 
            padding: 20px;
          }
          .receipt { 
            max-width: 480px; 
            margin: 0 auto; 
            background: #fff; 
            padding: 32px 24px; 
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 32px; 
            border-bottom: 2px solid #dd901d;
            padding-bottom: 16px;
          }
          .logo { 
            font-size: 24px; 
            font-weight: 700; 
            color: #1a0f00; 
            margin-bottom: 4px;
          }
          .subtitle { 
            font-size: 12px; 
            color: #988f81; 
          }
          .section { 
            margin-bottom: 24px; 
          }
          .section-title { 
            font-size: 11px; 
            font-weight: 600; 
            color: #dd901d; 
            text-transform: uppercase; 
            letter-spacing: 0.05em;
            margin-bottom: 12px;
          }
          .service-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #1a0f00;
          }
          .service-name { flex: 1; }
          .service-price { 
            font-weight: 600; 
            color: #dd901d;
            margin-left: 8px;
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between;
            font-size: 13px;
            margin-bottom: 8px;
            color: #1a0f00;
          }
          .detail-label { 
            color: #988f81; 
            font-weight: 500;
          }
          .detail-value { 
            font-weight: 600; 
          }
          .divider { 
            height: 1px; 
            background: rgba(26,15,0,0.1); 
            margin: 16px 0;
          }
          .total { 
            display: flex; 
            justify-content: space-between;
            font-size: 16px;
            font-weight: 700;
            color: #1a0f00;
            padding: 12px 0;
            border-top: 2px solid #dd901d;
            border-bottom: 2px solid #dd901d;
            margin: 16px 0;
          }
          .ref-box { 
            background: #f9f7f4; 
            padding: 12px; 
            border-radius: 8px; 
            text-align: center;
            margin: 16px 0;
          }
          .ref-label { 
            font-size: 10px; 
            color: #988f81; 
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
          }
          .ref-code { 
            font-size: 18px; 
            font-weight: 700; 
            color: #dd901d; 
            font-family: 'Courier New', monospace;
          }
          .footer { 
            text-align: center; 
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid rgba(26,15,0,0.1);
            font-size: 11px;
            color: #988f81;
            line-height: 1.6;
          }
          @media print {
            body { padding: 0; background: #fff; }
            .receipt { box-shadow: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">BeautyBook Pro</div>
            <div class="subtitle">Booking Receipt</div>
          </div>

          <div class="section">
            <div class="section-title">Services</div>
            ${services.map(svc => `
              <div class="service-item">
                <span class="service-name">${svc.title || svc.name || 'Service'}</span>
                <span class="service-price">${svc.price || 'N/A'}</span>
              </div>
            `).join('')}
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Appointment Details</div>
            <div class="detail-row">
              <span class="detail-label">Date & Time</span>
              <span class="detail-value">${bookingData?.dateTime || 'Not Selected'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration</span>
              <span class="detail-value">${totalDuration} mins</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Stylist</span>
              <span class="detail-value">${bookingData?.stylist || 'N/A'}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="detail-row">
              <span class="detail-label">Name</span>
              <span class="detail-value">${bookingData?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email</span>
              <span class="detail-value">${bookingData?.email || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone</span>
              <span class="detail-value">${bookingData?.phone || 'N/A'}</span>
            </div>
          </div>

          <div class="total">
            <span>Total Amount</span>
            <span>₱${totalPrice.toFixed(2)}</span>
          </div>

          <div class="ref-box">
            <div class="ref-label">Reference Number</div>
            <div class="ref-code">${bookingData?.refNo || 'N/A'}</div>
          </div>

          <div class="footer">
            <p>Please keep this reference number for your records.</p>
            <p>You will receive a confirmation via email and SMS 15 minutes before your appointment.</p>
            <p style="margin-top: 12px; color: #dd901d;">Thank you for choosing BeautyBook Pro!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create a blob from the HTML
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open print dialog
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  return (
    <>
      {/* ── Toast Notifications (Top Fixed Position) ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999999, pointerEvents: "auto", display: "flex", justifyContent: "center", padding: "20px" }}>
        <Toast 
          message="Booking Confirmed!" 
          type="success" 
          duration={2000} 
          isVisible={showConfirmationToast} 
        />
      </div>

      <div 
        className="appt-backdrop"
        onClick={(e) => {
          console.log('[Phase4] Backdrop click detected', { 
            target: e.target.className, 
            currentTarget: e.currentTarget.className,
            isConfirmed 
          });
          // Only trigger if clicking directly on backdrop, not on children
          if (e.target === e.currentTarget) {
            if (!isConfirmed) {
              console.log('[Phase4] Conditions met - showing cancel dialog');
              setShowBackdropConfirm(true);
            } else if (isConfirmed && !showReceiptReminder) {
              console.log('[Phase4] Booking is confirmed and user clicked outside - showing receipt reminder');
              setShowReceiptReminder(true);
            }
          }
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          cursor: !isConfirmed ? "pointer" : "default",
          backgroundColor: "rgba(0, 0, 0, 0.7)"
        }}
      >
        <div className="appt-root" onClick={(e) => e.stopPropagation()}>
          <BookingHeader onBack={onBack} isConfirmed={isConfirmed} />
          <ProgressIndicator currentStep={4} />

          {/* ── Scrollable body ── */}
          <div className="appt-body" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "0 40px" }}>
            <div className="appt-section-heading">
              <p className="appt-section-title">Confirm Booking</p>
              <p className="appt-section-sub">Review your appointment details</p>
            </div>

            {/* ── Confirmation summary card ── */}
            <div className="confirm-card">
              {/* Service Summary Section - matches wireframe */}
              {services.length > 0 && (
                <>
                  <div className="confirm-service-row">
                    <div className="confirm-service-left">
                      <div className="confirm-svc-icon">
                        <ScissorsIcon />
                      </div>
                      <div className="confirm-svc-text">
                        <span className="confirm-svc-name">{mainService.title || mainService.name || "Service"}</span>
                        <span className="confirm-svc-duration">{totalDuration} mins</span>
                      </div>
                    </div>
                    <div className="confirm-svc-meta">
                      <span className="confirm-svc-datetime">{bookingData?.dateTime || "Not Selected"}</span>
                      <span className="confirm-svc-price">₱{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Divider />
                </>
              )}

              {/* Services List Section */}
              {services.length > 0 && (
                <>
                  <div style={{ marginBottom: "16px", marginTop: "12px" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: "600", color: "var(--color-tan)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "12px" }}>
                      Services Selected
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {services.map((service, idx) => (
                        <div key={idx} style={{ fontSize: "0.85rem", color: "var(--color-white)", paddingLeft: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>• {service.title || service.name || "Service"}</span>
                          <span style={{ color: "var(--color-tan)" }}>{service.price || "N/A"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Divider />
                </>
              )}

              {/* Contact details */}
              <div className="confirm-details">
                <div className="confirm-detail-row">
                  <PersonIcon />
                  <div className="confirm-detail-text">
                    <span className="confirm-detail-label">Name</span>
                    <span className="confirm-detail-value">{bookingData?.name || "N/A"}</span>
                  </div>
                </div>
                {bookingData?.verificationMethod === 'email' && (
                  <div className="confirm-detail-row">
                    <EnvelopeIcon />
                    <div className="confirm-detail-text">
                      <span className="confirm-detail-label">Email</span>
                      <span className="confirm-detail-value">{bookingData?.email || "N/A"}</span>
                    </div>
                  </div>
                )}
                {bookingData?.verificationMethod === 'phone' && (
                  <div className="confirm-detail-row">
                    <PhoneIcon />
                    <div className="confirm-detail-text">
                      <span className="confirm-detail-label">Phone No.</span>
                      <span className="confirm-detail-value">{bookingData?.phone || "N/A"}</span>
                    </div>
                  </div>
                )}
                <div className="confirm-detail-row">
                  <StylistIcon />
                  <div className="confirm-detail-text">
                    <span className="confirm-detail-label">Stylist</span>
                    <span className="confirm-detail-value">{bookingData?.stylist || "N/A"}</span>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Bottom: ref no. + reminder */}
              <div className="confirm-bottom-row">
                {/* reference number pill */}
                <div className="confirm-ref-pill">
                  Ref. No.: {bookingData?.refNo || "N/A"}
                </div>
                {/* reminder box */}
                <div className="confirm-reminder-box">
                  <p className="confirm-reminder-text">
                    Reminder: You'll receive notifications<br/>
                    15 minutes before your turn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer CTA (Inside Modal) ── */}
          <div 
            className="appt-footer" 
            style={{ 
              display: "flex", 
              flexDirection: "row", 
              gap: "12px",
              padding: "16px 20px",
              background: "rgba(0,0,0,0.5)",
              borderTop: "1px solid rgba(152,143,129,0.2)",
              flexShrink: 0
            }}
          >
            {!isConfirmed && (
              <button 
                className="appt-continue-btn" 
                onClick={handleConfirmBooking} 
                style={{flex: 1, cursor: "pointer"}}
              >
                Confirm
              </button>
            )}
            {isConfirmed && (
              <button 
                className="appt-download-receipt-btn"
                onClick={(e) => {
                  console.log('[Phase4] Download Receipt button clicked', e);
                  handleDownloadReceipt();
                }}
                style={{flex: 1, cursor: "pointer", padding: "12px", fontSize: "16px", fontWeight: "600"}}
              >
                <DownloadIcon />
                Download Receipt
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop Click Confirmation Dialog - Only show if booking not confirmed */}
      {!isConfirmed && (
        <ConfirmationDialog
          isOpen={showBackdropConfirm}
          title="Cancel Booking?"
          message="Are you sure you want to cancel? Your booking progress will be lost."
          confirmText="Yes, Cancel Booking"
          cancelText="Keep Booking"
          onConfirm={() => {
            console.log('[Phase4] Booking cancelled confirmed');
            setShowBackdropConfirm(false);
            onCancel?.();
          }}
          onCancel={() => {
            console.log('[Phase4] Keep booking clicked');
            setShowBackdropConfirm(false);
          }}
        />
      )}

      {/* Receipt Reminder Confirmation Dialog - Only show if booking was confirmed */}
      {isConfirmed && (
        <ConfirmationDialog
          isOpen={showReceiptReminder}
          title="Save Your Booking Info"
          message={`Have you saved your receipt and reference number?\n\nReference No.: ${bookingData?.refNo || "N/A"}\n\nYou'll need this for check-in.`}
          confirmText="Yes, Saved"
          cancelText="Download Again"
          onConfirm={() => {
            console.log('[Phase4] Receipt saved confirmed');
            setShowReceiptReminder(false);
            setShowSuccessToast(true);
            // Close the modal after a short delay and stay on the current dashboard page
            setTimeout(() => {
              onCancel?.();
            }, 2000);
          }}
          onCancel={() => {
            console.log('[Phase4] Download again clicked');
            setShowReceiptReminder(false);
            generateReceipt();
            // Reopen the dialog after a brief delay so user can download again
            setTimeout(() => {
              setShowReceiptReminder(true);
            }, 100);
          }}
        />
      )}
    </>
  );
};

export default AppointmentFormPhase4;