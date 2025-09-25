export default function Footer() {
  const services = [
    "Sessions",
    "Community", 
    "Progress Tracking",
    "24/7 Support"
  ]

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", url: "#" },
    { name: "Instagram", icon: "📷", url: "#" },
    { name: "LinkedIn", icon: "💼", url: "#" }
  ]

  return (
    <footer className="bg-gradient-to-r from-ai-purple/10 to-ai-green/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left - Logo & Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold gradient-text">AI Therapist</h3>
            <p className="text-gray-600 leading-relaxed">
              Mental wellness powered by AI. Your compassionate companion for a healthier mind and happier life.
            </p>
          </div>

          {/* Center - Services */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-ai-purple transition-colors duration-300"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 AI Therapist. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-ai-purple text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-ai-purple text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-ai-purple text-sm transition-colors duration-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
