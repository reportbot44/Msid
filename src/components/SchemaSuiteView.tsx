import React, { useState } from 'react';
import { 
  Code, 
  FileJson, 
  Copy, 
  Check, 
  Sparkles, 
  Home, 
  ShoppingBag, 
  Tag, 
  Download, 
  Eye, 
  Plus, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { DatabaseSchema } from '../types';

interface SchemaSuiteViewProps {
  db: DatabaseSchema;
  isDarkMode: boolean;
}

export default function SchemaSuiteView({ db, isDarkMode }: SchemaSuiteViewProps) {
  const [schemaType, setSchemaType] = useState<'Product' | 'FAQPage' | 'Article' | 'LocalBusiness'>('LocalBusiness');
  const [copied, setCopied] = useState(false);

  // States for 'LocalBusiness' interior design studio
  const [localName, setLocalName] = useState('MS Interior Decorator');
  const [localAddress, setLocalAddress] = useState('12, Outer Ring Rd, HSR Layout, Sector 6');
  const [localCity, setLocalCity] = useState('Bengaluru');
  const [localState, setLocalState] = useState('Karnataka');
  const [localPincode, setLocalPincode] = useState('560102');
  const [localPhone, setLocalPhone] = useState('+91 98765 43210');
  const [localOpeningHours, setLocalOpeningHours] = useState('Mo-Sa 09:00-19:00');
  const [localServices, setLocalServices] = useState('Modular Kitchens, Living Room Makeovers, Luxury Bedroom Wardrobes, Ceiling Layouts, Complete Home Renovation');

  // States for 'Product' decor schema input
  const [decorName, setDecorName] = useState('Japanese Minimalist Walnut Armchair');
  const [decorBrand, setDecorBrand] = useState('Muji Classic');
  const [decorPrice, setDecorPrice] = useState('480.00');
  const [decorCurrency, setDecorCurrency] = useState('USD');
  const [decorInStock, setDecorInStock] = useState(true);
  const [decorMaterial, setDecorMaterial] = useState('Solid Walnut, Hemp Cord');
  const [decorUrl, setDecorUrl] = useState('https://interior-silo.com/catalog/walnut-armchair');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600');

  // States for 'FAQPage' design query schema
  const [faqs, setFaqs] = useState([
    {
      question: "How do I optimize a living room for a Japandi look?",
      answer: "Focus on clean straight lines, raw wooden textures, soft warm whites, and functional low-profile furniture modules."
    },
    {
      question: "What is organic biophilic interior planning?",
      answer: "It incorporates direct botanical integrations, daylight-aligned spatial configurations, and non-synthetic materials that mirror nature."
    }
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // States for 'Article' post blueprint schema
  const [articleTitle, setArticleTitle] = useState('10 Warm Interior Trends Shaking Up High-End Residential Designs');
  const [authorName, setAuthorName] = useState('Evelyn Thorne (Lead Stylist)');
  const [publisherName, setPublisherName] = useState('Silo Interior Design Studio');
  const [datePublished, setDatePublished] = useState(new Date().toISOString().split('T')[0]);

  // Automated content assistant generator using seed data
  const handleAIFillForm = () => {
    if (schemaType === 'Product') {
      const randomDecor = [
        { name: "Organic Jute Biophilic Rug", brand: "EcoWeave", price: "299.00", material: "105% Natural Eco Jute fibers", url: "https://interior-silo.com/catalog/jute-rug" },
        { name: "Nordic Minimalist Oak Island", brand: "Kobenhavn Design", price: "1850.00", material: "FSC Oak Wood, Steel fittings", url: "https://interior-silo.com/catalog/oak-island" },
        { name: "Moody Antique Brass Sconce", brand: "Verona Lights", price: "175.50", material: "Solid Antiqued Brass, LED module", url: "https://interior-silo.com/catalog/brass-scone" }
      ];
      const match = randomDecor[Math.floor(Math.random() * randomDecor.length)];
      setDecorName(match.name);
      setDecorBrand(match.brand);
      setDecorPrice(match.price);
      setDecorMaterial(match.material);
      setDecorUrl(match.url);
    } else if (schemaType === 'FAQPage') {
      setFaqs([
        { question: "What are the core colors of Moody Traditional style?", answer: "Deep forest green, burnt amber, charcoal slate, and warm dark copper tones." },
        { question: "Are modular credenzas better for small layouts?", answer: "Yes, because raised legs allow daylight to travel across the floor, simulating architectural depth." }
      ]);
    } else {
      if (db.posts && db.posts.length > 0) {
        const topPost = db.posts[0];
        setArticleTitle(topPost.title);
        setDatePublished(topPost.createdAt.split('T')[0]);
      }
    }
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setFaqs([...faqs, { question: newQuestion.trim(), answer: newAnswer.trim() }]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Compile JSON-LD accurately
  const generateJSONLD = () => {
    if (schemaType === 'LocalBusiness') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "name": localName,
        "image": [
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
        ],
        "@id": `https://${db.domain || "msinteriordecorator.in"}#business`,
        "url": `https://${db.domain || "msinteriordecorator.in"}`,
        "telephone": localPhone,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": localAddress,
          "addressLocality": localCity,
          "addressRegion": localState,
          "postalCode": localPincode,
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 12.9141,
          "longitude": 77.6413
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "19:00"
        },
        "sameAs": [
          `https://www.facebook.com/${localName.toLowerCase().replace(/\s+/g, "")}`,
          `https://www.instagram.com/${localName.toLowerCase().replace(/\s+/g, "")}`
        ],
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": localCity
          }
        ],
        "knowsAbout": localServices.split(",").map(s => s.trim())
      }, null, 2);
    } else if (schemaType === 'Product') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": decorName,
        "image": [imageUrl],
        "description": `Premium interior decor item: ${decorName} composed of ${decorMaterial}. Optimized stylings by expert content silos.`,
        "brand": {
          "@type": "Brand",
          "name": decorBrand
        },
        "offers": {
          "@type": "Offer",
          "url": decorUrl,
          "priceCurrency": decorCurrency,
          "price": parseFloat(decorPrice) || 0,
          "itemCondition": "https://schema.org/NewCondition",
          "availability": decorInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        "material": decorMaterial
      }, null, 2);
    } else if (schemaType === 'FAQPage') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }, null, 2);
    } else {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": articleTitle,
        "image": [
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
        ],
        "datePublished": `${datePublished}T08:00:00+00:00`,
        "author": {
          "@type": "Person",
          "name": authorName
        },
        "publisher": {
          "@type": "Organization",
          "name": publisherName,
          "logo": {
            "@type": "ImageObject",
            "url": "https://interior-silo.com/logo.png"
          }
        }
      }, null, 2);
    }
  };

  const codeString = generateJSONLD();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([codeString], { type: 'application/ld+json' });
    element.href = URL.createObjectURL(file);
    element.download = `${schemaType.toLowerCase()}_schema.jsonld`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro branding banner */}
      <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded">
              GOOGLE SEARCH AUTOMATION
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-500">JSON-LD 1.1 Support</span>
          </div>
          <h2 className={`text-lg font-bold uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            AI Structured Schema Master Suite
          </h2>
          <p className="text-xs text-slate-500 leading-normal max-w-2xl">
            Sells tickets into Google Rich Snippets & Search carousel indexes. Build validated scripts instantly to boost crawl visibility for high-end boutique interior blogs and luxury decor shops.
          </p>
        </div>

        <button
          onClick={handleAIFillForm}
          className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Form Auto-pilot</span>
        </button>
      </div>

      {/* Selector layout bar */}
      <div className="flex flex-wrap gap-2.5">
        {[
          { id: 'LocalBusiness', label: 'Local Decorator Agency (Service/LocalBusiness)', icon: Home },
          { id: 'Product', label: 'Home Decor Catalog (Product)', icon: ShoppingBag },
          { id: 'FAQPage', label: 'Interior Guideline FAQs', icon: Tag },
          { id: 'Article', label: 'Pillar SEO Article (NewsArticle)', icon: FileJson }
        ].map((btn) => {
          const Icon = btn.icon;
          const isSelected = schemaType === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setSchemaType(btn.id as any)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/15'
                  : (isDarkMode ? 'bg-[#0f1218] text-slate-400 hover:text-slate-200 border border-slate-850' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200')
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column: Parameters Builder form */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/10">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs uppercase font-mono tracking-wider font-extrabold text-slate-300">
              {schemaType} Metadata Constructor
            </h3>
          </div>

          {/* Render forms conditionally */}
          {schemaType === 'LocalBusiness' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Agency / Studio Name</label>
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Contact Telephone Phone</label>
                  <input
                    type="text"
                    value={localPhone}
                    onChange={(e) => setLocalPhone(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Office Street Address</label>
                <input
                  type="text"
                  value={localAddress}
                  onChange={(e) => setLocalAddress(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">City</label>
                  <input
                    type="text"
                    value={localCity}
                    onChange={(e) => setLocalCity(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">State</label>
                  <input
                    type="text"
                    value={localState}
                    onChange={(e) => setLocalState(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Postal Pincode</label>
                  <input
                    type="text"
                    value={localPincode}
                    onChange={(e) => setLocalPincode(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Specialized Decor Services Offered (Comma Seperated)</label>
                <textarea
                  value={localServices}
                  onChange={(e) => setLocalServices(e.target.value)}
                  rows={2}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>
          )}

          {schemaType === 'Product' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Product Brand</label>
                  <input
                    type="text"
                    value={decorBrand}
                    onChange={(e) => setDecorBrand(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Catalog Model Name</label>
                  <input
                    type="text"
                    value={decorName}
                    onChange={(e) => setDecorName(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Offer Price</label>
                  <input
                    type="text"
                    value={decorPrice}
                    onChange={(e) => setDecorPrice(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Currency</label>
                  <select
                    value={decorCurrency}
                    onChange={(e) => setDecorCurrency(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Stock State</label>
                  <select
                    value={decorInStock ? 'true' : 'false'}
                    onChange={(e) => setDecorInStock(e.target.value === 'true')}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="true">Available / In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Materials Composition</label>
                <input
                  type="text"
                  value={decorMaterial}
                  onChange={(e) => setDecorMaterial(e.target.value)}
                  placeholder="e.g. Oak wood, Natural Linen"
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Direct Buy Link URL</label>
                <input
                  type="text"
                  value={decorUrl}
                  onChange={(e) => setDecorUrl(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Catalog Mock Photo Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>
          )}

          {schemaType === 'FAQPage' && (
            <div className="space-y-4 text-xs font-sans">
              
              {/* FAQ list list */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase font-extrabold text-slate-400">Current Structured FAQs ({faqs.length})</span>
                {faqs.map((faq, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border relative ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-850' : 'bg-slate-50 border-slate-150'
                  }`}>
                    <button
                      onClick={() => handleRemoveFaq(idx)}
                      className="absolute top-2.5 right-2.5 text-rose-400 hover:text-rose-500"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className="font-bold text-indigo-400 pr-6">Q: {faq.question}</p>
                    <p className="text-slate-400 mt-1 pl-3.5 border-l border-slate-800/10">A: {faq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Add FAQ inline form */}
              <form onSubmit={handleAddFaq} className={`p-4 rounded-xl border space-y-3 ${
                isDarkMode ? 'bg-[#0a0c10]/40 border-slate-850' : 'bg-slate-100/50 border-slate-200'
              }`}>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Assemble Custom FAQ Block</span>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500">Question Text</label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. Does modular travertine scratch?"
                    className={`w-full p-2 rounded border text-xs focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500">Structured Answer</label>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="e.g. Yes, travertine is porous; apply standard sealant layers..."
                    rows={2}
                    className={`w-full p-2 rounded border text-xs focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-indigo-650 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Push Into Schema Payload</span>
                </button>
              </form>
            </div>
          )}

          {schemaType === 'Article' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Pillar Article Title</label>
                <input
                  type="text"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Stylist / Author</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Date Published</label>
                  <input
                    type="date"
                    value={datePublished}
                    onChange={(e) => setDatePublished(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                      isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Publisher Organization Name</label>
                <input
                  type="text"
                  value={publisherName}
                  onChange={(e) => setPublisherName(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-indigo-500 outline-none font-mono ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>
          )}

          <div className={`p-4 rounded-xl flex gap-3 ${
            isDarkMode ? 'bg-indigo-950/25 border border-indigo-900/30' : 'bg-slate-50 border border-slate-200'
          }`}>
            <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-normal">
              <strong>Tip:</strong> Injecting structured data schemas creates high-quality semantic ties which search bots parse quickly. Simply paste the JSON-LD script block compiled in the right window into your layout header!
            </p>
          </div>
        </div>

        {/* Right column: Copied Code, JSON Preview & Actions */}
        <div className="space-y-4">
          
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0f1218] border-slate-800' : 'bg-white border-slate-200'} space-y-4 flex flex-col h-full`}>
            
            {/* Header with actions */}
            <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/10">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-slate-300">Live JSON-LD Compiler Output</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : (isDarkMode ? 'bg-[#0a0c10] border border-slate-850 text-slate-300 hover:text-white' : 'bg-slate-50 border border-slate-205 text-slate-705 hover:bg-slate-100')
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied Script!' : 'Copy Script'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  title="Download configuration"
                  className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                    isDarkMode ? 'bg-[#0a0c10] border-slate-850 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-205 text-slate-605 hover:text-slate-805'
                  }`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code canvas viewport */}
            <div className="flex-grow">
              <pre className={`p-4 rounded-xl border text-[11px] font-mono overflow-auto h-[320px] max-h-[380px] leading-relaxed select-text ${
                isDarkMode ? 'bg-[#0a0c10]/80 border-slate-850 text-emerald-300' : 'bg-slate-900 border-slate-900 text-emerald-400'
              }`}>
                <code>{codeString}</code>
              </pre>
            </div>

            {/* Simulated Live Search Carousel Snippet Mock */}
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0a0c10]/45 border-slate-850' : 'bg-slate-50 border-slate-150'} space-y-3`}>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-wide">
                <span>SIMULATED SEARCH ENGINE CAROUSEL OUTCOME:</span>
                <span className="text-emerald-400 font-bold uppercase tracking-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> RICH SNIPPET PASSED
                </span>
              </div>

              {schemaType === 'LocalBusiness' && (
                <div className="p-3 bg-white text-slate-800 rounded-lg shadow-sm border border-slate-200/50 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase select-none">Business Profile</span>
                      <h5 className="font-bold text-slate-900 text-sm leading-tight mt-1">{localName}</h5>
                      <p className="text-[10px] text-slate-550 mt-0.5 font-sans">{localAddress}, {localCity}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 text-amber-500 text-[11px] justify-end font-bold select-none">
                        <span>★★★★★</span>
                        <span className="text-[9px] text-slate-500 font-mono ml-1">(4.9/5)</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 font-bold font-mono">Verified Local Listings</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 border-t border-dashed border-slate-200 pt-2 select-none">
                    {localServices.split(",").slice(0, 3).map((svc, sidx) => (
                      <span key={sidx} className="bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded font-mono text-[9px] text-slate-600">
                        {svc}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-600 font-mono">
                    <span className="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-bold">{localPhone}</span>
                    <span className="text-slate-500 font-medium">Open Hours: {localOpeningHours}</span>
                  </div>
                </div>
              )}

              {schemaType === 'Product' && (
                <div className="p-3 bg-white text-slate-800 rounded-lg shadow-sm border border-slate-200/50 flex gap-3 text-xs">
                  <img 
                    src={imageUrl} 
                    alt="preview" 
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded bg-slate-100" 
                  />
                  <div>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase">{decorBrand}</span>
                    <h5 className="font-bold text-slate-900 leading-tight">{decorName}</h5>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-mono">
                      <span className="bg-slate-100 px-1 py-0.5 rounded font-bold">{decorCurrency} {decorPrice}</span>
                      <span className="text-emerald-600 font-bold">✓ In stock</span>
                    </div>
                  </div>
                </div>
              )}

              {schemaType === 'FAQPage' && (
                <div className="bg-white text-slate-800 p-3 rounded-lg shadow-sm border border-slate-200/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold">
                    <span>Google People Also Ask</span>
                  </div>
                  {faqs.slice(0, 1).map((faq, idx) => (
                    <details key={idx} className="text-xs open pb-1">
                      <summary className="font-semibold text-slate-800 list-none flex justify-between items-center cursor-pointer hover:text-indigo-600 select-none">
                        <span>{faq.question}</span>
                        <span className="text-[10px] text-slate-400">▼</span>
                      </summary>
                      <p className="text-slate-600 mt-1 pl-2 border-l-2 border-slate-200 leading-relaxed font-sans">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              )}

              {schemaType === 'Article' && (
                <div className="bg-white text-slate-800 p-3 rounded-lg shadow-sm border border-slate-200/50 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] bg-slate-100 px-1.5 rounded font-bold text-slate-500 uppercase">{publisherName}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{datePublished}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 line-clamp-2 hover:underline cursor-pointer">{articleTitle}</h5>
                  <p className="text-[10px] text-slate-500 mt-1.5">By {authorName}</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
