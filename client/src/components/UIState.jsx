import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export const LoadingState = ({ message = 'Loading...', fullHeight = false }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullHeight ? '50vh' : '200px',
        width: '100%',
        gap: 'var(--spacing-4)',
        padding: 'var(--spacing-8)'
    }}>
        <Loader2 className="animate-spin text-[#eb5e28]" size={48} />
        {message && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)' }}>
                {message}
            </p>
        )}
    </div>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry, fullHeight = false }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullHeight ? '50vh' : '200px',
        width: '100%',
        padding: 'var(--spacing-6)'
    }}>
        <div className="glass" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'var(--spacing-8)',
            maxWidth: '500px',
            width: '100%',
            gap: 'var(--spacing-4)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
        }}>
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-error)'
            }}>
                <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text)', margin: 0 }}>
                Oops! An error occurred
            </h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="button-primary"
                    style={{ marginTop: 'var(--spacing-2)' }}
                >
                    <RefreshCw size={18} />
                    Try Again
                </button>
            )}
        </div>
    </div>
);

export const EmptyState = ({
    title = 'No Data Found',
    message = 'There is currently no data to display.',
    icon: Icon = Inbox,
    actionLabel,
    onAction,
    fullHeight = false
}) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullHeight ? '50vh' : '200px',
        width: '100%',
        padding: 'var(--spacing-6)'
    }}>
        <div className="glass" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'var(--spacing-10)',
            maxWidth: '600px',
            width: '100%',
            gap: 'var(--spacing-4)'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(235, 94, 40, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
            }}>
                <Icon size={40} />
            </div>
            <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text)', margin: 0 }}>
                {title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
                {message}
            </p>
            {onAction && actionLabel && (
                <button
                    onClick={onAction}
                    className="button-primary"
                    style={{ marginTop: 'var(--spacing-4)' }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    </div>
);
