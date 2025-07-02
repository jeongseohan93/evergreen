// src/features/admin/components/order/TrackingModal.jsx

import React from 'react';

const TrackingModal = ({ showTrackingModal, trackingInfo, setShowTrackingModal }) => {
    if (!showTrackingModal) return null;

    return (
        <div className="modal-overlay" onClick={() => setShowTrackingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>택배 추적 정보</h3>
                    <button 
                        onClick={() => setShowTrackingModal(false)}
                        className="modal-close"
                    >
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    {trackingInfo ? (
                        <div className="tracking-info">
                            <div className="tracking-header">
                                <p><strong>운송장 번호:</strong> {trackingInfo.tracking_number}</p>
                                <p><strong>택배사:</strong> {trackingInfo.carrier}</p>
                                <p><strong>상태:</strong> {trackingInfo.status}</p>
                            </div>
                            {trackingInfo.events && trackingInfo.events.length > 0 ? (
                                <div className="tracking-events">
                                    <h4>배송 이력</h4>
                                    {trackingInfo.events.map((event, index) => (
                                        <div key={index} className="tracking-event">
                                            <div className="event-time">
                                                {new Date(event.time).toLocaleString()}
                                            </div>
                                            <div className="event-location">
                                                {event.location}
                                            </div>
                                            <div className="event-status">
                                                {event.status}
                                            </div>
                                            {event.description && (
                                                <div className="event-description">
                                                    {event.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>배송 이력이 없습니다.</p>
                            )}
                        </div>
                    ) : (
                        <p>추적 정보를 불러올 수 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackingModal;