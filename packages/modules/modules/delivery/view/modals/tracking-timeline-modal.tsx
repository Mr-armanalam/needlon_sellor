'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, Clock, Truck, ExternalLink } from 'lucide-react';
import { apiFetch } from '@/modules/auth/lib/auth-client';
import { ShipmentResponseDto } from '../../dto/delivery.dto';

interface TrackingTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment?: ShipmentResponseDto;
}

interface TrackingEventItem {
  id: string;
  trackingStatus: string;
  eventCode: string | null;
  eventDescription: string;
  locationName: string | null;
  city: string | null;
  state: string | null;
  occurredAt: string;
}

interface TrackingPayload {
  shipment: {
    id: string;
    status: string;
    awbNumber: string | null;
    trackingNumber: string | null;
    partnerName: string;
    trackingUrl: string | null;
  };
  events: TrackingEventItem[];
}

interface TrackingApiResponse {
  success: boolean;
  data?: TrackingPayload;
  error?: { message?: string };
}

function formatEventTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function TrackingTimelineModal({ isOpen, onClose, shipment }: TrackingTimelineModalProps) {
  const [tracking, setTracking] = useState<TrackingPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipmentId = shipment?.id;

  useEffect(() => {
    if (!isOpen || !shipmentId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setTracking(null);

    (async () => {
      try {
        const res = await apiFetch(`/api/seller/delivery/shipments/${shipmentId}/tracking`);
        const json = (await res.json()) as TrackingApiResponse;
        if (cancelled) return;
        if (json.success && json.data) {
          setTracking(json.data);
        } else {
          setError(json.error?.message || 'Failed to load tracking events');
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error && err.message ? err.message : 'Failed to load tracking events');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, shipmentId]);

  if (!isOpen) return null;

  const awb = tracking?.shipment.awbNumber || tracking?.shipment.trackingNumber || shipment?.awbNumber || shipment?.trackingNumber || '—';
  const partner = tracking?.shipment.partnerName || shipment?.partnerName || '';
  const statusLabel = tracking?.shipment.status ? formatStatusLabel(tracking.shipment.status) : '';
  const events = tracking?.events ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-5 relative">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Package Tracking</h3>
              <p className="text-[11px] text-gray-400">AWB: {awb}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Courier Partner</span>
            <span className="text-xs font-bold text-gray-800">{partner}</span>
          </div>
          {statusLabel && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {statusLabel}
            </span>
          )}
        </div>

        {tracking?.shipment.trackingUrl && (
          <a
            href={tracking.shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
          >
            Track on carrier site <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {/* Timeline Event Log — real shipment_tracking_events, oldest first */}
        {loading ? (
          <div className="py-8 text-center text-xs text-gray-400">Loading tracking events...</div>
        ) : error ? (
          <div className="py-8 px-4 text-center text-xs font-semibold text-red-500">{error}</div>
        ) : events.length === 0 ? (
          <div className="py-8 px-4 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-600">No tracking events yet</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Events appear here as the shipment is labelled, picked up and delivered.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pl-2 py-1">
            {events.map((event, idx) => {
              const isLatest = idx === events.length - 1;
              const location = [event.locationName, event.city, event.state]
                .filter((part) => Boolean(part))
                .join(', ');
              return (
                <div key={event.id} className="flex items-start gap-3 relative">
                  {idx !== events.length - 1 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-emerald-500" />
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                      isLatest ? 'bg-blue-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isLatest ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs font-bold ${isLatest ? 'text-blue-600' : 'text-gray-900'}`}>
                      {event.eventDescription}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatEventTime(event.occurredAt)}
                      {location ? ` • ${location}` : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Close Tracking Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
