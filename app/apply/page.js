"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, FileUp, Calendar, CheckCircle2, 
  ArrowRight, ArrowLeft, Save, ShieldCheck, Loader2, FileCheck
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadToCloudinary } from "@/utils/cloudinary-upload";

const steps = [
  { id: 1, title: "Personal", icon: User },
  { id: 2, title: "Address", icon: MapPin },
  { id: 3, title: "Documents", icon: FileUp },
  { id: 4, title: "Booking", icon: Calendar },
  { id: 5, title: "Review", icon: CheckCircle2 },
];

/** 
 * --- EXTRACTED REUSABLE COMPONENTS ---
 * Moving these outside the main page function fixes the focus loss issue
 * which occurs when components are re-created on every parent render.
 */

const InputField = ({ label, id, type = "text", placeholder, value, onChange, icon: Icon }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-bold text-slate-700 flex items-center gap-2">
       {Icon && <Icon className="h-4 w-4 text-indigo-500" />}
       {label}
    </label>
    <div className="relative group">
       <input
         id={id}
         type={type}
         placeholder={placeholder}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className={cn(
           "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none",
           type === "date" && "appearance-none custom-date-input"
         )}
       />
       {type === "date" && (
          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
       )}
    </div>
  </div>
);

const Step1 = ({ formData, updateForm }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField 
        label="Full Name (As per Aadhar)" 
        id="fullName" 
        placeholder="e.g. Vikram Pratap Singh"
        value={formData.fullName}
        onChange={(v) => updateForm('fullName', v)}
        icon={User}
      />
      <InputField 
        label="Date of Birth" 
        id="dob" 
        type="date"
        value={formData.dob}
        onChange={(v) => updateForm('dob', v)}
        icon={Calendar}
      />
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
           <ShieldCheck className="h-4 w-4 text-indigo-500" />
           Gender
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['Male', 'Female', 'Other'].map(g => (
            <button
              key={g}
              type="button"
              onClick={() => updateForm('gender', g)}
              className={cn(
                "py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all",
                formData.gender === g 
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                  : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <InputField 
        label="Nationality" 
        id="nationality" 
        value={formData.nationality}
        onChange={(v) => updateForm('nationality', v)}
        icon={MapPin}
      />
    </div>
  </div>
);

const Step2 = ({ formData, updateForm }) => (
  <div className="space-y-6">
    <InputField 
      label="Current Residential Address" 
      id="address" 
      placeholder="Building, Street, Area"
      value={formData.address}
      onChange={(v) => updateForm('address', v)}
      icon={MapPin}
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InputField 
        label="City" 
        id="city" 
        placeholder="e.g. Delhi"
        value={formData.city}
        onChange={(v) => updateForm('city', v)}
      />
      <InputField 
        label="State" 
        id="state" 
        placeholder="e.g. Delhi"
        value={formData.state}
        onChange={(v) => updateForm('state', v)}
      />
      <InputField 
        label="Pincode" 
        id="pincode" 
        placeholder="110001"
        value={formData.pincode}
        onChange={(v) => updateForm('pincode', v)}
      />
    </div>
  </div>
);

const Step3 = ({ formData, uploadingDocs, handleFileChange }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { label: "Passport Photo", field: "passportPhoto", desc: "Front facing, white background" },
        { label: "Aadhar Card", field: "aadhaarCard", desc: "Front and back side merged" },
        { label: "Birth Certificate", field: "birthCertificate", desc: "Original or digital copy" }
      ].map((doc, idx) => (
        <div 
          key={idx} 
          onClick={() => !uploadingDocs[doc.field] && document.getElementById(`file-${doc.field}`).click()}
          className={cn(
            "p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 group transition-all cursor-pointer relative overflow-hidden",
            formData[doc.field] 
              ? "border-emerald-200 bg-emerald-50/30" 
              : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30"
          )}
        >
          <input 
            type="file" 
            id={`file-${doc.field}`}
            className="hidden"
            onChange={(e) => handleFileChange(doc.field, e.target.files[0])}
            accept="image/*,.pdf"
          />
          
          <div className={cn(
            "h-12 w-12 rounded-full shadow-sm flex items-center justify-center transition-transform group-hover:scale-110",
            formData[doc.field] ? "bg-emerald-500 text-white" : "bg-white text-indigo-600"
          )}>
            {uploadingDocs[doc.field] ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : formData[doc.field] ? (
              <FileCheck className="h-6 w-6" />
            ) : (
              <FileUp className="h-5 w-5" />
            )}
          </div>
          
          <div>
            <p className={cn(
              "text-sm font-bold",
              formData[doc.field] ? "text-emerald-700" : "text-slate-800"
            )}>
              {formData[doc.field] ? `${doc.label} Uploaded` : doc.label}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">{doc.desc}</p>
          </div>

          {formData[doc.field] && (
             <div className="absolute top-2 right-2">
                <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                   <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
             </div>
          )}
        </div>
      ))}
    </div>
    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
      <ShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0" />
      <p className="text-xs text-amber-800 font-medium leading-relaxed">
        Ensure all documents are clear and in PDF or JPG format (max 5MB). Incomplete documents may delay the processing.
      </p>
    </div>
  </div>
);

const Step4 = ({ formData, updateForm }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
         <MapPin className="h-4 w-4 text-indigo-500" />
         Select Passport Office (PSK)
      </label>
      <select 
        value={formData.office}
        onChange={(e) => updateForm('office', e.target.value)}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-medium"
      >
        <option value="">Select an office near you...</option>
        <option value="PSK Delhi - RK Puram">PSK Delhi - RK Puram</option>
        <option value="PSK Delhi - Herald House">PSK Delhi - Herald House</option>
        <option value="PSK Gurgaon">PSK Gurgaon</option>
        <option value="PSK Noida">PSK Noida</option>
      </select>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField 
        label="Preferred Appointment Date" 
        id="date" 
        type="date"
        value={formData.appointmentDate}
        onChange={(v) => updateForm('appointmentDate', v)}
        icon={Calendar}
      />
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
           <Calendar className="h-4 w-4 text-indigo-500" />
           Preferred Time Slot
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => updateForm('timeSlot', t)}
              className={cn(
                "py-2 px-3 rounded-lg border text-xs font-bold transition-all",
                formData.timeSlot === t 
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                  : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Step5 = ({ formData }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-4">
        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Personal & Address</h4>
        <div className="space-y-3">
          {[
            { l: 'Full Name', v: formData.fullName },
            { l: 'Gender', v: formData.gender },
            { l: 'DOB', v: formData.dob },
            { l: 'Address', v: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}` }
          ].map((i, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{i.l}</span>
              <span className="text-sm font-semibold text-slate-800 truncate">{i.v || 'Not provided'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-1 space-y-4">
        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Appointment Details</h4>
        <div className="space-y-3">
          {[
            { l: 'Passport Office', v: formData.office },
            { l: 'Date', v: formData.appointmentDate },
            { l: 'Time Slot', v: formData.timeSlot }
          ].map((i, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{i.l}</span>
              <span className="text-sm font-semibold text-slate-800">{i.v || 'Not provided'}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-1 space-y-4">
        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Document Status</h4>
        <div className="space-y-3">
          {[
            { l: 'Passport Photo', v: formData.passportPhoto },
            { l: 'Aadhar Card', v: formData.aadhaarCard },
            { l: 'Birth Certificate', v: formData.birthCertificate }
          ].map((i, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={cn(
                "h-2 w-2 rounded-full",
                i.v ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"
              )} />
              <span className="text-xs font-bold text-slate-500 uppercase flex-1">{i.l}</span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                i.v ? "text-emerald-600" : "text-slate-400"
              )}>
                {i.v ? 'Uploaded' : 'Missing'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
      <h4 className="text-sm font-bold text-indigo-900 mb-2 font-bold">Final Declaration</h4>
      <p className="text-xs text-indigo-700/80 leading-relaxed italic">
        I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that providing false information is a punishable offense under the Passports Act, 1967.
      </p>
    </div>
  </div>
);

/** --- MAIN APPLY PAGE --- */

export default function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState({
    passportPhoto: false,
    aadhaarCard: false,
    birthCertificate: false
  });

  const [formData, setFormData] = useState({
    applicationId: "",
    fullName: "",
    dob: "",
    gender: "",
    nationality: "Indian",
    address: "",
    city: "",
    state: "",
    pincode: "",
    office: "",
    appointmentDate: "",
    timeSlot: "",
    passportPhoto: "",
    aadhaarCard: "",
    birthCertificate: ""
  });

  useEffect(() => {
    if (draftId) {
      const fetchDraft = async () => {
        try {
          const res = await fetch("/api/application/drafts");
          const data = await res.json();
          if (data.success && data.drafts) {
            const draft = data.drafts.find(d => d.applicationId === draftId);
            if (draft) {
              setFormData({
                applicationId: draft.applicationId,
                fullName: draft.fullName || "",
                dob: draft.dateOfBirth ? new Date(draft.dateOfBirth).toISOString().split('T')[0] : "",
                gender: draft.gender || "",
                nationality: draft.nationality || "Indian",
                address: draft.address || "",
                city: draft.city || "",
                state: draft.addressState || "",
                pincode: draft.pincode || "",
                office: draft.passportOffice || "",
                appointmentDate: draft.appointmentDate ? new Date(draft.appointmentDate).toISOString().split('T')[0] : "",
                timeSlot: draft.timeSlot || "",
                passportPhoto: draft.passportPhoto || "",
                aadhaarCard: draft.aadhaarCard || "",
                birthCertificate: draft.birthCertificate || ""
              });

              // Determine starting step
              if (draft.passportOffice && draft.appointmentDate && draft.timeSlot) {
                setCurrentStep(5);
              } else if (draft.passportPhoto && draft.aadhaarCard && draft.birthCertificate) {
                setCurrentStep(4);
              } else if (draft.address && draft.city && draft.addressState && draft.pincode) {
                setCurrentStep(3);
              } else if (draft.fullName && draft.gender && draft.dateOfBirth) {
                setCurrentStep(2);
              } else {
                setCurrentStep(1);
              }
            }
          }
        } catch (err) {
          console.error("Fetch draft error:", err);
        }
      };
      fetchDraft();
    }
  }, [draftId]);

  const handleSave = async (action = "draft") => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/application/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, action })
      });
      const data = await res.json();
      if (data.success) {
        if (action === "submit") {
          alert("Application submitted successfully!");
          router.push("/status");
        } else {
          router.push("/drafts");
        }
      } else {
        alert(data.message || "Failed to save");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (field, file) => {
    if (!file) return;
    setUploadingDocs(prev => ({ ...prev, [field]: true }));
    try {
      const url = await uploadToCloudinary(file, 'passport_documents');
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Failed to upload ${field}. Please try again.`);
    } finally {
      setUploadingDocs(prev => ({ ...prev, [field]: false }));
    }
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.fullName.trim() && formData.dob && formData.gender && formData.nationality;
      case 2:
        return formData.address.trim() && formData.city.trim() && formData.state.trim() && formData.pincode.trim();
      case 3:
        return formData.passportPhoto && formData.aadhaarCard && formData.birthCertificate;
      case 4:
        return formData.office && formData.appointmentDate && formData.timeSlot;
      case 5:
        return isStepValid(1) && isStepValid(2) && isStepValid(3) && isStepValid(4);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">New Passport Application</h1>
          <p className="text-slate-500 md:font-medium">Please complete all steps to submit your application.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Draft
          </Button>
        </div>
      </div>

      {/* Progress Stepper */}
      <Card className="p-4 md:p-6 border-slate-100">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-[1.375rem] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-0">
            <motion.div 
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep - 1) * 25}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 group">
              <button
                onClick={() => step.id < currentStep && isStepValid(step.id - 1) && setCurrentStep(step.id)}
                className={cn(
                  "h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300",
                  currentStep === step.id 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 ring-4 ring-indigo-50" 
                    : currentStep > step.id 
                      ? "bg-emerald-500 text-white" 
                      : "bg-white border-2 border-slate-100 text-slate-400"
                )}
              >
                {currentStep > step.id ? <CheckCircle2 className="h-6 w-6" /> : <step.icon className="h-5 w-5" />}
              </button>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-colors",
                currentStep === step.id ? "text-indigo-600" : "text-slate-400"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Form Content */}
      <Card className="p-8 md:p-10 border-slate-200 shadow-xl shadow-slate-200/50 min-h-[400px] flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-1">{steps.find(s => s.id === currentStep).title} Information</h2>
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
              </div>

              {currentStep === 1 && <Step1 formData={formData} updateForm={updateForm} />}
              {currentStep === 2 && <Step2 formData={formData} updateForm={updateForm} />}
              {currentStep === 3 && <Step3 formData={formData} uploadingDocs={uploadingDocs} handleFileChange={handleFileChange} />}
              {currentStep === 4 && <Step4 formData={formData} updateForm={updateForm} />}
              {currentStep === 5 && <Step5 formData={formData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-12 border-t border-slate-100 mt-12">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          {currentStep < 5 ? (
            <Button 
              onClick={nextStep} 
              disabled={!isStepValid(currentStep)}
              className={cn(
                "gap-2 px-8",
                !isStepValid(currentStep) && "opacity-50 cursor-not-allowed"
              )}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => handleSave("submit")} 
              disabled={isSaving || !isStepValid(5)}
              className={cn(
                "gap-2 px-10 bg-indigo-600 hover:bg-indigo-500",
                (!isStepValid(5) || isSaving) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSaving ? (
                <>Submitting... <Loader2 className="h-4 w-4 animate-spin ml-2" /></>
              ) : (
                <>Submit Application <CheckCircle2 className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
