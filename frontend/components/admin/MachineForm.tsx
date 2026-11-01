"use client";

import { useEffect, useState } from "react";
import { WashingMachine } from "@/types/machine";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Waves, PlusCircle, Edit3 } from "lucide-react";

const machineSchema = z.object({
  machineNumber: z.string().trim().min(1, "Machine number is required"),
  location: z.string().trim().min(1, "Location is required")
});

type MachineFormData = z.infer<typeof machineSchema>;

interface MachineFormProps {
  machineToEdit: WashingMachine | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function MachineForm({
  machineToEdit,
  isOpen,
  onClose,
  onSuccess
}: MachineFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!machineToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      machineNumber: "",
      location: ""
    }
  });

  useEffect(() => {
    if (machineToEdit) {
      reset({
        machineNumber: machineToEdit.machineNumber,
        location: machineToEdit.location
      });
    } else {
      reset({
        machineNumber: "",
        location: ""
      });
    }
  }, [machineToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (values: MachineFormData) => {
    try {
      setIsSubmitting(true);
      if (isEditing && machineToEdit) {
        await api.machines.update(machineToEdit._id, values);
        toast.success(`Machine ${values.machineNumber} updated successfully`);
      } else {
        await api.machines.create(values);
        toast.success(`Machine ${values.machineNumber} created successfully`);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to save machine details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              {isEditing ? <Edit3 className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? "Edit Washing Machine" : "Add Washing Machine"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing ? "Modify washer configuration" : "Deploy a new unit to the hostel laundry grid"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Machine Identifier
            </label>
            <input
              type="text"
              placeholder="e.g. WM-01, Washer 04"
              {...register("machineNumber")}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                errors.machineNumber
                  ? "border-rose-300 bg-rose-50/30 focus:border-rose-500"
                  : "border-slate-200 bg-white focus:border-indigo-600"
              }`}
            />
            {errors.machineNumber && (
              <p className="mt-1 text-[11px] text-rose-600">
                {errors.machineNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hostel Location
            </label>
            <input
              type="text"
              placeholder="e.g. Block A, Ground Floor"
              {...register("location")}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 ${
                errors.location
                  ? "border-rose-300 bg-rose-50/30 focus:border-rose-500"
                  : "border-slate-200 bg-white focus:border-indigo-600"
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-[11px] text-rose-600">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              <Waves className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Machine"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

