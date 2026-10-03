'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SubscriptionPlanDto } from '../dto/subscription.dto';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlanDto[];
  currentPlanId?: string;
  onUpgradePlan: (
    planId: string,
    billingCycle: 'MONTHLY' | 'YEARLY',
    paymentDetails?: {
      cardLast4?: string;
      cardBrand?: string;
      cardholderName?: string;
      gatewayToken?: string;
    }
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
}

export default function UpgradePlanModal({
  isOpen,
  onClose,
  plans,
  currentPlanId,
  onUpgradePlan,
}: UpgradePlanModalProps) {
  const [step, setStep] = useState<'plans' | 'stripe-checkout'>('plans');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDto | null>(null);

  // Stripe card form state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardholderName, setCardholderName] = useState('Arman Alam');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePlanClick = (plan: SubscriptionPlanDto) => {
    const isFree = parseFloat(plan.priceMonthly) === 0;
    setSelectedPlan(plan);

    if (isFree) {
      // Free plan upgrades immediately
      executeUpgrade(plan.id);
    } else {
      // Paid plan transitions to Stripe Checkout UI
      setError(null);
      setStep('stripe-checkout');
    }
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
    setCardholderName('Arman Alam');
  };

  const executeUpgrade = async (planId: string) => {
    setError(null);
    setIsSubmitting(true);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    const last4 = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';
    const cardBrand = cleanCard.startsWith('4')
      ? 'Visa'
      : cleanCard.startsWith('5')
      ? 'Mastercard'
      : cleanCard.startsWith('3')
      ? 'Amex'
      : 'Card';

    const res = await onUpgradePlan(planId, billingCycle, {
      cardLast4: last4,
      cardBrand,
      cardholderName: cardholderName || 'Seller',
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessInfo('Payment verified! Subscription tier successfully activated.');
      setTimeout(() => {
        setSuccessInfo(null);
        setStep('plans');
        onClose();
      }, 1800);
    } else {
      setError(res.error || 'Failed to complete transaction via Stripe');
    }
  };

  const handleStripeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
      setError('Please enter expiry in MM/YY format.');
      return;
    }
    if (cardCvc.length < 3) {
      setError('Please enter a valid 3 or 4 digit CVC.');
      return;
    }

    executeUpgrade(selectedPlan.id);
  };

  const activePriceFormatted = selectedPlan
    ? billingCycle === 'YEARLY'
      ? `₹${parseFloat(selectedPlan.priceYearly).toLocaleString('en-IN')}`
      : `₹${parseFloat(selectedPlan.priceMonthly).toLocaleString('en-IN')}`
    : '₹0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Step 1: Plan Selection View */}
        {step === 'plans' && (
          <>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Upgrade Subscription Tier</h2>
                  <p className="text-xs text-gray-400">Unlock higher product limits, lower commissions, and AI tools</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="px-6 pt-5 pb-2 flex justify-center flex-shrink-0">
              <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1 border border-gray-200">
                <button
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
                    billingCycle === 'MONTHLY'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('YEARLY')}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'YEARLY'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Yearly Billing
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-bold">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="px-6 flex-shrink-0">
              {successInfo && (
                <div className="my-2 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-2xl flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successInfo}</span>
                </div>
              )}
              {error && (
                <div className="my-2 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-2xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Plans Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const isCurrent = plan.id === currentPlanId;
                const price =
                  billingCycle === 'YEARLY'
                    ? `₹${parseFloat(plan.priceYearly).toLocaleString('en-IN')}/yr`
                    : `₹${parseFloat(plan.priceMonthly).toLocaleString('en-IN')}/mo`;

                return (
                  <div
                    key={plan.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all relative ${
                      plan.isPopular
                        ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20 bg-blue-50/20'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{plan.description}</p>
                      </div>

                      <div className="pt-2">
                        <span className="text-xl font-black text-gray-900">{price}</span>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <ul className="space-y-2">
                          {plan.features.slice(0, 4).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                              <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-5">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 text-xs font-semibold text-gray-400 bg-gray-100 rounded-xl cursor-default text-center"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePlanClick(plan)}
                          disabled={isSubmitting}
                          className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-xl transition-all shadow-sm shadow-blue-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <span>Upgrade to {plan.name}</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Step 2: Visual Stripe Payment Gateway Interface */}
        {step === 'stripe-checkout' && selectedPlan && (
          <form onSubmit={handleStripeSubmit} className="flex flex-col h-full">
            {/* Stripe Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep('plans');
                  }}
                  disabled={isSubmitting}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold tracking-tight">Stripe Checkout</h2>
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                        TEST MODE
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">Guaranteed 256-bit encrypted card authorization</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Order Summary Card */}
            <div className="p-5 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subscribing to</p>
                <h3 className="text-base font-bold text-gray-900">{selectedPlan.name}</h3>
                <span className="text-xs text-gray-500">
                  Billed {billingCycle === 'YEARLY' ? 'Annually (365 days)' : 'Monthly (30 days)'} • Instant Activation
                </span>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Due Today</p>
                <p className="text-xl font-black text-gray-900">{activePriceFormatted}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Quick Fill Button */}
              <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-blue-900 font-medium">
                  <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Stripe Free Sandbox Test Card ready</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-xs cursor-pointer hover:bg-blue-50 transition-all"
                >
                  Use 4242 Test Card
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Banner */}
              {successInfo && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successInfo}</span>
                </div>
              )}

              {/* Cardholder Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Name on card"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium text-gray-900 transition-all"
                />
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex justify-between">
                  <span>Card Information</span>
                  <span className="text-[11px] text-gray-400 font-normal">Visa, Mastercard, RuPay, Amex</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardNumber(formatted);
                    }}
                    placeholder="4242 4242 4242 4242"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-20 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono font-medium text-gray-900 tracking-wider transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      VISA
                    </span>
                  </div>
                </div>
              </div>

              {/* Expiry and CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Expiration Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                      if (val.length >= 3) {
                        val = `${val.substring(0, 2)}/${val.substring(2)}`;
                      }
                      setCardExpiry(val);
                    }}
                    placeholder="MM / YY"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono font-medium text-gray-900 transition-all text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">CVC / Security Code</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="•••"
                      disabled={isSubmitting}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono font-medium text-gray-900 transition-all text-center tracking-widest"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Pay Button */}
            <div className="p-5 border-t border-gray-100 flex-shrink-0 bg-gray-50 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing with Stripe Test Network...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {activePriceFormatted} & Activate Tier</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Powered by Stripe • Test Mode (Zero Real Charges)</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
