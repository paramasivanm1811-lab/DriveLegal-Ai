"use client";

import { useState } from "react";
import { ShieldCheck, MapPin, Search, ExternalLink, AlertCircle } from "lucide-react";
import { CustomSelect } from "@/components/CustomSelect";

// Mock database for TN RTOs
const RTO_DATA: Record<string, string[]> = {
  "Chennai": ["TN-01 (Central)", "TN-02 (North West)", "TN-03 (North East)", "TN-04 (East)", "TN-05 (North)", "TN-06 (South East)", "TN-07 (South)", "TN-09 (West)", "TN-10 (South West)", "TN-11 (Tambaram)"],
  "Coimbatore": ["TN-37 (South)", "TN-38 (North)", "TN-39 (North)", "TN-40 (Mettupalayam)", "TN-66 (Central)", "TN-99 (West)"],
  "Madurai": ["TN-58 (South)", "TN-59 (North)", "TN-64 (Central)"],
  "Salem": ["TN-27 (Salem)", "TN-30 (Salem West)", "TN-54 (Salem East)"],
  "Tiruchirappalli": ["TN-45 (Trichy)", "TN-48 (Srirangam)", "TN-81 (Trichy East)"],
  "Kanchipuram": ["TN-21 (Kanchipuram)"],
  "Chengalpattu": ["TN-19 (Chengalpattu)", "TN-11 (Tambaram)"],
  "Tirunelveli": ["TN-72 (Tirunelveli)"],
  "Erode": ["TN-33 (Erode East)", "TN-56 (Perundurai)"],
  "Tiruppur": ["TN-39 (Tiruppur North)", "TN-42 (Tiruppur South)"],
  "Vellore": ["TN-23 (Vellore)"]
};

const TN_DISTRICTS = Object.keys(RTO_DATA).sort();

import { useStore } from "@/lib/store";

// Translations
const T = {
  en: {
    title: "Traffic Police Info & Services",
    subtitle: "Essential information on paying challans, contesting fines, and finding your local RTO in Tamil Nadu.",
    payTitle: "How to Pay a Challan Online",
    payDesc: "Traffic fines issued in Tamil Nadu can be securely paid online through the official Parivahan eChallan portal.",
    payStep1: "Visit the official eChallan Parivahan website.",
    payStep2: "Enter your Challan Number, Vehicle Number, or DL Number.",
    payStep3: "Complete the Captcha and click 'Get Detail'.",
    payStep4: "Select the pending challan and proceed with the secure payment gateway (UPI/Card/NetBanking).",
    payBtn: "Go to eChallan Portal",
    contestTitle: "How to Contest a Challan in Court",
    contestDesc: "If you believe a traffic fine was issued incorrectly, you have the right to contest it in the jurisdictional Traffic Court.",
    contestStep1: "Do not pay the fine online if you intend to contest it. Paying it implies an admission of guilt.",
    contestStep2: "Wait for the challan to be forwarded to the Virtual Traffic Court (usually within 15 days).",
    contestStep3: "You will receive an SMS from the Virtual Court. Follow the link to choose 'Contest the Challan'.",
    contestStep4: "The case will be transferred to a regular Traffic Magistrate Court in your district.",
    contestStep5: "You will need to appear in person or through a lawyer with evidence (dashcam footage, GPS logs, etc.).",
    rtoTitle: "TN RTO Finder",
    rtoDesc: "Find the Regional Transport Office codes and exact Google Maps location for your district.",
    rtoSelectLabel: "Select District",
    rtoCodesTitle: "RTO Codes in",
    rtoDisclaimer: "* For license renewal or vehicle registration, you must book an appointment slot via the Vahan/Sarathi portal online before visiting the RTO.",
    toggleLang: "தமிழில் படிக்க (Read in Tamil)"
  },
  ta: {
    title: "போக்குவரத்து காவல் தகவல் & சேவைகள்",
    subtitle: "தமிழ்நாட்டில் சலான்களை செலுத்துதல், அபராதங்களை எதிர்த்தல் மற்றும் உங்கள் உள்ளூர் RTO ஐக் கண்டறிவது பற்றிய அத்தியாவசிய தகவல்கள்.",
    payTitle: "ஆன்லைனில் சலான் செலுத்துவது எப்படி",
    payDesc: "தமிழ்நாட்டில் விதிக்கப்பட்ட போக்குவரத்து அபராதங்களை அதிகாரப்பூர்வ பரிவாஹன் இ-சலான் போர்டல் மூலம் பாதுகாப்பாக செலுத்தலாம்.",
    payStep1: "அதிகாரப்பூர்வ இ-சலான் பரிவாஹன் இணையதளத்தைப் பார்வையிடவும்.",
    payStep2: "உங்கள் சலான் எண், வாகன எண் அல்லது ஓட்டுநர் உரிம எண்ணை உள்ளிடவும்.",
    payStep3: "கேப்ட்சாவை நிரப்பி 'Get Detail' என்பதைக் கிளிக் செய்யவும்.",
    payStep4: "நிலுவையில் உள்ள சலானைத் தேர்ந்தெடுத்து, பாதுகாப்பான கட்டண நுழைவாயில் (UPI/Card/NetBanking) மூலம் தொடரவும்.",
    payBtn: "இ-சலான் போர்டலுக்குச் செல்",
    contestTitle: "நீதிமன்றத்தில் சலானை எப்படி எதிர்ப்பது (Contest)",
    contestDesc: "போக்குவரத்து அபராதம் தவறாக விதிக்கப்பட்டதாக நீங்கள் நம்பினால், அதை அதிகார வரம்பிற்குட்பட்ட போக்குவரத்து நீதிமன்றத்தில் எதிர்க்க உங்களுக்கு உரிமை உண்டு.",
    contestStep1: "நீங்கள் வழக்காட விரும்பினால் அபராதத்தை ஆன்லைனில் செலுத்த வேண்டாம். செலுத்துவது குற்றத்தை ஒப்புக்கொள்வதைக் குறிக்கும்.",
    contestStep2: "சலான் மெய்நிகர் போக்குவரத்து நீதிமன்றத்திற்கு (Virtual Court) அனுப்பப்படும் வரை காத்திருக்கவும் (பொதுவாக 15 நாட்களுக்குள்).",
    contestStep3: "மெய்நிகர் நீதிமன்றத்திலிருந்து ஒரு SMS பெறுவீர்கள். அதில் 'Contest the Challan' என்பதைத் தேர்ந்தெடுக்கவும்.",
    contestStep4: "இந்த வழக்கு உங்கள் மாவட்டத்தில் உள்ள வழக்கமான போக்குவரத்து மாஜிஸ்திரேட் நீதிமன்றத்திற்கு மாற்றப்படும்.",
    contestStep5: "நீங்கள் நேரில் அல்லது ஒரு வழக்கறிஞர் மூலம் ஆதாரங்களுடன் (dashcam வீடியோ, ஜிபிஎஸ் பதிவுகள் போன்றவை) ஆஜராக வேண்டும்.",
    rtoTitle: "தமிழ்நாடு RTO கண்டுபிடிப்பான்",
    rtoDesc: "உங்கள் மாவட்டத்திற்கான வட்டார போக்குவரத்து அலுவலக (RTO) குறியீடுகள் மற்றும் துல்லியமான கூகுள் வரைபட இருப்பிடத்தைக் கண்டறியவும்.",
    rtoSelectLabel: "மாவட்டத்தை தேர்ந்தெடுக்கவும்",
    rtoCodesTitle: "RTO குறியீடுகள்:",
    rtoDisclaimer: "* உரிமம் புதுப்பித்தல் அல்லது வாகனப் பதிவுக்கு, RTO-வுக்குச் செல்வதற்கு முன் ஆன்லைனில் Vahan/Sarathi போர்டல் மூலம் முன் அனுமதி (appointment) பெற வேண்டும்.",
    toggleLang: "Read in English"
  }
}

export default function InfoPage() {
  const [district, setDistrict] = useState("Chennai");
  const { language, toggleLanguage } = useStore();
  const t = T[language];

  const rtoList = RTO_DATA[district] || ["TN-XX (Data unavailable)"];
  
  // Safe generic map embed string
  const mapQuery = `Regional Transport Office RTO ${district} Tamil Nadu`;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex justify-end mb-4">
        <button 
          onClick={toggleLanguage}
          className="bg-gray-100 hover:bg-gray-200 text-[var(--color-brand-dark)] font-bold py-2 px-4 rounded-xl text-sm transition-colors border border-gray-200"
        >
          {t.toggleLang}
        </button>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t.title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t.subtitle}</p>
      </div>

      <div className="space-y-8">
        
        {/* eChallan Payment */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t.payTitle}</h2>
          </div>
          <div className="prose max-w-none text-gray-600">
            <p>{t.payDesc}</p>
            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>{t.payStep1}</li>
              <li>{t.payStep2}</li>
              <li>{t.payStep3}</li>
              <li>{t.payStep4}</li>
            </ol>
            <a href="https://echallan.parivahan.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[var(--color-brand-green)] text-white px-6 py-3 rounded-xl font-bold hover:bg-[var(--color-brand-green-dark)] transition-colors">
              {t.payBtn} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Contest a Challan */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t.contestTitle}</h2>
          </div>
          <div className="prose max-w-none text-gray-600">
            <p>{t.contestDesc}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t.contestStep1}</strong></li>
              <li>{t.contestStep2}</li>
              <li>{t.contestStep3}</li>
              <li>{t.contestStep4}</li>
              <li>{t.contestStep5}</li>
            </ul>
          </div>
        </section>

        {/* RTO Finder */}
        <section className="bg-[var(--color-brand-dark)] text-white p-8 rounded-3xl shadow-lg border border-gray-800 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Search className="text-[var(--color-brand-green-light)]" /> {t.rtoTitle}</h2>
            <p className="text-gray-400 mb-8 max-w-md">{t.rtoDesc}</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-300 mb-2">{t.rtoSelectLabel}</label>
                  <CustomSelect 
                    value={district} 
                    onChange={setDistrict}
                    options={TN_DISTRICTS.map(d => ({ label: d, value: d }))}
                    className="w-full max-w-sm"
                  />
                </div>
                
                <h3 className="font-bold text-white mb-3 text-lg border-b border-gray-700 pb-2">{t.rtoCodesTitle} {district}</h3>
                <div className="flex flex-wrap gap-3">
                  {rtoList.map(code => (
                    <div key={code} className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/20 transition-colors">
                      {code}
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 mt-6 italic bg-black/20 p-4 rounded-xl border border-gray-800">
                  {t.rtoDisclaimer}
                </p>
              </div>

              {/* Google Map Embed */}
              <div className="bg-gray-900 p-2 rounded-2xl border border-gray-700 shadow-inner h-64 md:h-auto min-h-[300px]">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '12px' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
