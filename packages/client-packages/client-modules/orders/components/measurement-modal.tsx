"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler, Scissors, AlertCircle, CheckCircle2, Send, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurement: any;
  orderId: string;
  orderNumber?: string;
}

export default function MeasurementModal({
  isOpen,
  onClose,
  measurement: initialMeasurement,
  orderId,
  orderNumber,
}: MeasurementModalProps) {
  const [measurement, setMeasurement] = useState<any>(initialMeasurement);
  const [isEditable, setIsEditable] = useState<boolean>(!!initialMeasurement?.isEditable);
  const [editRequested, setEditRequested] = useState<boolean>(!!initialMeasurement?.editRequested);
  const [editReason, setEditReason] = useState<string>("");
  const [isRequestingOpen, setIsRequestingOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form editable states for essential and posture measurements
  const [essentialValues, setEssentialValues] = useState<Record<string, any>>(
    initialMeasurement?.essentialMeasurements || {}
  );
  const [postureValues, setPostureValues] = useState<Record<string, any>>(
    initialMeasurement?.postureSpecifics || {}
  );
  const [fitPreference, setFitPreference] = useState<string>(
    initialMeasurement?.fitPreference || "REGULAR"
  );

  // Sync state if initialMeasurement updates
  React.useEffect(() => {
    if (initialMeasurement) {
      setMeasurement(initialMeasurement);
      setIsEditable(!!initialMeasurement.isEditable);
      setEditRequested(!!initialMeasurement.editRequested);
      setEssentialValues(initialMeasurement.essentialMeasurements || {});
      setPostureValues(initialMeasurement.postureSpecifics || {});
      setFitPreference(initialMeasurement.fitPreference || "REGULAR");
    }
  }, [initialMeasurement]);

  if (!measurement) return null;

  const unit = measurement.measurementUnit || "INCHES";
  const garmentType = (measurement.garmentType || "Garment").toUpperCase();
  const gender = (measurement.gender || "Bespoke").toUpperCase();

  const handleEssentialChange = (field: string, val: string) => {
    setEssentialValues((prev) => ({ ...prev, [field]: val }));
  };

  const handlePostureChange = (field: string, val: string) => {
    setPostureValues((prev) => ({ ...prev, [field]: val }));
  };

  // Submit Request for Edit to Seller
  const handleRequestEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/measurements/request-edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurementId: measurement.id,
          reason: editReason.trim() || "Customer requested measurement change",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setEditRequested(true);
      setIsRequestingOpen(false);
      toast.success("Measurement edit request sent to seller.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Submit Edited Measurements
  const handleSubmitUpdatedMeasurements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/measurements`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurementId: measurement.id,
          essentialMeasurements: essentialValues,
          postureSpecifics: postureValues,
          fitPreference,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save measurements");
      }

      setIsEditable(false);
      setEditRequested(false);
      toast.success("Updated measurements saved successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save measurements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
        <DialogHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Bespoke Tailoring Measurements
              </DialogTitle>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 uppercase">
                {garmentType} ({gender})
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
                {unit}
              </span>
            </div>
          </div>
          <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Submitted for Order #{orderNumber || orderId.slice(0, 8)} • Fit: {fitPreference}
          </DialogDescription>
        </DialogHeader>

        {/* State Banner */}
        <div className="my-3">
          {isEditable ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs">
              <Unlock className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-bold">Edit Mode Enabled by Seller</p>
                <p className="text-[11px] opacity-90">
                  You can now edit your measurements in the fields below and click "Save & Resubmit Measurements".
                </p>
              </div>
            </div>
          ) : editRequested ? (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-bold">Revision Requested from Boutique Atelier</p>
                <p className="text-[11px] opacity-90">
                  Your request is awaiting seller approval. Once the seller permits editing, these fields will be unlocked for revision.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-300 text-xs">
              <Lock className="w-4 h-4 shrink-0 text-neutral-400" />
              <p className="text-[11px]">
                Measurements are locked for production cutting. If you need to make corrections, request an edit below.
              </p>
            </div>
          )}
        </div>

        {/* Essential Measurements Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2.5">
              <Ruler className="w-3.5 h-3.5" /> Essential Measurements ({unit})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(essentialValues).map(([key, val]) => (
                <div
                  key={key}
                  className={`p-2.5 rounded-lg border transition-all ${
                    isEditable
                      ? "bg-white dark:bg-neutral-800 border-blue-200 dark:border-blue-700"
                      : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-100 dark:border-neutral-800"
                  }`}
                >
                  <label className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 capitalize block mb-1">
                    {key.replace(/_/g, " ")}
                  </label>
                  {isEditable ? (
                    <input
                      type="number"
                      step="0.25"
                      value={String(val || "")}
                      onChange={(e) => handleEssentialChange(key, e.target.value)}
                      className="w-full text-xs font-bold px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {String(val)} {unit === "CM" ? "cm" : "in"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Posture & Nuances Section if available */}
          {Object.keys(postureValues).length > 0 && (
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                Bespoke & Posture Specifics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(postureValues).map(([key, val]) => (
                  <div
                    key={key}
                    className={`p-2.5 rounded-lg border ${
                      isEditable
                        ? "bg-white dark:bg-neutral-800 border-blue-200 dark:border-blue-700"
                        : "bg-neutral-50 dark:bg-neutral-800/40 border-neutral-100 dark:border-neutral-800"
                    }`}
                  >
                    <label className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 capitalize block mb-1">
                      {key.replace(/_/g, " ")}
                    </label>
                    {isEditable ? (
                      <input
                        type="text"
                        value={String(val || "")}
                        onChange={(e) => handlePostureChange(key, e.target.value)}
                        className="w-full text-xs font-semibold px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gray-800 dark:text-neutral-200">
                        {String(val)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tailor Cutting Notes if available */}
          {measurement.tailorNotes && (
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 rounded-lg text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Tailor Master Notes: </span>
              {measurement.tailorNotes}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-3">
          {isEditable ? (
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={loading}
                onClick={handleSubmitUpdatedMeasurements}
                className="text-xs font-bold rounded-lg bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-neutral-900 cursor-pointer"
              >
                {loading ? "Saving..." : "Save & Resubmit Measurements"}
              </Button>
            </div>
          ) : !editRequested ? (
            <div>
              {isRequestingOpen ? (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-2.5">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    Request Measurement Edit from Seller
                  </p>
                  <textarea
                    rows={2}
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="Describe what needs to be changed (e.g. Chest circumference is 38 in instead of 40 in)..."
                    className="w-full text-xs p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRequestingOpen(false)}
                      className="text-xs rounded-lg cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={loading}
                      onClick={handleRequestEdit}
                      className="text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      {loading ? "Sending..." : "Send Request to Seller"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-neutral-400">
                    Need to modify measurements before cutting?
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRequestingOpen(true)}
                    className="text-xs font-semibold rounded-lg border-blue-200 hover:bg-blue-50 text-blue-700 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40 cursor-pointer"
                  >
                    Request Measurement Edit
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Edit request pending seller approval
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs rounded-lg cursor-pointer"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
