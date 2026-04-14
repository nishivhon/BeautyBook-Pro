import { useState } from "react";

// Icons
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M15 19l-8-7 8-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 12l5 5 11-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// Sample client request data
const sampleClientRequests = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    phoneNumber: "+63 912 345 6789",
    services: [
      { category: "styling", name: "Hair Color & Style" },
      { category: "skincare", name: "Deep Cleanse Facial" },
    ],
    requestedDate: "2026-04-16",
    requestedTime: "2:00 PM",
    status: "pending",
    duration: "150 mins",
    estimatedPrice: "₱1100",
  },
  {
    id: 2,
    clientName: "Maria Santos",
    phoneNumber: "+63 908 234 5678",
    services: [
      { category: "skincare", name: "Deep Cleanse Facial" },
      { category: "skincare", name: "Brightening Treatment" },
      { category: "massage", name: "Full Body Relaxation Massage" },
    ],
    requestedDate: "2026-04-17",
    requestedTime: "10:30 AM",
    status: "pending",
    duration: "225 mins",
    estimatedPrice: "₱2100",
  },
  {
    id: 3,
    clientName: "Jessica Cruz",
    phoneNumber: "+63 918 567 8901",
    serviceCategory: "nails",
    serviceName: "Classic Manicure",
    requestedDate: "2026-04-18",
    requestedTime: "3:00 PM",
    status: "confirmed",
    duration: "45 mins",
    estimatedPrice: "₱200",
  },
  {
    id: 4,
    clientName: "Angela Reyes",
    phoneNumber: "+63 919 678 9012",
    services: [
      { category: "nails", name: "Gel Pedicure" },
      { category: "nails", name: "Classic Manicure" },
    ],
    requestedDate: "2026-04-20",
    requestedTime: "11:00 AM",
    status: "pending",
    duration: "105 mins",
    estimatedPrice: "₱520",
  },
  {
    id: 5,
    clientName: "Emily Rodriguez",
    phoneNumber: "+63 910 234 5678",
    services: [
      { category: "haircut", name: "Premium Haircut & Beard" },
      { category: "styling", name: "Beard Grooming" },
    ],
    requestedDate: "2026-04-16",
    requestedTime: "10:00 AM",
    status: "pending",
    duration: "90 mins",
    estimatedPrice: "₱330",
  },
  {
    id: 6,
    clientName: "Michael Chen",
    phoneNumber: "+63 921 987 6543",
    services: [
      { category: "massage", name: "Full Body Relaxation Massage" },
      { category: "styling", name: "Beard Grooming" },
    ],
    requestedDate: "2026-04-19",
    requestedTime: "4:30 PM",
    status: "pending",
    duration: "120 mins",
    estimatedPrice: "₱830",
  },
  {
    id: 7,
    clientName: "Amanda Torres",
    phoneNumber: "+63 917 456 8901",
    serviceCategory: "skincare",
    serviceName: "Brightening Treatment",
    requestedDate: "2026-04-21",
    requestedTime: "1:00 PM",
    status: "confirmed",
    duration: "75 mins",
    estimatedPrice: "₱750",
  },
  {
    id: 8,
    clientName: "David Kim",
    phoneNumber: "+63 926 789 0123",
    services: [
      { category: "haircut", name: "Premium Haircut & Beard" },
      { category: "styling", name: "Beard Grooming" },
      { category: "skincare", name: "Deep Cleanse Facial" },
    ],
    requestedDate: "2026-04-17",
    requestedTime: "5:00 PM",
    status: "pending",
    duration: "165 mins",
    estimatedPrice: "₱880",
  },
];

// Category label mapping
const categoryLabels = {
  haircut: "Hair Service",
  styling: "Hair Service",
  nails: "Nail Service",
  skincare: "Skin Care Service",
  massage: "Massage Service",
};

// Status badge component
function StatusBadge({ status }) {
  const statusStyles = {
    pending: {
      bgColor: "rgba(218, 165, 32, 0.15)",
      textColor: "#d4a500",
      label: "Pending",
    },
    confirmed: {
      bgColor: "rgba(46, 204, 113, 0.15)",
      textColor: "#2ecc71",
      label: "Confirmed",
    },
    completed: {
      bgColor: "rgba(52, 152, 219, 0.15)",
      textColor: "#3498db",
      label: "Completed",
    },
  };

  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: style.bgColor,
        color: style.textColor,
        padding: "4px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
      }}
    >
      {style.label}
    </span>
  );
}

// Client request item (list view)
function ClientRequestItem({ request, onSelect, isSelected }) {
  // Check if this is a multi-service request
  const isMultiService = Array.isArray(request.services);
  const displayCategory = isMultiService ? "Multiple Services" : request.serviceCategory;
  const displayService = isMultiService 
    ? `${request.services.length} services selected` 
    : request.serviceName;

  return (
    <div
      onClick={() => onSelect(request)}
      style={{
        padding: "16px",
        borderBottom: "1px solid rgba(152, 143, 129, 0.2)",
        cursor: "pointer",
        backgroundColor: isSelected ? "rgba(35, 29, 26, 0.4)" : "transparent",
        transition: "background-color 0.2s ease",
        borderLeft: isSelected ? "3px solid #d4a500" : "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(35, 29, 26, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isSelected ? "rgba(35, 29, 26, 0.4)" : "transparent";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
        <div>
          <h4 style={{ margin: "0 0 4px 0", color: "#f5e6d3", fontSize: "15px", fontWeight: "600" }}>
            {request.clientName}
          </h4>
          <p style={{ margin: "0 0 4px 0", color: "#a5957d", fontSize: "12px", textTransform: "capitalize" }}>
            {displayCategory}
          </p>
          <p style={{ margin: "0", color: "#a5957d", fontSize: "13px" }}>
            {displayService}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px", color: "#a5957d" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CalendarIcon />
          {request.requestedDate}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ClockIcon />
          {request.requestedTime}
        </div>
      </div>
    </div>
  );
}

// Client request details (detail view)
function ClientRequestDetails({ request, onBack }) {
  return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid rgba(152, 143, 129, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "rgba(35, 29, 26, 0.5)",
            border: "1px solid rgba(152, 143, 129, 0.2)",
            color: "#f5e6d3",
            padding: "8px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BackIcon />
        </button>
        <div>
          <h3 style={{ margin: "0", color: "#f5e6d3", fontSize: "16px", fontWeight: "600" }}>
            {request.clientName}
          </h3>
          <p style={{ margin: "0", color: "#a5957d", fontSize: "12px" }}>
            Service Request Details
          </p>
        </div>
      </div>

      {/* Details content */}
      <div style={{ padding: "20px", color: "#f5e6d3" }}>
        {/* Status badge */}
        <div style={{ marginBottom: "20px" }}>
          <StatusBadge status={request.status} />
        </div>

        {/* Client info */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "#d4a500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Client Information
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#a5957d" }}>
              <div style={{ width: "24px", height: "24px", backgroundColor: "rgba(152, 143, 129, 0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <UserIcon />
              </div>
              <span>{request.clientName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#a5957d" }}>
              <div style={{ width: "24px", height: "24px", backgroundColor: "rgba(152, 143, 129, 0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PhoneIcon />
              </div>
              <span>{request.phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Service info */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "#d4a500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Service Details
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            {Array.isArray(request.services) ? (
              // Multi-service request
              <>
                {request.services.map((svc, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ color: "#a5957d" }}>Category {idx + 1}:</span>
                      <span style={{ fontWeight: "600" }}>{categoryLabels[svc.category] || svc.category}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: idx !== request.services.length - 1 ? "12px" : "0" }}>
                      <span style={{ color: "#a5957d" }}>Service {idx + 1}:</span>
                      <span style={{ fontWeight: "600" }}>{svc.name}</span>
                    </div>
                    {idx !== request.services.length - 1 && (
                      <div style={{ height: "1px", background: "rgba(152, 143, 129, 0.2)", margin: "12px 0" }} />
                    )}
                  </div>
                ))}
                <div style={{ height: "1px", background: "rgba(152, 143, 129, 0.2)", margin: "12px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a5957d" }}>Total Duration:</span>
                  <span style={{ fontWeight: "600" }}>{request.duration}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a5957d" }}>Total Price:</span>
                  <span style={{ fontWeight: "600", color: "#d4a500" }}>{request.estimatedPrice}</span>
                </div>
              </>
            ) : (
              // Single service request
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a5957d" }}>Category:</span>
                  <span style={{ fontWeight: "600" }}>{categoryLabels[request.serviceCategory] || request.serviceCategory}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a5957d" }}>Service:</span>
                  <span style={{ fontWeight: "600" }}>{request.serviceName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a5957d" }}>Duration:</span>
                  <span style={{ fontWeight: "600" }}>{request.duration}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a5957d" }}>Estimated Price:</span>
                  <span style={{ fontWeight: "600", color: "#d4a500" }}>{request.estimatedPrice}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Schedule info */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", color: "#d4a500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Requested Schedule
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#a5957d" }}>
              <CalendarIcon />
              <span>{request.requestedDate}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#a5957d" }}>
              <ClockIcon />
              <span>{request.requestedTime}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          {request.status === "pending" && (
            <>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <CheckmarkIcon />
                Confirm Booking
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "rgba(152, 143, 129, 0.2)",
                  color: "#f5e6d3",
                  border: "1px solid rgba(152, 143, 129, 0.3)",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Decline
              </button>
            </>
          )}
          {request.status === "confirmed" && (
            <button
              style={{
                flex: 1,
                padding: "12px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main modal component
export default function ClientRequestsModal({ isOpen, onClose }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [clientRequests] = useState(sampleClientRequests);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "1000",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#2a251f",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
          border: "1px solid rgba(152, 143, 129, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(152, 143, 129, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: "0", color: "#f5e6d3", fontSize: "18px", fontWeight: "600" }}>
            Client Requests
            <span style={{ color: "#a5957d", marginLeft: "8px", fontSize: "14px", fontWeight: "400" }}>
              ({clientRequests.length} pending)
            </span>
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(35, 29, 26, 0.5)",
              border: "1px solid rgba(152, 143, 129, 0.2)",
              color: "#f5e6d3",
              padding: "8px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: "1", display: "flex", overflow: "hidden" }}>
          {selectedRequest === null ? (
            // List view
            <div style={{ flex: "1", overflowY: "auto", width: "100%" }}>
              {clientRequests.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#a5957d",
                    fontSize: "14px",
                  }}
                >
                  No client requests at this time
                </div>
              ) : (
                clientRequests.map((request) => (
                  <ClientRequestItem
                    key={request.id}
                    request={request}
                    onSelect={() => setSelectedRequest(request)}
                    isSelected={selectedRequest?.id === request.id}
                  />
                ))
              )}
            </div>
          ) : (
            // Detail view
            <div style={{ flex: "1", overflowY: "auto", width: "100%" }}>
              <ClientRequestDetails
                request={selectedRequest}
                onBack={() => setSelectedRequest(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
