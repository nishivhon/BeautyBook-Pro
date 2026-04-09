import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../components/modal/customer/appointment/phase_one";
import { AppointmentFormPhase2 } from "../components/modal/customer/appointment/phase_two";
import { AppointmentFormPhase3 } from "../components/modal/customer/appointment/phase_three";
import { AppointmentFormPhase4 } from "../components/modal/customer/appointment/phase_four";
import { ConfirmationDialog } from "../components/modal/customer/confirmation_dialog";
import { Toast } from "../components/toast";
import { Otp } from "../components/modal/customer/otp";

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
  const [useEmail, setUseEmail] = useState(true);
  const [usePhone, setUsePhone] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors]     = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [showAppointment, setShowAppointment] = useState(false);
  const [backdropClickEnabled, setBackdropClickEnabled] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [appointmentPhase, setAppointmentPhase] = useState(1);
  const [showBackdropConfirm, setShowBackdropConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpType, setOtpType] = useState("phone"); // "phone" or "email"

  // Create a wrapper for navigate that logs and blocks for verified users
  const navigateWithGuard = (path) => {
    if (verifiedUser !== null && verifiedUser !== undefined && path === "/") {
      return;
    }
    navigate(path);
  };

  // Check if coming from email link with verified user
  useEffect(() => {
    const userData = sessionStorage.getItem("verifiedUser");
    const sessionUsed = sessionStorage.getItem("sessionUsed");
    
    // If session was marked as used AND userData is gone, link is EXPIRED
    // But if userData still exists, it's just a remount - continue normal flow
    if (sessionUsed === "true" && !userData) {
      setSessionExpired(true);
      setShowAppointment(false);
      return;
    }
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setVerifiedUser(user);
        
        // Pre-fill form with verified user data
        setFullName(user.full_name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        
        // Auto-show appointment modal for email link users
        // DO NOT mark as used yet - we'll do that in a separate effect after modal shows
        setShowAppointment(true);
      } catch (err) {
        setVerifiedUser(null);
      }
    } else {
      setVerifiedUser(null);
    }
  }, []);

  // SEPARATE EFFECT: Mark session as used AFTER modal is shown
  useEffect(() => {
    if (showAppointment && verifiedUser && sessionStorage.getItem("sessionUsed") !== "true") {
      sessionStorage.setItem("sessionUsed", "true");
      
      // Delay enabling backdrop clicks
      setTimeout(() => {
        setBackdropClickEnabled(true);
      }, 500);
    }
  }, [showAppointment, verifiedUser]);

  // Track state changes (for debugging if needed)
  useEffect(() => {
  }, [verifiedUser, showAppointment, appointmentPhase]);

  // Preserve verified user state in localStorage as backup
  useEffect(() => {
    if (verifiedUser && showAppointment) {
      localStorage.setItem("verifiedUserBackup", JSON.stringify(verifiedUser));
    }
  }, [verifiedUser, showAppointment]);

  // On component mount, check if we need to restore from backup
  // Only restore if this is the same session
  useEffect(() => {
    const backup = localStorage.getItem("verifiedUserBackup");
    const sessionUsed = sessionStorage.getItem("sessionUsed");
    
    if (backup && !verifiedUser && sessionUsed === "true") {
      const user = JSON.parse(backup);
      setVerifiedUser(user);
      setShowAppointment(true);
    }
  }, []);



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

    // If no errors, send verification via email or SMS
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      const apiUrl = import.meta.env.VITE_API_URL;

      // Determine which endpoint to use
      let endpoint, requestData, successMessage;
      
      if (usePhone && !useEmail) {
        // Phone only - use SMS OTP
        endpoint = `${apiUrl}/sms/send-otp`;
        requestData = { phone, name: fullName };
        successMessage = `OTP sent to ${phone}. Check your messages!`;
        console.log('Sending SMS OTP to:', phone);
      } else if (useEmail && !usePhone) {
        // Email only - use Email OTP (NEW)
        endpoint = `${apiUrl}/auth/send-email-otp`;
        requestData = { email, full_name: fullName, phone: phone || "" };
        successMessage = `OTP sent to ${email}. Check your inbox!`;
        console.log('Sending email OTP to:', email);
      } else {
        // Both email and phone - send SMS OTP (user can receive via either)
        endpoint = `${apiUrl}/sms/send-otp`;
        requestData = { phone, name: fullName };
        successMessage = `OTP sent to ${phone}. Check your messages!`;
        console.log('Sending SMS OTP to:', phone);
      }

      console.log('Data:', requestData);
      
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      })
        .then(res => {
          console.log('Response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Response data:', data);
          if (data.message || data.success) {
            setToastMessage(successMessage);
            setShowToast(true);
            setTimeout(() => { setShowToast(false); }, 10000);
            
            // Show OTP modal for both email and phone
            if (usePhone && !useEmail) {
              // Phone only
              setPendingPhone(phone);
              setPendingName(fullName);
              setPendingEmail("");
              setOtpType("phone");
              setShowOtpModal(true);
            } else if (useEmail && !usePhone) {
              // Email only
              setPendingEmail(email);
              setPendingName(fullName);
              setPendingPhone("");
              setOtpType("email");
              setShowOtpModal(true);
            } else {
              // Both email and phone - using SMS OTP
              setPendingPhone(phone);
              setPendingName(fullName);
              setPendingEmail("");
              setOtpType("phone");
              setShowOtpModal(true);
            }
          } else {
            const errorMsg = data.error || "Failed to send verification";
            console.error('❌ Error:', errorMsg);
            setToastMessage(errorMsg);
            setShowToast(true);
          }
        })
        .catch(err => {
          console.error('❌ Network/Fetch Error:', err);
          const errorMsg = `Error: ${err.message || 'Unable to connect to server'}`;
          setToastMessage(errorMsg);
          setShowToast(true);
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  const handleBack = () => {
    if (verifiedUser !== null && verifiedUser !== undefined) {
      return;
    }
    navigateWithGuard("/");
  };

  const handleOtpVerified = (otp) => {
    const cleanOtp = otp.replace(/\s/g, ''); // Remove spaces
    const apiUrl = import.meta.env.VITE_API_URL;
    
    // Determine which endpoint to use based on otpType
    let endpoint, verifyData, toastMsg;
    
    if (otpType === "phone") {
      if (!pendingPhone || !otp) return;
      endpoint = `${apiUrl}/sms/verify-otp`;
      verifyData = { phone: pendingPhone, otp: cleanOtp };
      toastMsg = '✅ Phone verified successfully! Proceeding to booking...';
      console.log('Verifying SMS OTP for:', pendingPhone);
    } else if (otpType === "email") {
      if (!pendingEmail || !otp) return;
      endpoint = `${apiUrl}/auth/verify-email-otp`;
      verifyData = { email: pendingEmail, otp: cleanOtp };
      toastMsg = '✅ Email verified successfully! Proceeding to booking...';
      console.log('Verifying Email OTP for:', pendingEmail);
    } else {
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success || data.verified) {
          console.log('✅ OTP verified successfully!');
          setToastMessage(toastMsg);
          setShowToast(true);
          
          // Store verified user
          const userData = {
            phone: pendingPhone || phone || "",
            full_name: pendingName || fullName,
            email: pendingEmail || email || ""
          };
          setVerifiedUser(userData);
          setShowAppointment(true);
          setBackdropClickEnabled(true);
          sessionStorage.setItem("verifiedUser", JSON.stringify(userData));
          sessionStorage.setItem("sessionUsed", "true");
          
          // Close OTP modal
          setShowOtpModal(false);
          setPendingPhone("");
          setPendingEmail("");
          setPendingName("");
          
          // Reset form
          setFullName("");
          setEmail("");
          setPhone("");
          setUseEmail(true);
          setUsePhone(false);
        } else {
          console.error('❌ OTP verification failed:', data.error);
          setToastMessage(data.error || 'Invalid OTP. Please try again.');
          setShowToast(true);
        }
      })
      .catch(err => {
        console.error('❌ OTP verification error:', err);
        setToastMessage(`Error: ${err.message || 'Unable to verify OTP'}`);
        setShowToast(true);
      });
  };

  const handleCancelBooking = () => {
    // If verified user cancels booking, INVALIDATE THE SESSION - One-time use enforcement
    if (verifiedUser !== null && verifiedUser !== undefined) {
      setShowAppointment(false);
      setBackdropClickEnabled(false);
      setAppointmentPhase(1);
      setSessionExpired(true);
      
      // Clear everything - session is now invalid
      sessionStorage.removeItem("verifiedUser");
      sessionStorage.removeItem("sessionUsed");
      localStorage.removeItem("verifiedUserBackup");
      setVerifiedUser(null);
      
      return; // FORCE EXIT
    }
    
    // NON-VERIFIED USER PATH ONLY REACHES HERE
    setShowAppointment(false);
    setBackdropClickEnabled(false);
    setAppointmentPhase(1);
    setFullName("");
    setEmail("");
    setPhone("");
    setUseEmail(true);
    setUsePhone(false);
    setTimeout(() => {
      if (verifiedUser === null || verifiedUser === undefined) {
        sessionStorage.removeItem("verifiedUser");
        localStorage.removeItem("verifiedUserBackup");
        navigateWithGuard("/");
      }
    }, 1200);
  };

  const handleAppointmentContinue = (appointmentDetails) => {
    // Move to phase 2
    setAppointmentData(appointmentData ? { ...appointmentData, schedule: appointmentDetails } : { schedule: appointmentDetails });
    setAppointmentPhase(2);
  };

  const handlePhase2Continue = (phase2Details) => {
    // Move to phase 3
    setAppointmentData(appointmentData ? { ...appointmentData, services: phase2Details } : { services: phase2Details });
    setAppointmentPhase(3);
  };

  const handlePhase3Continue = (phase3Details) => {
    // Safety check - if no stylist selected, return
    if (!phase3Details || !phase3Details.stylist) {
      setShowToast(true);
      setToastMessage("Please select a stylist to continue");
      return;
    }
    
    // Move to phase 4 (confirmation)
    const updatedData = appointmentData ? { ...appointmentData, stylist: phase3Details.stylist } : { stylist: phase3Details.stylist };
    setAppointmentData(updatedData);
    setAppointmentPhase(4);
  };

  const handleAppointmentBackPhase3 = (phase3Details) => {
    // Preserve the stylist selection from phase 3
    const updatedData = appointmentData ? { ...appointmentData, stylist: phase3Details?.stylist } : { stylist: phase3Details?.stylist };
    setAppointmentData(updatedData);
    // Go back to phase 2 with preserved service selection
    setAppointmentPhase(2);
  };

  const handleAppointmentBackPhase2 = () => {
    setAppointmentPhase(1);
  };

  const handleAppointmentBackPhase4 = () => {
    setAppointmentPhase(3);
  };

  const handlePhase4Confirm = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      // Collect appointment data from the form and appointment phases
      const scheduleInfo = appointmentData?.schedule;
      const servicesData = appointmentData?.services;
      const stylistData = appointmentData?.stylist;

      // Convert date format from "Apr 7" to "YYYY-MM-DD"
      let appointmentDate = "N/A";
      if (scheduleInfo?.date?.date) {
        const dateStr = scheduleInfo.date.date; // e.g., "Apr 7"
        const today = new Date();
        const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const parts = dateStr.split(" ");
        const monthName = parts[0];
        const day = parseInt(parts[1]);
        
        // Find matching month and year
        let appointDate = new Date(today);
        const monthIndex = monthLabels.indexOf(monthName);
        
        if (monthIndex !== -1) {
          // Find the next occurrence of this month/day
          appointDate.setMonth(monthIndex);
          appointDate.setDate(day);
          
          // If the date is in the past this year, assume next year (unlikely for an appointment booking)
          if (appointDate < today) {
            appointDate.setFullYear(today.getFullYear() + 1);
          }
          
          // Format as YYYY-MM-DD
          appointmentDate = appointDate.toISOString().split('T')[0];
        }
      }

      const appointmentTime = scheduleInfo?.time || "N/A";

      // Convert time format from "09:00 AM" to "09:00:00" (HH:MM:SS)
      let formattedTime = "N/A";
      if (appointmentTime && appointmentTime !== "N/A") {
        if (appointmentTime.includes(":")) {
          const timeParts = appointmentTime.split(" ");
          const timeValue = timeParts[0]; // e.g., "09:00"
          
          if (timeValue.includes(":")) {
            // Add seconds if not present, e.g., "09:00" becomes "09:00:00"
            const timeSplit = timeValue.split(":");
            if (timeSplit.length === 2) {
              formattedTime = `${timeSplit[0]}:${timeSplit[1]}:00`;
            } else if (timeSplit.length === 3) {
              formattedTime = timeValue;
            }
          }
        }
      }

      console.log('Formatted Date:', appointmentDate);
      console.log('Formatted Time:', formattedTime);

      // Get all selected services and join them
      let allServices = [];
      if (servicesData) {
        const selectedArrays = [
          servicesData.selectedHairServices,
          servicesData.selectedNailServices,
          servicesData.selectedSkincareServices,
          servicesData.selectedMassageServices,
          servicesData.selectedPremiumServices
        ];

        selectedArrays.forEach(arr => {
          if (Array.isArray(arr) && arr.length > 0) {
            allServices = allServices.concat(arr.map(s => s.title || s.name || s.service));
          }
        });
      }

      const servicesList = allServices.length > 0 ? allServices.join(", ") : "General Service";
      const stylistName = stylistData?.name || "Any Available Stylist";

      // Get user info
      const userName = fullName || verifiedUser?.full_name || "";
      const userEmail = email || verifiedUser?.email || "";
      const userPhone = phone || verifiedUser?.phone || "";

      // Prepare appointment data for POST
      const appointmentPayload = {
        name: userName,
        email: userEmail,
        phone: userPhone,
        date: appointmentDate,
        time: formattedTime,
        service: servicesList,
        staff_assigned: stylistName
      };

      console.log('Sending appointment to backend:', appointmentPayload);

      // POST appointment to backend
      const response = await fetch(`${apiUrl}/appointments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentPayload)
      });

      const data = await response.json();

      if (data.success || response.ok) {
        console.log('✅ Appointment created successfully:', data.appointment);

        // If verified user, close modal and show success
        if (verifiedUser !== null && verifiedUser !== undefined) {
          setShowAppointment(false);
          setBackdropClickEnabled(false);
          setAppointmentPhase(1);

          // Clear session after successful booking
          setTimeout(() => {
            sessionStorage.removeItem("verifiedUser");
            sessionStorage.removeItem("sessionUsed");
            localStorage.removeItem("verifiedUserBackup");
          }, 2500);

          setToastMessage("✅ Appointment booked successfully! Your email link has been used.");
          setShowToast(true);
          setTimeout(() => { setShowToast(false); }, 3000);
          return;
        }

        // NON-VERIFIED USER PATH
        setShowAppointment(false);
        setBackdropClickEnabled(false);
        setAppointmentPhase(1);
        setFullName("");
        setEmail("");
        setPhone("");
        setUseEmail(true);
        setUsePhone(false);
        setToastMessage("✅ Appointment booked successfully!");
        setShowToast(true);
        setTimeout(() => {
          if (verifiedUser === null || verifiedUser === undefined) {
            sessionStorage.removeItem("verifiedUser");
            localStorage.removeItem("verifiedUserBackup");
            navigateWithGuard("/");
          }
        }, 2000);
      } else {
        console.error('❌ Failed to create appointment:', data);
        setToastMessage(data.error || "Failed to book appointment. Please try again.");
        setShowToast(true);
      }
    } catch (error) {
      console.error('❌ Error booking appointment:', error);
      setToastMessage(`Error: ${error.message || 'Unable to book appointment'}`);
      setShowToast(true);
    }
  };

  const handleBackdropClick = (e) => {
    // Completely disable backdrop clicks for verified users
    if (verifiedUser && Object.keys(verifiedUser).length > 0) {
      return; // Ignore all backdrop clicks for verified users
    }
    
    // Only allow backdrop clicks for non-verified users if enabled
    if (e.target === e.currentTarget && backdropClickEnabled) {
      setShowBackdropConfirm(true);
    }
  };

  // Format booking data for phase 4
  const getFormattedBooking = () => {
    try {
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
      
      // Use verified user data if form fields are empty (after OTP verification)
      const userName = fullName || verifiedUser?.full_name || "";
      const userEmail = email || verifiedUser?.email || "";
      const userPhone = phone || verifiedUser?.phone || "";
      
      // Return object with services array and common booking details
      return {
        services: formattedServices,
        dateTime: dateTime,
        name: userName,
        email: userEmail,
        phone: userPhone,
        stylist: stylistName,
        refNo: "18xxx-xxxx",
      };
    } catch (error) {
      // Fallback if something goes wrong
      const userName = fullName || verifiedUser?.full_name || "";
      const userEmail = email || verifiedUser?.email || "";
      const userPhone = phone || verifiedUser?.phone || "";
      
      return {
        services: [],
        dateTime: "Not Selected",
        name: userName,
        email: userEmail,
        phone: userPhone,
        stylist: "Any Available Stylist",
        refNo: "18xxx-xxxx",
      };
    }
  };

  return (
    <div className="register-container">

      {/* ── LEFT PANEL ── */}
      <div className="register-left">

        {/* Session Expired Modal */}
        {sessionExpired && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0,0,0,0.72)"
          }}>
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "40px",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
            }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px", color: "#1a1208" }}>
                Booking Link Expired
              </h2>
              <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", lineHeight: "1.6" }}>
                The appointment link has already been used or cancelled.
              </p>
              <p style={{ fontSize: "13px", color: "#999", marginBottom: "24px" }}>
                To book another appointment, please register again to receive a new link.
              </p>
              <button
                onClick={() => setSessionExpired(false)}
                style={{
                  background: "#dd901d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                OK, Take Me Back
              </button>
            </div>
          </div>
        )}

        {/* Content wrapper */}
        <div className="form-wrapper" style={{ pointerEvents: (verifiedUser && showAppointment) || sessionExpired ? "none" : "auto", opacity: (verifiedUser && showAppointment) || sessionExpired ? 0.5 : 1 }}>

        {/* Back button - hidden for verified users with active appointment */}
        {!verifiedUser && (
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
        )}

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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending verification email..." : "Confirm"}
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

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <Otp
          onVerified={handleOtpVerified}
          onClose={() => {
            setShowOtpModal(false);
            setPendingPhone("");
            setPendingEmail("");
            setPendingName("");
          }}
          selectedPhone={pendingPhone}
          selectedEmail={pendingEmail}
          name={pendingName}
          otpType={otpType}
        />
      )}

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