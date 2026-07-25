"use client";

import React, { useState, useEffect } from "react";
import { Save, X, Upload, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "textarea" | "select" | "rich-text" | "image" | "boolean";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  defaultValue?: any;
}

export interface CrudFormProps {
  title: string;
  subtitle?: string;
  fields: FieldConfig[];
  onSubmit: (formData: Record<string, any>, stayOnPage?: boolean) => void;
  onCancel?: () => void;
  backLink?: string;
  initialValues?: Record<string, any>;
}

export function CrudForm({
  title,
  subtitle,
  fields,
  onSubmit,
  onCancel,
  backLink,
  initialValues = {},
}: CrudFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      defaults[f.name] = initialValues[f.name] ?? f.defaultValue ?? "";
    });
    setFormData(defaults);
  }, [fields, initialValues]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && (!formData[f.name] || String(formData[f.name]).trim() === "")) {
        newErrors[f.name] = `${f.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, stayOnPage = false) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData, stayOnPage);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backLink && (
            <Link
              href={backLink}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {isDraftSaved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Draft auto-saved</span>
          </div>
        )}
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => {
              const error = errors[field.name];
              const isFullWidth = field.type === "textarea" || field.type === "image";

              return (
                <div key={field.name} className={`space-y-1.5 ${isFullWidth ? "md:col-span-2" : ""}`}>
                  <label className="text-xs font-bold text-slate-700 block">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "text" || field.type === "email" || field.type === "number" ? (
                    <input
                      type={field.type}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-brand-500"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData[field.name] ?? ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-brand-500"
                    >
                      <option value="">Select option...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={formData[field.name] ?? ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-brand-500"
                    ></textarea>
                  ) : field.type === "image" ? (
                    <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center space-y-2 bg-slate-50">
                      <Upload className="w-6 h-6 text-brand-600 mx-auto" />
                      <span className="text-xs font-bold text-slate-900 block">Upload Image</span>
                    </div>
                  ) : null}

                  {error && <p className="text-[11px] font-semibold text-red-500">{error}</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-200 flex items-center justify-end gap-3">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50">
              Cancel
            </button>
          )}
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-lux flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Save Record</span>
          </button>
        </div>
      </form>
    </div>
  );
}
