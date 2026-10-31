'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/*
  Lumière palette (taken from the reference image)
  ─ Cream / blush page  : #FFF4F6  /  #FDE6EC  /  #FBD3DE
  ─ Magenta (primary)   : #B0124F  →  #D81B7A (gradient end)
  ─ Deep plum / burgundy: #4A0F2E  /  #2E0A1C (text)
  ─ Gold accent         : #C9A24B  /  #E3B964
  ─ Muted text          : #7A5566
*/

interface CartItem {
  id: string;
  title: string;
  priceBDT: number;
  quantity: number;
  image?: string;
}

/* ---------- Shared style tokens ---------- */
const inputCls =
  'w-full rounded-xl border border-[#F3C6D3] bg-[#FFFAFB] px-4 py-2.5 text-sm text-[#2E0A1C] placeholder:text-[#B590A0] transition focus:border-[#B0124F] focus:outline-none focus:ring-2 focus:ring-[#B0124F]/25 disabled:cursor-not-allowed disabled:bg-[#FBEAEE] disabled:text-[#B590A0]';
const labelCls = 'mb-1.5 block text-sm font-medium text-[#4A0F2E]';
const gradientBtn =
  'bg-gradient-to-r from-[#B0124F] to-[#D81B7A] text-white shadow-lg shadow-[#B0124F]/30 transition hover:from-[#990F44] hover:to-[#C21769]';

export default function CheckoutPage() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [detailedAddress, setDetailedAddress] = useState<string>('');
  const [division, setDivision] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [upazila, setUpazila] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash on Delivery');

  // Specific payment gateway inputs
  const [bkashNumber, setBkashNumber] = useState<string>('');
  const [bkashTrxId, setBkashTrxId] = useState<string>('');
  const [nagadNumber, setNagadNumber] = useState<string>('');
  const [nagadTrxId, setNagadTrxId] = useState<string>('');
  const [cellfinAccount, setCellfinAccount] = useState<string>('');

  // Cart & Submission states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');

  // Division & District Mapping Data
  const divisionsData: { [key: string]: string[] } = {
    Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail'],
    Chittagong: ['Chittagong', "Cox's Bazar", 'Comilla', 'Feni'],
    Rajshahi: ['Rajshahi', 'Bogra', 'Pabna'],
    Khulna: ['Khulna', 'Jessore', 'Kushtia'],
    Barisal: ['Barisal', 'Patuakhali'],
    Rangpur: ['Rangpur', 'Dinajpur'],
    Mymensingh: ['Mymensingh', 'Jamalpur'],
  };

  const upazilaData: { [key: string]: string[] } = {
    Sylhet: ['Sadar', 'Companiganj', 'Gowainghat', 'Beanibazar', 'Golapganj'],
    Moulvibazar: ['Sreemangal', 'Kulaura', 'Juri'],
    Dhaka: ['Dhamrai', 'Dohar', 'Keraniganj', 'Savar'],
    Gazipur: ['Kaliakair', 'Sreepur', 'Kapasia'],
  };

  useEffect(() => {
    // Simulated cart loading
    setCartItems([
      {
        id: 'PROD-101',
        title: 'Smart Wireless Headset',
        priceBDT: 7200,
        quantity: 1,
      },
    ]);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.priceBDT * item.quantity, 0);
  };

  const deliveryCharge = 100;
  const grandTotal = calculateSubtotal() + deliveryCharge;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrderData = {
      id: generatedOrderId,
      customerName: fullName,
      phone: phoneNumber,
      email: emailAddress,
      village: village,
      postalCode: postalCode,
      address: `${detailedAddress}, ${upazila}, ${district}, ${division}`,
      items: cartItems.map((item) => `${item.title} (x${item.quantity})`).join(', '),
      totalAmountBDT: grandTotal,
      paymentMethod: paymentMethod,
      paymentDetails:
        paymentMethod === 'bKash'
          ? `bKash No: ${bkashNumber}, TrxID: ${bkashTrxId}`
          : paymentMethod === 'Nagad'
          ? `Nagad No: ${nagadNumber}, TrxID: ${nagadTrxId}`
          : paymentMethod === 'Cellfin (IBBL)'
          ? `Cellfin: ${cellfinAccount}`
          : 'Cash on Delivery',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };

    try {
      // Save order to localStorage to simulate persistent DB update
      const existingOrders = JSON.parse(localStorage.getItem('marketplace_orders') || '[]');
      localStorage.setItem('marketplace_orders', JSON.stringify([newOrderData, ...existingOrders]));

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setCompletedOrderId(generatedOrderId);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Failed to submit order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ====================== SUCCESS SCREEN ====================== */
  if (orderSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] p-6">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D81B7A]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#C9A24B]/20 blur-3xl" />

        <div className="relative w-full max-w-lg rounded-3xl border border-[#F3C6D3] bg-white/90 p-8 text-center shadow-2xl shadow-[#B0124F]/15 backdrop-blur md:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#B0124F] to-[#D81B7A] text-3xl font-extrabold text-white shadow-lg shadow-[#B0124F]/40 ring-4 ring-[#E3B964]/60">
            ✓
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A24B]">
            Thank you
          </p>
          <h1 className="mb-2 font-serif text-3xl font-bold text-[#2E0A1C]">
            Order <span className="italic text-[#B0124F]">Confirmed!</span>
          </h1>
          <p className="mb-6 text-sm text-[#7A5566]">
            Thank you for shopping with us. Your order has been placed successfully.
          </p>

          <div className="mb-6 space-y-2 rounded-2xl border border-[#F3C6D3] bg-[#FFF4F6] p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Order ID:</span>
              <span className="font-bold text-[#B0124F]">{completedOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Customer Name:</span>
              <span className="font-semibold text-[#2E0A1C]">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Phone Number:</span>
              <span className="font-semibold text-[#2E0A1C]">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#7A5566]">Payment Method:</span>
              <span className="font-semibold text-[#2E0A1C]">{paymentMethod}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[#E3B964]/50 pt-2">
              <span className="font-bold text-[#4A0F2E]">Total Amount:</span>
              <span className="font-bold text-[#B0124F]">৳{grandTotal.toLocaleString('en-BD')}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className={`w-full rounded-full py-3.5 text-sm font-bold ${gradientBtn}`}
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  /* ====================== CHECKOUT FORM ====================== */
  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center md:text-left">
          <p className="mb-1 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#4A0F2E] md:justify-start">
            Secure Checkout
            <span className="hidden h-px w-16 bg-[#C9A24B] md:block" />
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#2E0A1C] md:text-4xl">
            Checkout <span className="italic text-[#B0124F]">Information</span>
          </h1>
        </div>

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Customer Details Form */}
          <div className="space-y-6 rounded-3xl border border-[#F3C6D3] bg-white/95 p-6 shadow-xl shadow-[#B0124F]/10 md:p-8 lg:col-span-2">
            <h2 className="border-b border-[#E3B964]/50 pb-3 font-serif text-xl font-semibold text-[#4A0F2E]">
              Shipping &amp; Contact Details
            </h2>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelCls}>Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelCls}>Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelCls}>Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="name@example.com"
                className={inputCls}
              />
            </div>

            {/* Village & Address */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="village" className={labelCls}>Village / Area / House</label>
                <input
                  id="village"
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Enter village or area name"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="address" className={labelCls}>Detailed Address</label>
                <input
                  id="address"
                  type="text"
                  required
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  placeholder="Street address, landmarks, etc."
                  className={inputCls}
                />
              </div>
            </div>

            {/* Division & District */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="division" className={labelCls}>Select Division</label>
                <select
                  id="division"
                  required
                  value={division}
                  onChange={(e) => {
                    setDivision(e.target.value);
                    setDistrict('');
                    setUpazila('');
                  }}
                  className={inputCls}
                >
                  <option value="">-- Choose Division --</option>
                  {Object.keys(divisionsData).map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="district" className={labelCls}>Select District</label>
                <select
                  id="district"
                  required
                  disabled={!division}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setUpazila('');
                  }}
                  className={inputCls}
                >
                  <option value="">-- Choose District First --</option>
                  {division &&
                    divisionsData[division]?.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Upazila & Postal Code */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="upazila" className={labelCls}>Select Thana / Upazila</label>
                <select
                  id="upazila"
                  required
                  disabled={!district}
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className={inputCls}
                >
                  <option value="">-- Choose District First --</option>
                  {district && upazilaData[district]
                    ? upazilaData[district].map((upazilaName) => (
                        <option key={upazilaName} value={upazilaName}>
                          {upazilaName}
                        </option>
                      ))
                    : district && (
                        <>
                          <option value="Sadar">Sadar</option>
                          <option value="Center">Center</option>
                        </>
                      )}
                </select>
              </div>
              <div>
                <label htmlFor="postal" className={labelCls}>Postal Code</label>
                <input
                  id="postal"
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 4000"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="border-t border-[#E3B964]/50 pt-5">
              <p className="mb-3 font-serif text-lg font-semibold text-[#4A0F2E]">
                Select Payment Method
              </p>
              <div className="space-y-3">
                {['Cash on Delivery', 'Debit / Credit Card', 'bKash', 'Nagad', 'Cellfin (IBBL)'].map(
                  (method) => (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                        paymentMethod === method
                          ? 'border-[#B0124F] bg-[#FDE6EC] ring-1 ring-[#B0124F]'
                          : 'border-[#F3C6D3] bg-white hover:bg-[#FFF4F6]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 accent-[#B0124F]"
                      />
                      <span className="text-sm font-medium text-[#2E0A1C]">{method}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Conditional Payment Gateway Fields */}
            {paymentMethod === 'bKash' && (
              <div className="space-y-3 rounded-2xl border border-[#E8A3BC] bg-[#FDE6EC] p-4">
                <p className="text-xs font-semibold text-[#B0124F]">
                  Please Send Money to 01700000000 and enter details below:
                </p>
                <input
                  type="text"
                  required
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  placeholder="Your bKash Mobile Number"
                  className={inputCls}
                />
                <input
                  type="text"
                  required
                  value={bkashTrxId}
                  onChange={(e) => setBkashTrxId(e.target.value)}
                  placeholder="Transaction ID (TrxID)"
                  className={inputCls}
                />
              </div>
            )}

            {paymentMethod === 'Nagad' && (
              <div className="space-y-3 rounded-2xl border border-[#E3B964] bg-[#FBF1D9] p-4">
                <p className="text-xs font-semibold text-[#7A5A12]">
                  Please Send Money to 01700000000 and enter details below:
                </p>
                <input
                  type="text"
                  required
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  placeholder="Your Nagad Mobile Number"
                  className={inputCls}
                />
                <input
                  type="text"
                  required
                  value={nagadTrxId}
                  onChange={(e) => setNagadTrxId(e.target.value)}
                  placeholder="Transaction ID (TrxID)"
                  className={inputCls}
                />
              </div>
            )}

            {paymentMethod === 'Cellfin (IBBL)' && (
              <div className="space-y-2 rounded-2xl border border-[#C79AB0] bg-[#F6E3EB] p-4">
                <label htmlFor="cellfin" className="block text-xs font-semibold text-[#4A0F2E]">
                  Cellfin Account Number or TrxID
                </label>
                <input
                  id="cellfin"
                  type="text"
                  required
                  value={cellfinAccount}
                  onChange={(e) => setCellfinAccount(e.target.value)}
                  placeholder="Enter your Cellfin account or TrxID"
                  className={inputCls}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-full py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60 ${gradientBtn}`}
            >
              {isSubmitting ? 'Processing Order...' : 'Complete Order →'}
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="h-fit space-y-4 overflow-hidden rounded-3xl border border-[#E3B964]/60 bg-linear-to-b from-[#4A0F2E] to-[#2E0A1C] p-6 text-white shadow-xl shadow-[#4A0F2E]/30 lg:sticky lg:top-6">
            <h2 className="border-b border-[#E3B964]/40 pb-3 font-serif text-lg font-bold text-[#E3B964]">
              Order Summary
            </h2>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-[#F3C6D3]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-white">
                    ৳{(item.priceBDT * item.quantity).toLocaleString('en-BD')}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-[#E3B964]/40 pt-3 text-sm">
              <div className="flex justify-between text-[#F3C6D3]">
                <span>Subtotal</span>
                <span>৳{calculateSubtotal().toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between text-[#F3C6D3]">
                <span>Delivery Charge</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between border-t border-[#E3B964]/40 pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-[#E3B964]">৳{grandTotal.toLocaleString('en-BD')}</span>
              </div>
            </div>

            <p className="pt-1 text-center text-[11px] text-[#F3C6D3]/80">
              🔒 100% secure checkout · 24/7 customer support
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}