# SIGHT Tools — IEEE SIGHT Companion Installation Guide

**এই গাইডটি আপনাকে আপনার Chrome ব্রাউজারে SIGHT Tools extension সহজেই ইনস্টল করতে সাহায্য করবে।**

## প্রাক-প্রয়োজনীয়তা (Prerequisites)

- ✅ Google Chrome ব্রাউজার (সর্বশেষ সংস্করণ)
- ✅ এই রিপোজিটরি ডাউনলোড করা (ZIP ফাইল বা Git Clone)
- ✅ আপনার কম্পিউটারে সাধারণ File access অনুমতি

---

## পদ্ধতি ১: ম্যানুয়াল ইনস্টলেশন (সহজ পদ্ধতি)

### ধাপ ১: Extension ফাইল প্রস্তুত করুন
1. এই রিপোজিটরি থেকে সমস্ত ফাইল ডাউনলোড করুন
2. একটি ফোল্ডারে সবকিছু রাখুন (যেমন: `IEEE-Extentions-main`)

### ধাপ ২: Chrome এ Developer Mode চালু করুন
1. Chrome খুলুন এবং এই URL-এ যান: `chrome://extensions/`
2. পাতার **উপরে ডানদিকে** "Developer mode" টগল চালু করুন 🔴

```
chrome://extensions/ → Developer mode (টগল ON) → লাল রঙে পরিবর্তিত হবে
```

### ধাপ ৩: Extension লোড করুন
1. ডেভেলপার মোডে, "Load unpacked" বাটন ক্লিক করুন
2. আপনার Extension ফোল্ডার (`IEEE-Extentions-main`) সিলেক্ট করুন
3. "Select Folder" ক্লিক করুন
4. ✅ Extension লোড হয়ে যাবে!

### ধাপ ৪: Extension ভেরিফাই করুন
- Extension লিস্টে "SIGHT Tools — IEEE SIGHT Companion" দেখা যাবে
- Extension আইকন Chrome টুলবারে দেখা যাবে
- Extension সফলভাবে ইনস্টল হয়েছে!

---

## পদ্ধতি ২: স্বয়ংক্রিয় ইনস্টলেশন স্ক্রিপ্ট ব্যবহার করুন

### উইন্ডোজ এর জন্য (`.bat` ফাইল)

1. `install-extension-windows.bat` ফাইলটি ডাউনলোড করুন
2. ফাইলটিতে **রাইট ক্লিক** করুন → **Run as Administrator** নির্বাচন করুন
3. স্ক্রিপ্ট স্বয়ংক্রিয়ভাবে সবকিছু করবে
4. Chrome স্বয়ংক্রিয়ভাবে খুলবে এবং Extension লোড হবে

### macOS এর জন্য (`.sh` ফাইল)

1. `install-extension-mac.sh` ফাইলটি ডাউনলোড করুন
2. Terminal খুলুন এবং এটি চালান:
```bash
chmod +x install-extension-mac.sh
./install-extension-mac.sh
```
3. স্ক্রিপ্ট কাজ করবে এবং Extension লোড হবে

### Linux এর জন্য (`.sh` ফাইল)

1. `install-extension-linux.sh` ফাইলটি ডাউনলোড করুন
2. Terminal খুলুন এবং এটি চালান:
```bash
chmod +x install-extension-linux.sh
./install-extension-linux.sh
```
3. স্ক্রিপ্ট কাজ করবে এবং Extension লোড হবে

---

## সমস্যা সমাধান (Troubleshooting)

### সমস্যা ১: "Manifest not found" ত্রুটি
**কারণ:** আপনি সঠিক ফোল্ডার সিলেক্ট করেননি যেখানে `manifest.json` আছে

**সমাধান:**
- নিশ্চিত করুন যে `manifest.json` ফাইল সরাসরি আপনার সিলেক্ট করা ফোল্ডারে আছে
- ভুল: `IEEE-Extentions-main/IEEE-Extentions-main/manifest.json`
- সঠিক: `IEEE-Extentions-main/manifest.json`

### সমস্যা ২: Extension লোড হয়নি বা দেখা যায় না
**কারণ:** Chrome সম্পূর্ণ বন্ধ হয়নি বা ক্যাশ সমস্যা

**সমাধান:**
1. Chrome সম্পূর্ণভাবে বন্ধ করুন
2. পুনরায় Chrome খুলুন
3. `chrome://extensions/` এ যান এবং Extension আবার লোড করুন

### সমস্যা ৩: Developer Mode টগল আপনি খুঁজে পাচ্ছেন না
**কারণ:** আপনি Extension পেজে নেই বা নতুন Chrome সংস্করণ

**সমাধান:**
- `chrome://extensions/` (কপি-পেস্ট করুন Address bar এ)
- উপরে ডানদিকে "Developer mode" খুঁজুন

### সমস্যা ৪: Extension এর আইকন দৃশ্যমান নয়
**কারণ:** Extension লুকানো থাকতে পারে

**সমাধান:**
1. Chrome এর টুলবারে Extensions আইকন (পাজল আকৃতি) ক্লিক করুন
2. আমাদের Extension খুঁজুন এবং "Show" ক্লিক করুন

---

## Extension ব্যবহার করা

### Extension খোলা
- Chrome টুলবারে **SIGHT Tools** আইকন ক্লিক করুন
- Popup window খুলবে সব টুলস সহ

### উপলব্ধ ফিচার
✨ **PDF টুলস**
- নিরাপদ PDF সম্পাদনা এবং রূপান্তর

📋 **VTOOLS লিঙ্ক**
- IEEE VTOOLS এ দ্রুত অ্যাক্সেস

📝 **SAR ফর্ম**
- সহজ SAR ফর্ম সম্পূর্ণকরণ

🔒 **স্থানীয় ডেটা**
- সব ডেটা আপনার কম্পিউটারে থাকে, কোন সার্ভার প্রয়োজন নেই

---

## আপডেট এবং রক্ষণাবেক্ষণ

### নতুন সংস্করণ ইনস্টল করতে
1. রিপোজিটরি থেকে সর্বশেষ ফাইল ডাউনলোড করুন
2. `chrome://extensions/` এ যান
3. পুরাতন Extension সরান (Delete বাটন)
4. নতুন ফোল্ডার লোড করুন

### Extension আনলোড করতে
1. `chrome://extensions/` এ যান
2. "SIGHT Tools" খুঁজুন
3. **Remove** বাটন ক্লিক করুন

---

## নিরাপত্তা এবং গোপনীয়তা

🔐 **এই Extension নিরাপদ কারণ:**
- সম্পূর্ণ Open Source (সোর্স কোড খোলা)
- কোন সার্ভারে ডেটা পাঠায় না
- সব প্রক্রিয়া আপনার ডিভাইসে হয়
- কোন বিজ্ঞাপন বা ট্র্যাকিং নেই
- IEEE এর সরকারী সহযোগী

---

## সহায়তা এবং প্রতিক্রিয়া

ℹ️ **সমস্যা বা পরামর্শ থাকলে:**
- GitHub Issues এ একটি Issue খুলুন
- বিস্তারিত ত্রুটির বর্ণনা দিন
- আপনার Chrome সংস্করণ উল্লেখ করুন
- স্ক্রিনশট/ভিডিও যোগ করুন (সাহায্য করবে)

---

## দ্রুত রেফারেন্স চেকলিস্ট

- [ ] Chrome খোলা
- [ ] `chrome://extensions/` ভিজিট করা
- [ ] Developer Mode চালু করা (লাল টগল)
- [ ] "Load unpacked" ক্লিক করা
- [ ] Extension ফোল্ডার সিলেক্ট করা
- [ ] Extension লোড নিশ্চিত করা
- [ ] Chrome টুলবারে আইকন দেখা
- [ ] ✅ সম্পন্ন!

---

**ধন্যবাদ SIGHT Tools ব্যবহার করার জন্য!** 🙏

**Version:** 1.1.0 | **Last Updated:** 2026
