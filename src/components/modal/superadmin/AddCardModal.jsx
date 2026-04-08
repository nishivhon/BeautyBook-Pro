import { PlusIcon } from "../../../icons/PlusIcon";
import { ScissorsIcon, NailIcon, SkinIcon, MassageIcon, StarIcon } from "../../../icons";

export default function AddCardModal({
  isOpen,
  onClose,
  cardConfig,
  setCardConfig,
  onAddCard,
  howitworksSteps,
  servicesData,
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    }}>
      <div style={{
        background: "#1a1a1a",
        borderRadius: "12px",
        padding: "32px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        border: "1.5px solid #dd901d",
        maxWidth: "450px",
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
      }}>
        <h2 style={{ color: "white", marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>Add Card</h2>
        
        <div style={{ marginBottom: "40px" }}>
          <label style={{ color: "#dd901d", display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Select Section</label>
          <select
            value={cardConfig.section}
            onChange={(e) => setCardConfig({ ...cardConfig, section: e.target.value, items: [] })}
            style={{
              width: "100%",
              padding: "10px",
              background: "#2a2a2a",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="howitworks">How It Works Section</option>
            <option value="services">Services Section</option>
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#dd901d", display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Card Title</label>
          <input
            type="text"
            value={cardConfig.title}
            onChange={(e) => setCardConfig({ ...cardConfig, title: e.target.value })}
            placeholder="Enter card title"
            style={{
              width: "100%",
              padding: "10px",
              background: "#2a2a2a",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {cardConfig.section === "howitworks" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#dd901d", display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Description</label>
            <textarea
              value={cardConfig.description}
              onChange={(e) => setCardConfig({ ...cardConfig, description: e.target.value })}
              placeholder="Enter card description"
              style={{
                width: "100%",
                padding: "10px",
                background: "#2a2a2a",
                border: "1.5px solid #dd901d",
                borderRadius: "6px",
                color: "white",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                minHeight: "80px",
                fontFamily: "inherit",
              }}
            />
          </div>
        )}

        {cardConfig.section === "services" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#dd901d", display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Service Items</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cardConfig.items && cardConfig.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...cardConfig.items];
                      newItems[idx] = e.target.value;
                      setCardConfig({ ...cardConfig, items: newItems });
                    }}
                    placeholder={`Item ${idx + 1}`}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: "#2a2a2a",
                      border: "1px solid #555",
                      borderRadius: "4px",
                      color: "white",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={() => {
                      const newItems = cardConfig.items.filter((_, i) => i !== idx);
                      setCardConfig({ ...cardConfig, items: newItems });
                    }}
                    style={{
                      padding: "6px 12px",
                      background: "#c97c1c",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "12px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#a85c0f"}
                    onMouseLeave={(e) => e.target.style.background = "#c97c1c"}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {cardConfig.items.length < 4 && (
                <button
                  onClick={() => setCardConfig({ ...cardConfig, items: [...(cardConfig.items || []), ""] })}
                  style={{
                    padding: "8px",
                    background: "transparent",
                    border: "1.5px dashed #dd901d",
                    borderRadius: "4px",
                    color: "#dd901d",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(221, 144, 29, 0.1)"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                >
                  + Add Item
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={onAddCard}
            style={{
              flex: 1,
              padding: "12px",
              background: "#dd901d",
              border: "none",
              borderRadius: "6px",
              color: "#1a1a1a",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.background = "#c97c1c"}
            onMouseLeave={(e) => e.target.style.background = "#dd901d"}
          >
            Add Card
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "transparent",
              border: "1.5px solid #dd901d",
              borderRadius: "6px",
              color: "#dd901d",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(221, 144, 29, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
