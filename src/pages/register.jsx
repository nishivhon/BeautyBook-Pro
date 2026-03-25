import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Otp } from "../components/modal/otp";
import { AppointmentForm } from "../components/modal/appointment/phase_one";
import { AppointmentFormPhase2 } from "../components/modal/appointment/phase_two";
import { AppointmentFormPhase3 } from "../components/modal/appointment/phase_three";
import { AppointmentFormPhase4 } from "../components/modal/appointment/phase_four";
import { ConfirmationDialog } from "../components/modal/confirmation_dialog";
import { Toast } from "../components/toast";

/** Logo scissors mark */
const LogoMark = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 26, height: 26 }}>
    {/* two pivot circles */}
    <circle cx="10" cy="26" r="5" stroke="black" strokeWidth="2.2" fill="none" />
    <circle cx="10" cy="14" r="5" stroke="black" strokeWidth="2.2" fill="none" />
    {/* blades crossing */}
    <path d="M14 22 L34 10" stroke="black" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M14 18 L34 30" stroke="black" strokeWidth="2.2" strokeLinecap="round" />
    {/* finger rings */}
    <circle cx="10" cy="26" r="2" fill="black" />
    <circle cx="10" cy="14" r="2" fill="black" />
  </svg>
);

/** Person / user icon for Full Name */
const PersonIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <circle cx="9" cy="5.5" r="3.5" stroke="#988f81" strokeWidth="1.4" fill="none" />
    <path d="M2 16c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="#988f81" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </svg>
);

/** Envelope icon for Email */
const EnvelopeIcon = () => (
  <svg viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 13, flexShrink: 0 }}>
    <rect x="1" y="1" width="16" height="12" rx="1.5" stroke="#988f81" strokeWidth="1.4" fill="none" />
    <path d="M1 3l8 5 8-5" stroke="#988f81" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/** Phone icon for Phone Number */
const PhoneIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 15, height: 15, flexShrink: 0 }}>
    <path
      d="M3.6 1h3.2l1.6 4-2 1.2C7.3 8.5 9.5 10.7 11.8 11.6L13 9.6l4 1.6v3.2C17 15.8 15.8 17 14.4 17 7.2 17 1 10.8 1 3.6 1 2.2 2.2 1 3.6 1z"
      stroke="#988f81" strokeWidth="1.4" fill="none" strokeLinejoin="round"
    />
  </svg>
);

/** Unchecked checkbox */
const CheckboxEmpty = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
    <rect x="1" y="1" width="18" height="18" rx="3" stroke="#988f81" strokeWidth="1.5" fill="none" />
  </svg>
);

/** Checked checkbox — amber fill with white tick */
const CheckboxChecked = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
    <rect x="0" y="0" width="20" height="20" rx="3.5" fill="#dd901d" />
    <path d="M4.5 10l4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Dashed-border field wrapper */
const FieldBox = ({ label, children }) => (
  <div className="field-box">
    <span className="field-label">{label}</span>
    {children}
  </div>
);

/** Dark inner input row with left icon */
const InputRow = ({ icon, placeholder, type = "text", value, onChange }) => (
  <div className="input-row">
    <div className="input-wrapper">
      {icon}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  </div>
);

/** Toggle row: label + checkbox */
const ToggleRow = ({ label, checked, onToggle }) => (
  <div className="toggle-row">
    <span className="toggle-label">{label}</span>
    <button
      type="button"
      onClick={onToggle}
      className="checkbox-btn"
      aria-pressed={checked}
    >
      {checked ? <CheckboxChecked /> : <CheckboxEmpty />}
    </button>
  </div>
);

export const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors]     = useState({});
  const [showOTP, setShowOTP]   = useState(false);
  const [formData, setFormData] = useState(null);
  const [showAppointment, setShowAppointment] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [appointmentPhase, setAppointmentPhase] = useState(1);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Validate email if selected
    if (useEmail) {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    // Validate phone if selected
    if (usePhone) {
      if (!phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (phone.length !== 11) {
        newErrors.phone = "Phone number should be 11 digits";
      }
    }

    // Check if at least one notification method is selected
    if (!useEmail && !usePhone) {
      newErrors.notification = "Please select at least one notification method";
    }

    setErrors(newErrors);

    // If no errors, show OTP modal
    if (Object.keys(newErrors).length === 0) {
      setFormData({ fullName, email, phone, useEmail, usePhone, rememberMe });
      setShowOTP(true);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleOTPVerified = (otp) => {
    console.log("OTP Verified:", otp);
    console.log("Form submitted successfully:", formData);
    // Close OTP modal and show appointment booking modal
    setShowOTP(false);
    setShowAppointment(true);
  };

  const handleOTPClose = () => {
    setShowOTP(false);
  };

  const handleCancelBooking = () => {
    // Show toast message and navigate to landpage
    setShowAppointment(false);
    setAppointmentPhase(1);
    setFormData(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setToastMessage("Booking cancelled");
    setShowToast(true);
    // Give toast time to be visible before navigation
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  const handleAppointmentContinue = (appointmentDetails) => {
    console.log("Phase 1 data:", appointmentDetails);
    // Move to phase 2
    setAppointmentData({ ...appointmentData, schedule: appointmentDetails });
    setAppointmentPhase(2);
  };

  const handlePhase2Continue = (phase2Details) => {
    console.log("Phase 2 data:", phase2Details);
    // Move to phase 3
    setAppointmentData({ ...appointmentData, services: phase2Details });
    setAppointmentPhase(3);
  };

  const handlePhase3Continue = (phase3Details) => {
    console.log("Phase 3 data:", phase3Details);
    // Move to phase 4 (confirmation)
    setAppointmentData({ ...appointmentData, stylist: phase3Details.stylist });
    setAppointmentPhase(4);
  };

  const handleAppointmentBackPhase3 = (phase3Details) => {
    // Preserve the stylist selection from phase 3
    setAppointmentData({ ...appointmentData, stylist: phase3Details?.stylist });
    // Go back to phase 2 with preserved service selection
    setAppointmentPhase(2);
  };

  const handleAppointmentBackPhase2 = () => {
    setAppointmentPhase(1);
  };

  const handleAppointmentBackPhase4 = () => {
    setAppointmentPhase(3);
  };

  const handlePhase4Confirm = () => {
    console.log("Booking confirmed:", appointmentData);
    console.log("User data:", formData);
    const completeData = { ...formData, appointment: appointmentData };
    setAppointmentData(completeData);
    setShowAppointment(false);
    setAppointmentPhase(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setFormData(null);
  };

  const handleBackdropClick = (e) => {
    // Only trigger if clicking directly on the backdrop (not a child element)
    if (e.target === e.currentTarget) {
      setShowBackdropConfirm(true);
    }
  };

  // Format booking data for phase 4
  const getFormattedBooking = () => {
    const stylistName = appointmentData?.stylist?.name || "Any Available Stylist";
    const scheduleInfo = appointmentData?.schedule;
    const dateTime = scheduleInfo?.dateTime || `${scheduleInfo?.date?.date || "Not Selected"} | ${scheduleInfo?.time || "N/A"}`;
    
    // Extract individual selected services from all categories
    let allServices = [];
    const servicesData = appointmentData?.services;
    
    if (servicesData) {
      // Collect all individual selected services from each category
      const selectedArrays = [
        servicesData.selectedHairServices,
        servicesData.selectedNailServices,
        servicesData.selectedSkincareServices,
        servicesData.selectedMassageServices,
        servicesData.selectedPremiumServices
      ];
      
      selectedArrays.forEach(arr => {
        if (Array.isArray(arr) && arr.length > 0) {
          allServices = allServices.concat(arr);
        }
      });
      
      // If no individual services found, try to get from main services array
      if (allServices.length === 0) {
        if (Array.isArray(servicesData)) {
          allServices = servicesData;
        } else if (servicesData.services && Array.isArray(servicesData.services)) {
          allServices = servicesData.services;
        }
      }
    }
    
    // Format each service with booking details
    const formattedServices = allServices.map(serviceInfo => ({
      title: serviceInfo.title || serviceInfo.name || serviceInfo.service || "Service",
      duration: serviceInfo.duration || "N/A",
      price: serviceInfo.price || "N/A",
      est: serviceInfo.duration || "N/A"
    }));
    
    // Return object with services array and common booking details
    return {
      services: formattedServices,
      dateTime: dateTime,
      name: formData?.fullName || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      stylist: stylistName,
      refNo: "18xxx-xxxx",
    };
  };

  return (
    <div className="register-container">

      {/* ── LEFT PANEL ── */}
      <div className="register-left">

        {/* Content wrapper */}
        <div className="form-wrapper">

        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          className="btn-back"
        >
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16 }}>
            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 46, height: 46,
            background: "#dd901d",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LogoMark />
          </div>
          <span className="brand-name">BeautyBook Pro</span>
        </div>

        {/* Heading */}
        <div className="form-heading">
          <h1 className="form-title">Let's Get You Started!</h1>
          <p className="form-subtitle">
            Enter your details below to book appointments and enjoy seamless, personalized service.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-body">

          {/* NAME */}
          <FieldBox label="Name">
            <InputRow
              icon={<PersonIcon />}
              placeholder="Full Name"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </FieldBox>

          {/* USE EMAIL TOGGLE */}
          <ToggleRow
            label="Use Email for Notification:"
            checked={useEmail}
            onToggle={() => {
              if (useEmail) {
                setUseEmail(false);
              } else {
                setUseEmail(true);
                setUsePhone(false);
              }
            }}
          />

          {/* EMAIL ADDRESS */}
          <FieldBox label="Email Address">
            <InputRow
              icon={<EnvelopeIcon />}
              placeholder="you@gmail.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </FieldBox>

          {/* USE PHONE TOGGLE */}
          <ToggleRow
            label="Use Phone No. for Notification:"
            checked={usePhone}
            onToggle={() => {
              if (usePhone) {
                setUsePhone(false);
              } else {
                setUsePhone(true);
                setUseEmail(false);
              }
            }}
          />
          {errors.notification && <span className="error-text">{errors.notification}</span>}

          {/* PHONE NUMBER */}
          <FieldBox label="Phone Number">
            <InputRow
              icon={<PhoneIcon />}
              placeholder="# ### ### ####"
              type="tel"
              value={phone}
              onChange={e => {
                const numericOnly = e.target.value.replace(/[^0-9]/g, "");
                if (numericOnly.length <= 11) {
                  setPhone(numericOnly);
                }
              }}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </FieldBox>

          {/* CONFIRM BUTTON + REMEMBER ME */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            <button
              type="submit"
              className="btn-large"
              style={{ width: "100%" }}
            >
              Confirm
            </button>

            {/* Remember Me */}
            <div className="checkbox-section">
              <button
                type="button"
                onClick={() => setRememberMe(v => !v)}
                className="checkbox-btn"
                aria-pressed={rememberMe}
              >
                {rememberMe ? <CheckboxChecked /> : <CheckboxEmpty />}
              </button>
              <span className="remember-text">Remember Me?</span>
            </div>
          </div>

        </form>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="register-right">

        {/* Big amber circle with scissors */}
        <div className="right-panel-circle">
          {/* Large scissors for the panel */}
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 60, height: 60 }}>
            <circle cx="14" cy="40" r="9" stroke="#1a1208" strokeWidth="3" fill="none" />
            <circle cx="14" cy="20" r="9" stroke="#1a1208" strokeWidth="3" fill="none" />
            <path d="M22 36 L54 14" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
            <path d="M22 24 L54 46" stroke="#1a1208" strokeWidth="3" strokeLinecap="round" />
            <circle cx="14" cy="40" r="3.5" fill="#1a1208" />
            <circle cx="14" cy="20" r="3.5" fill="#1a1208" />
          </svg>
        </div>

        <h2 className="right-panel-title">Digital Appointment System</h2>

        <p className="right-panel-text">
          Book appointments and enjoy a seamless salon experience—no waiting in line.
        </p>
      </div>

      {/* OTP Modal */}
      {showOTP && (
        <Otp 
          onClose={handleOTPClose} 
          onVerified={handleOTPVerified}
        />
      )}

      {/* Appointment Booking Modal */}
      {showAppointment && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 101,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0,0,0,0.72)"
          }}
          onClick={handleBackdropClick}
        >
          {appointmentPhase === 1 ? (
            <AppointmentForm
              onBack={handleCancelBooking}
              onContinue={handleAppointmentContinue}
            />
          ) : appointmentPhase === 2 ? (
            <AppointmentFormPhase2
              onBack={handleAppointmentBackPhase2}
              onContinue={handlePhase2Continue}
              onCancel={handleCancelBooking}
              initialData={appointmentData?.services}
            />
          ) : appointmentPhase === 3 ? (
            <AppointmentFormPhase3
              onBack={handleAppointmentBackPhase3}
              onContinue={handlePhase3Continue}
              onCancel={handleCancelBooking}
            />
          ) : appointmentPhase === 4 ? (
            <AppointmentFormPhase4
              onBack={handleAppointmentBackPhase4}
              onConfirm={handlePhase4Confirm}
              booking={getFormattedBooking()}
            />
          ) : null}
        </div>
      )}

      {/* Backdrop Click Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showBackdropConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel? Your booking progress will be lost."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={() => {
          setShowBackdropConfirm(false);
          handleCancelBooking();
        }}
        onCancel={() => setShowBackdropConfirm(false)}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={showToast}
        message={toastMessage}
        type="info"
        duration={1200}
      />

    </div>
  );
};

export default Register;