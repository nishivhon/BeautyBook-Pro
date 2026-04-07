const ServiceDetailsModal = ({ isOpen, customer, onClose }) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="service-details-overlay" onClick={onClose}>
      <div className="service-details-modal" onClick={(e) => e.stopPropagation()}>
        <header className="service-details-header">
          <div style={{ visibility: "hidden", width: "20px" }}></div>
          <h1 className="service-details-title">{customer.name}</h1>
          <button 
            className="service-details-close-btn" 
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="service-details-body">
          <h2 className="service-details-section-title">Service Details</h2>
          
          <div className="service-details-detail-row">
            <span className="service-details-label">Service Selected</span>
            <span className="service-details-value">{customer.details.serviceSelected}</span>
          </div>

          <div className="service-details-detail-row">
            <span className="service-details-label">Current Service</span>
            <span className="service-details-value">{customer.details.currentService}</span>
          </div>

          <div className="service-details-detail-row">
            <span className="service-details-label">Starting Time</span>
            <span className="service-details-value">{customer.details.startTime}</span>
          </div>

          <div className="service-details-detail-row">
            <span className="service-details-label">Estimated Time</span>
            <span className="service-details-value">{customer.details.estimatedTime}</span>
          </div>
        </div>

        <div className="service-details-footer">
          <button 
            className="service-details-close-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
