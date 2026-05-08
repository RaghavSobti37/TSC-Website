import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft,
  Headphones,
  Music,
  Mic2,
  X
} from 'lucide-react';

type FormData = {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  course: string;
  date: string;
  time: string;
};

const courses = [
  {
    id: 'composition',
    title: 'The heART of Composition',
    mentor: 'Sandesh Shandilya',
    icon: Music,
    color: 'bg-orange/10 text-orange'
  },
  {
    id: 'classical',
    title: 'Roots of Hindustani Classical',
    mentor: 'Prasad Khaparde',
    icon: Mic2,
    color: 'bg-teal-primary/10 text-teal-primary'
  },
  {
    id: 'production',
    title: 'A to Z of Music Production',
    mentor: 'Luca Petracca',
    icon: Headphones,
    color: 'bg-blue-500/10 text-blue-500',
    isComingSoon: true
  }
];

const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'UAE' },
  { code: '+61', country: 'Australia' },
  { code: '+65', country: 'Singapore' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' }
];

const timeSlots = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
];

export default function BookACall() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      course: courses[0].title,
      countryCode: '+91'
    }
  });

  const selectedCourse = watch('course');
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/book-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: `${data.countryCode}${data.phone.replace(/\s/g, '')}`,
          email: data.email,
          whatsapp: `${data.countryCode}${data.phone.replace(/\s/g, '')}`,
          referral: 'Direct Booking'
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Failed to book call. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4 font-alan-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border border-pumpkin/10"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-signika font-bold text-charcoal mb-4">You&apos;re all set!</h1>
          <p className="text-slate-medium mb-8 text-lg">
            We&apos;ve received your request. Expect a WhatsApp message from us shortly to confirm the details.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-charcoal text-white py-4 rounded-2xl font-bold text-lg hover:bg-pumpkin transition-all shadow-lg"
          >
            Back to TSC Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-alan-sans selection:bg-pumpkin/30 pb-20 overflow-x-hidden">
      <Head>
        <title>Book a Call | TSC Academy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="max-w-xl mx-auto px-5 pt-32 md:pt-40">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 text-slate-medium font-bold text-sm"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex flex-col items-center">
             <span className="text-xs font-black tracking-widest text-pumpkin uppercase">
              Step {step} of 3
            </span>
            <div className="text-[10px] font-bold text-slate-light mt-1 uppercase tracking-tighter">
              Page {step}/3
            </div>
          </div>
          <div className="w-10" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Course Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-signika font-bold text-charcoal mb-4">Which course are you interested in?</h1>
                
                {/* Progress Bar below question */}
                <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="h-full bg-pumpkin"
                    initial={{ width: '0%' }}
                    animate={{ width: '33.33%' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setValue('course', course.title);
                      nextStep();
                    }}
                    className={`
                      relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all
                      ${selectedCourse === course.title 
                        ? 'border-pumpkin bg-white shadow-xl scale-[1.02]' 
                        : 'border-white bg-white/50 hover:border-pumpkin/30'}
                    `}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${course.color}`}>
                      <course.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-charcoal leading-tight">{course.title}</h3>
                        {course.isComingSoon && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-pumpkin/10 text-pumpkin px-1.5 py-0.5 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-medium">Mentor: {course.mentor}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedCourse === course.title ? 'bg-pumpkin border-pumpkin' : 'border-slate-lighter'}`}>
                      {selectedCourse === course.title && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-signika font-bold text-charcoal mb-4">Tell us about yourself</h1>
                
                {/* Progress Bar below question */}
                <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="h-full bg-pumpkin"
                    initial={{ width: '33.33%' }}
                    animate={{ width: '66.66%' }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-medium uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> What&apos;s your name?
                  </label>
                  <input 
                    {...register('name', { required: 'Name is required' })}
                    autoFocus
                    placeholder="Enter your full name"
                    className="w-full bg-white border-none rounded-2xl py-5 px-6 text-xl font-medium shadow-sm focus:ring-4 focus:ring-pumpkin/20 transition-all"
                  />
                  {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-medium uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone / WhatsApp Number
                  </label>
                  <div className="flex gap-3">
                    <select 
                      {...register('countryCode')}
                      className="bg-white border-none rounded-2xl py-5 px-4 text-lg font-bold shadow-sm focus:ring-4 focus:ring-pumpkin/20 transition-all appearance-none cursor-pointer min-w-[100px] text-center"
                    >
                      {countryCodes.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                      ))}
                    </select>
                    <input 
                      {...register('phone', { required: 'Phone is required' })}
                      type="tel"
                      placeholder="98765 43210"
                      className="flex-1 bg-white border-none rounded-2xl py-5 px-6 text-xl font-medium shadow-sm focus:ring-4 focus:ring-pumpkin/20 transition-all"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 font-bold">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-medium uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Email Address
                  </label>
                  <input 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email format'
                      }
                    })}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white border-none rounded-2xl py-5 px-6 text-xl font-medium shadow-sm focus:ring-4 focus:ring-pumpkin/20 transition-all"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>}
                </div>
              </div>

              <button 
                onClick={nextStep}
                disabled={!watch('name') || !watch('phone') || !watch('email')}
                className="w-full bg-charcoal text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-pumpkin transition-all shadow-xl disabled:opacity-50"
              >
                Continue <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-signika font-bold text-charcoal mb-4">When should we call?</h1>
                
                {/* Progress Bar below question */}
                <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="h-full bg-pumpkin"
                    initial={{ width: '66.66%' }}
                    animate={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {/* Date Selection Trigger */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-medium uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Pick a Date
                  </label>
                  <button
                    onClick={() => setShowDatePicker(true)}
                    className="w-full bg-white border-none rounded-2xl py-5 px-6 text-xl font-medium shadow-sm text-left flex justify-between items-center"
                  >
                    <span className={selectedDate ? 'text-charcoal' : 'text-slate-light'}>
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                    </span>
                    <ChevronLeft className="w-6 h-6 rotate-180 text-pumpkin" />
                  </button>
                </div>

                {/* Time Selection Trigger */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-medium uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Pick a Time
                  </label>
                  <button
                    onClick={() => setShowTimePicker(true)}
                    className="w-full bg-white border-none rounded-2xl py-5 px-6 text-xl font-medium shadow-sm text-left flex justify-between items-center"
                  >
                    <span className={selectedTime ? 'text-charcoal' : 'text-slate-light'}>
                      {selectedTime || 'Select Time'}
                    </span>
                    <ChevronLeft className="w-6 h-6 rotate-180 text-pumpkin" />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !selectedDate || !selectedTime}
                className="w-full bg-pumpkin text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-charcoal transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Booking...' : 'Confirm My Call'} <CheckCircle2 className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Date Picker Pop-up */}
      <AnimatePresence>
        {showDatePicker && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDatePicker(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-signika font-bold text-charcoal">Select Date</h2>
                <button onClick={() => setShowDatePicker(false)} className="p-2 hover:bg-cream rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <input 
                type="date"
                onChange={(e) => {
                  setValue('date', e.target.value);
                  setTimeout(() => setShowDatePicker(false), 300);
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-cream rounded-2xl py-6 px-8 text-2xl font-bold border-2 border-transparent focus:border-pumpkin outline-none"
              />
              <div className="mt-8">
                <button 
                  onClick={() => setShowDatePicker(false)}
                  className="w-full bg-charcoal text-white py-4 rounded-xl font-bold"
                >
                  Confirm Date
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Time Picker Pop-up */}
      <AnimatePresence>
        {showTimePicker && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowTimePicker(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-8 shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-signika font-bold text-charcoal">Select Time Slot</h2>
                <button onClick={() => setShowTimePicker(false)} className="p-2 hover:bg-cream rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2 pb-4 scrollbar-hide">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => {
                      setValue('time', slot);
                      setTimeout(() => setShowTimePicker(false), 300);
                    }}
                    className={`
                      py-4 px-4 rounded-xl border-2 font-bold transition-all
                      ${selectedTime === slot 
                        ? 'border-pumpkin bg-pumpkin/10 text-pumpkin scale-[1.02]' 
                        : 'border-cream bg-cream/50 text-slate-medium hover:border-pumpkin/30'}
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => setShowTimePicker(false)}
                  className="w-full bg-charcoal text-white py-4 rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}
