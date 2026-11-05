export interface SubService {
  name: string;
  icon: string;
}

export interface ServiceCategory {
  title: string;
  subservices: SubService[];
}

export const SERVICES_DATA: ServiceCategory[] = [
  {
    title: "Software & Web Dev",
    subservices: [
      { name: "Web Design", icon: "🌐" },
      { name: "Ecommerce Dev", icon: "🛒" },
      { name: "App Development", icon: "📱" },
      { name: "Software Development", icon: "💻" },
      { name: "Laravel Developer", icon: "⚡" },
      { name: "Vibe Coding", icon: "✨" },
      { name: "Landing Page", icon: "📄" },
      { name: "Domain & Hosting", icon: "☁️" }
    ]
  },
  {
    title: "Digital Marketing",
    subservices: [
      { name: "Full Digital Marketing", icon: "📈" },
      { name: "Facebook Ads", icon: "👥" },
      { name: "Google Ads", icon: "🔍" },
      { name: "YouTube Marketing", icon: "▶️" },
      { name: "TikTok Marketing", icon: "🎵" },
      { name: "Social Media Mgt", icon: "📱" },
      { name: "AI Digital Marketing", icon: "🤖" }
    ]
  },
  {
    title: "SEO & Automation",
    subservices: [
      { name: "Best SEO", icon: "⭐" },
      { name: "Local SEO", icon: "📍" },
      { name: "SMS Marketing", icon: "💬" },
      { name: "Email Marketing", icon: "✉️" },
      { name: "WhatsApp Marketing", icon: "📞" },
      { name: "Affiliate Marketing", icon: "🔗" },
      { name: "Business Automation", icon: "⚙️" },
      { name: "AI Automation", icon: "🤖" }
    ]
  },
  {
    title: "Design, Branding & IT",
    subservices: [
      { name: "Graphics Design", icon: "🎨" },
      { name: "Video Editing", icon: "✂️" },
      { name: "Content Writing", icon: "✍️" },
      { name: "Influencer Mgt", icon: "🌟" },
      { name: "POS Software", icon: "📦" },
      { name: "ERP Software", icon: "🏢" },
      { name: "IT Consultancy", icon: "🗣️" },
      { name: "Website Maintenance", icon: "🔧" }
    ]
  }
];