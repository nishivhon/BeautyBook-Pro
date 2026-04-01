export default function CreateAccountModal({ 
  showModal, 
  onClose, 
  formData, 
  setFormData, 
  handleCreateAccount 
}) {
  if (!showModal) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif"
    }} onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(221, 144, 29, 0.2)"
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#f5f5f5",
            margin: 0
          }}>Create New Account</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#988f81",
              transition: "color 0.2s ease",
              fontSize: "24px",
              lineHeight: "1"
            }}
            onMouseOver={(e) => e.target.style.color = "#dd901d"}
            onMouseOut={(e) => e.target.style.color = "#988f81"}
          >
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          
          {/* Full Name */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jane Reyes"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>

          {/* Email Address */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jane@example.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>

          {/* Role */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
                cursor: "pointer"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            >
              <option value="">Select a role</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
              <option value="Super Administrator">Super Administrator</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 8 characters"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#dd901d",
              marginBottom: "8px"
            }}>Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "rgba(26, 15, 0, 0.5)",
                border: "1px solid rgba(221, 144, 29, 0.3)",
                borderRadius: "8px",
                color: "#f5f5f5",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              border: "1px solid rgba(221, 144, 29, 0.4)",
              color: "#dd901d",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "rgba(221, 144, 29, 0.1)";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.6)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(221, 144, 29, 0.4)";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateAccount}
            style={{
              padding: "12px 24px",
              backgroundColor: "#dd901d",
              color: "#1a1a1a",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#e6a326"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#dd901d"}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
