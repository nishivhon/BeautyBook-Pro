import React, { useEffect, useMemo, useState } from "react";

// Dummy StarRating fallback to prevent parse error
function StarRating({ rating, reviewCount }) {
  return <span>{Number(rating || 0).toFixed(2)} ★ ({reviewCount})</span>;
}

const getStaffKey = (name) => String(name || "").trim().toLowerCase();

const StaffFeedbackPanel = ({ staff, loading }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchFeedback = async () => {
      setFeedbackLoading(true);
      setFeedbackError("");

      try {
        const response = await fetch('/api/staffs/read/feedback');
        if (!response.ok) {
          throw new Error(`Failed to fetch staff feedback: ${response.status}`);
        }

        const result = await response.json();
        if (!active) return;

        setFeedbackData(Array.isArray(result?.feedback) ? result.feedback : []);
      } catch (error) {
        if (!active) return;
        setFeedbackData([]);
        setFeedbackError(error.message || 'Failed to fetch staff feedback');
      } finally {
        if (active) setFeedbackLoading(false);
      }
    };

    fetchFeedback();

    return () => {
      active = false;
    };
  }, []);

  const feedbackMap = useMemo(() => {
    const map = new Map();
    for (const entry of feedbackData) {
      const key = getStaffKey(entry?.staff);
      if (key) map.set(key, entry);
    }
    return map;
  }, [feedbackData]);

  const feedbackList = useMemo(() => {
    const mappedStaff = Array.isArray(staff) ? staff : [];
    const merged = mappedStaff.map((member, index) => {
      const staffName = String(member?.name || member?.names || '').trim() || 'Unknown';
      const matched = feedbackMap.get(getStaffKey(staffName));

      return {
        staffId: member?.id || `staff-${index}-${staffName}`,
        name: staffName,
        rating: Number(matched?.averageRating || 0),
        reviewCount: Number(matched?.reviewCount || 0),
      };
    });

    const knownNames = new Set(merged.map((entry) => getStaffKey(entry.name)));
    const extras = feedbackData
      .filter((entry) => !knownNames.has(getStaffKey(entry?.staff)))
      .map((entry, index) => ({
        staffId: `history-staff-${index}-${entry.staff}`,
        name: entry.staff,
        rating: Number(entry.averageRating || 0),
        reviewCount: Number(entry.reviewCount || 0),
      }));

    return [...merged, ...extras].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
      return a.name.localeCompare(b.name);
    });
  }, [staff, feedbackMap, feedbackData]);

  const isLoading = loading || feedbackLoading;

  return (
    <div className="staff-feedback-panel staff-list-panel mt-6">
      <div className="staff-list-header flex items-center justify-between">
        <h2 className="staff-list-title">Staff Feedback</h2>
      </div>
      {/* Loading State */}
      {isLoading ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">Loading staff feedback...</div>
      ) : feedbackList.length === 0 ? (
        <div className="container-empty-state">No staff feedback available</div>
      ) : (
        <div className="staff-member-scroll-limited">
          {feedbackList.map((f, i) => (
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
      {!isLoading && feedbackError ? (
        <div className="mt-2 text-xs text-amber-500">{feedbackError}</div>
      ) : null}
    </div>
  );
};

export { StaffFeedbackPanel };