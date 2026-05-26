import React from "react";

// --- Helper Data and Components ---
const mockFeedback = [
  {
    staffId: 1,
    name: "Antonio Marquez",
    rating: 4.5,
    reviewCount: 24
  },
  {
    staffId: 2,
    name: "Carlos Reyes",
    rating: 4.2,
    reviewCount: 18
  },
  {
    staffId: 3,
    name: "Daniel Smith",
    rating: 0,
    reviewCount: 0
  },
  {
    staffId: 4,
    name: "John Dela Cruz",
    rating: 3.8,
    reviewCount: 9
  },
  {
    staffId: 6,
    name: "Sample Stylist",
    rating: 4.8,
    reviewCount: 16
  },
  {
    staffId: 5,
    name: "Mike Santos",
    rating: 4.9,
    reviewCount: 31
  }
];

// Dummy StarRating fallback to prevent parse error
function StarRating({ rating, reviewCount }) {
  return <span>{rating} ★ ({reviewCount})</span>;
}

const StaffFeedbackPanel = ({ staff, loading }) => {
  // Map staff to feedback, fallback to 0 rating if not found
  const feedbackList = staff && staff.length > 0
    ? staff.map(s => {
        const found = mockFeedback.find(f => f.name === s.name);
        return {
          staffId: s.id || `staff-${s.name}`,
          name: s.name,
          rating: found ? found.rating : 0,
          reviewCount: found ? found.reviewCount : 0,
        };
      })
    : mockFeedback;

  const displayFeedbackList = feedbackList.some(f => f.rating > 0)
    ? feedbackList
    : [
        ...feedbackList,
        {
          staffId: "sample-feedback",
          name: "Sample Stylist",
          rating: 4.8,
          reviewCount: 16,
        },
      ];

  return (
    <div className="staff-feedback-panel staff-list-panel mt-6">
      <div className="staff-list-header flex items-center justify-between">
        <h2 className="staff-list-title">Staff Feedback</h2>
      </div>
      {/* Loading State */}
      {loading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading staff feedback...</div>
      ) : feedbackList.length === 0 ? (
        <div className="container-empty-state">No staff feedback available</div>
      ) : (
        <div className="staff-member-scroll-limited">
          {displayFeedbackList.map((f, i) => (
            <div key={f.staffId || i} className="staff-member-row flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="staff-member-avatar" style={{ marginRight: '12px' }}>{f.name?.charAt(0) || '?'}</div>
                <span className="staff-member-name">{f.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {f.rating > 0 ? (
                  <StarRating rating={f.rating} reviewCount={f.reviewCount} />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 text-sm">No ratings yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { mockFeedback, StaffFeedbackPanel };