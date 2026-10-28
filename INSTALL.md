# ই-কমার্স স্টোর: ইনস্টল গাইড

## ১. ফাইল বসান (zip এর ফোল্ডার কাঠামো প্রজেক্টের সাথে হুবহু মেলে)

```
app/admin/layout.tsx                       নতুন
app/admin/page.tsx                         নতুন  → অ্যাডমিন প্যানেল (/admin)
app/apps/e-commerce/layout.tsx             নতুন
app/apps/e-commerce/page.tsx               নতুন  → দোকান (/apps/e-commerce)
app/api/e-commerce/route.ts                নতুন (আগের ডেমো route.ts প্রতিস্থাপন করবে)
app/api/admin/login/route.ts               নতুন
app/api/admin/products/route.ts            নতুন
app/api/admin/products/[id]/route.ts       নতুন
app/api/admin/orders/route.ts              নতুন
app/api/admin/orders/[id]/route.ts         নতুন
lib/store-config.ts  lib/pricing.ts  lib/session-token.ts  lib/rate-limit.ts
lib/mongo.ts  lib/admin-auth.ts  lib/product-input.ts  lib/serialize.ts     নতুন
models/Product.ts  models/Order.ts         আগে পাঠানো ফাইলই (অপরিবর্তিত)
```

বিদ্যমান কোনো ফাইল (`lib/db.ts`, `lib/auth.ts`, `middleware.ts`, `models/User.ts`…) বদলানো হয়নি।
`app/api/e-commerce/route.ts` আগে আপনি বসিয়ে থাকলে এটা সেটাকে প্রতিস্থাপন করবে।

## ২. Vercel Environment Variables (Settings → Environment Variables → Production, তারপর Redeploy)

| নাম | কী | উদাহরণ |
|---|---|---|
| `MONGODB_URI` | **আবশ্যক**। আপনার MongoDB কানেকশন স্ট্রিং (বিদ্যমান ভ্যারিয়েবল থাকলে সেটাই) | `mongodb+srv://...` |
| `ADMIN_PASSWORD` | **আবশ্যক**। অ্যাডমিন লগইন পাসওয়ার্ড, কমপক্ষে ১০ অক্ষর | শক্ত পাসওয়ার্ড |
| `ADMIN_SESSION_SECRET` | **আবশ্যক**। কমপক্ষে ৩২ অক্ষরের এলোমেলো স্ট্রিং | `openssl rand -base64 48` |
| `BKASH_NUMBER` / `NAGAD_NUMBER` / `ROCKET_NUMBER` | ঐচ্ছিক। সেট করলেই ওই পেমেন্ট অপশন দেখাবে (ক্যাশ অন ডেলিভারি সবসময় আছে) | `01XXXXXXXXX` |
| `STORE_VAT_PERCENT` | ঐচ্ছিক, ডিফল্ট `5`। ভ্যাট না নিলে `0` | `5` |
| `SHIPPING_INSIDE_DHAKA` / `SHIPPING_OUTSIDE_DHAKA` / `SHIPPING_EXPRESS` | ঐচ্ছিক, ডিফল্ট ১২০ / ১৮০ / ২৫০ | `100` |
| `STORE_COUPONS` | ঐচ্ছিক, ডিফল্ট কোনো কুপন নেই | নিচে দেখুন |

কুপনের উদাহরণ (একটি লাইনে লিখুন):
`[{"code":"EID10","percent":10,"maxDiscount":500,"minSubtotal":2000,"expiresAt":"2026-12-31"}]`

## ৩. প্রথমবার ব্যবহার

1. branch-এ push → Vercel প্রিভিউ খুলুন → `/admin` এ যান → পাসওয়ার্ড দিয়ে লগইন।
2. "+ নতুন প্রোডাক্ট" দিয়ে প্রোডাক্ট যোগ করুন। দাম, ডিসকাউন্ট ও স্টক প্রতিটি সারিতেই সরাসরি বদলে "সেভ" চাপলে সাথে সাথে দোকানে কার্যকর হয়।
3. `/apps/e-commerce` এ গিয়ে নিজে একটি টেস্ট অর্ডার দিন (COD), তারপর অ্যাডমিনের "অর্ডার" ট্যাবে দেখুন।
4. ঠিক থাকলে main-এ merge করুন।

## ৪. মার্জের আগে অবশ্যই দেখুন

- **বিল্ড চেক:** প্রিভিউ ডিপ্লয় সফল না হলে লগে যে টাইপ এরর দেখায় সেটা আমাকে পাঠান। (sandbox-এ `next`/`mongoose` প্যাকেজ নামানো যায়নি, তাই পুরো প্রজেক্ট কম্পাইল করে দেখা সম্ভব হয়নি।)
- **`middleware.ts`:** `/admin` ও `/api/admin/*`, `/api/e-commerce` যেন লগইন-রিডাইরেক্টে আটকে না যায়। আটকালে ওই রুটগুলো বাদ দিন।
- **`app/robots.ts`:** `disallow` তালিকায় `/admin` ও `/api/` যোগ করুন।
- **MongoDB Atlas:** Network Access-এ Vercel-এর জন্য `0.0.0.0/0` অনুমোদিত থাকতে হবে (Vercel-এর নির্দিষ্ট IP নেই)।
- **হোম পেজ:** `app/page.tsx`-এ `SHOW_ECOMMERCE_DEMO` `true` করলে বাটন আসবে (লেখা "ই-কমার্স ডেমো দেখুন" বদলে "অনলাইন শপে যান" করতে পারেন)।

## ৫. যা জানা দরকার (সীমাবদ্ধতা)

- **পেমেন্ট গেটওয়ে নেই।** bKash/Nagad/Rocket-এ গ্রাহক আপনার নম্বরে Send Money করে ট্রানজেকশন আইডি দেন; আপনি নিজের অ্যাপে মিলিয়ে অ্যাডমিন থেকে "Paid" করবেন। অনলাইন কার্ড পেমেন্ট চালু নেই (গেটওয়ে না থাকলে টাকা আদায় হয় না, তাই অপশনই রাখা হয়নি)। স্বয়ংক্রিয় পেমেন্ট চাইলে SSLCommerz/bKash API আলাদা ধাপে যোগ হবে।
- **ছবি আপলোড নেই,** ছবির https লিংক দিতে হয় (Cloudinary/ImgBB ইত্যাদিতে আপলোড করে লিংক বসান)।
- **অর্ডারের ইমেইল/SMS নোটিফিকেশন নেই,** নতুন অর্ডার অ্যাডমিন প্যানেলে দেখা যায়। আপনার `lib/email.ts` আছে, ওটার ফাংশন দেখালে অর্ডারে ইমেইল যুক্ত করে দেবো।
- **রেট-লিমিট** ইন-মেমোরি (Vercel সার্ভারলেসে সাধারণ অপব্যবহার ঠেকায়, কড়া সুরক্ষা নয়)।
- অ্যাডমিন লগইন একটি শেয়ার্ড পাসওয়ার্ডে, এক ব্যক্তির (মালিকের) জন্য। একাধিক স্টাফ ও আলাদা অনুমতি লাগলে আপনার `User`/`Tenant` মডেলের সাথে জুড়ে আলাদা ধাপে করবো।
- **মাল্টি-টেন্যান্ট নয়:** একটি দোকান, `Tenant` মডেলের সাথে যুক্ত নয়।
