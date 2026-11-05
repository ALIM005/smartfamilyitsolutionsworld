# 🚀 Smart Family App – ই-কমার্স, অ্যাডমিন ও মার্কেটপ্লেস ইনস্টল এবং কনফিগারেশন গাইড

এই গাইডটি **Smart Family App** প্রজেক্টের বর্তমান ফাইল কাঠামো (Next.js App Router, MongoDB Atlas, Tailwind CSS, i18n, Payment Gateway & Sundarban Courier Integration) অনুযায়ী সিস্টেম সেটআপ, এনভায়রনমেন্ট ভ্যারিয়েবল কনফিগার এবং ডিপ্লয়মেন্ট সম্পন্ন করার একটি নির্ভরযোগ্য নির্দেশিকা।

---

## ১. প্রজেক্টের ফাইল ও আর্কিটেকচার কাঠামো (File Structure)

আপনার প্রজেক্টে প্রধান মডিউলগুলো নিচের মতো সাজানো রয়েছে:

```text
smartfamily-app/
├─ app/                                # Next.js App Router (Pages & API Routes)
│  ├─ admin/                           # অ্যাডমিন ড্যাশবোর্ড পেজ (/admin)
│  ├─ api/                             # সমস্ত ব্যাকএন্ড API এন্ডপয়েন্ট
│  │  ├─ admin/                        # ব্লগ, অর্ডার, প্রোডাক্ট ও আপলোড API
│  │  ├─ auth/                         # অথেনটিকেশন API
│  │  ├─ contact/                      # কন্টাক্ট ফর্ম জমা নেওয়ার API
│  │  ├─ e-commerce/                   # ই-কমার্স স্টোর API
│  │  ├─ order/                        # অর্ডার প্রসেসিং API
│  │  ├─ payment/                      # পেমেন্ট গেটওয়ে (initiate, success, fail, cancel)
│  │  ├─ products/                     # প্রোডাক্ট লিস্ট ও ডিটেইলস API
│  │  ├─ sundarban/                    # সুন্দরবন কুরিয়ার ডেলিভারি ইন্টিগ্রেশন API
│  │  └─ sync/                         # ডাটা সিঙ্ক্রোনাইজেশন API
│  ├─ apps/                            # সাব-অ্যাপস (e-commerce, spreadsheet)
│  ├─ blog/, cart/, marketplace/, ...  # ফ্রন্টএন্ড পেজসমূহ
│  ├─ middleware.ts                    # রাউটিং ও সিকিউরিটি মিডলওয়্যার
│  ├─ robots.ts & sitemap.ts            # SEO কনফিগারেশন
├─ components/                         # রি-ইউজেবল UI কম্পোনেন্টস (Admin, Auth, Shell)
├─ lib/                                # হেলপার, অথ, ডাটাবেস ও সার্ভিস লজিক
│  ├─ db.ts & mongo.ts                 # MongoDB সংযোগ
│  ├─ email.ts                         # ইমেইল নোটিফিকেশন সেবা
│  └─ admin-auth.ts, pricing.ts, ...   # বিজনেস লজিক
├─ models/                             # Mongoose ডাটাবেস স্কিমা (BlogPost, Order, Product, User, Tenant, etc.)
└─ messages/                           # i18n বহুভাষিক সাপোর্ট (bn.json, en.json)