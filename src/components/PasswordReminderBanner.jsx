import { useState } from 'react';
import { isPasswordReminderNeeded, getDaysSincePasswordChange } from '../services/operatorAuth';

const PasswordReminderBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const showReminder = isPasswordReminderNeeded() && !dismissed;
  const daysSince = getDaysSincePasswordChange();

  if (!showReminder || !daysSince) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#422d1a',
      borderLeft: '4px solid #ff9800',
      padding: '12px 16px',
      marginBottom: '20px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1
      }}>
        <span style={{
          fontSize: '18px',
          color: '#ff9800'
        }}>⚠️</span>
        <div style={{
          flex: 1
        }}>
          <p style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#ffd700'
          }}>Password Update Recommended</p>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#b8a599'
          }}>You haven't changed your password in {daysSince} days. For security, please update your password regularly.</p>
        </div>
      </div>
      <div style={{
        display: 'flex',
        gap: '8px',
        flexShrink: 0
      }}>
        <button style={{
          padding: '6px 12px',
          backgroundColor: 'rgba(255, 152, 0, 0.15)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '4px',
          color: '#ff9800',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }} onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 152, 0, 0.25)';
        }} onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 152, 0, 0.15)';
        }}>
          Change Password
        </button>
        <button onClick={() => setDismissed(true)} style={{
          padding: '6px 12px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '4px',
          color: '#988f81',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }} onMouseEnter={(e) => {
          e.target.style.color = '#dd901d';
        }} onMouseLeave={(e) => {
          e.target.style.color = '#988f81';
        }}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default PasswordReminderBanner;
