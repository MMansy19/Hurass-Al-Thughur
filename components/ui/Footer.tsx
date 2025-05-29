import Link from "next/link";

interface FooterProps {
  locale: string;
  messages: {
    rightsReserved: string;
    terms: string;
    privacy: string;
  };
}

const Footer = ({ locale, messages }: FooterProps) => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              {locale === "ar" ? "حُراس الثغور" : "Hurass Al-Thughur"}
            </h3>
            <p className="text-gray-300">
              {locale === "ar" 
                ? "منصة دعوية تسعى لنشر المعرفة الصحيحة عن الإسلام" 
                : "Islamic outreach platform seeking to spread accurate knowledge about Islam"}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-gray-300 hover:text-white transition-colors">
                  {locale === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/magazine`} className="text-gray-300 hover:text-white transition-colors">
                  {locale === "ar" ? "المجلة" : "Magazine"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/dawah`} className="text-gray-300 hover:text-white transition-colors">
                  {locale === "ar" ? "الدعوة" : "Dawah"}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">
              {locale === "ar" ? "تواصل معنا" : "Contact Us"}
            </h3>
            <p className="text-gray-300">
              {locale === "ar" ? "البريد الإلكتروني: info@hurass.org" : "Email: info@hurass.org"}
            </p>
            <p className="text-gray-300">
              {locale === "ar" ? "الهاتف: +123456789" : "Phone: +123456789"}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">{messages.rightsReserved}</p>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <Link href={`/${locale}/terms`} className="text-gray-300 hover:text-white transition-colors">
              {messages.terms}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-gray-300 hover:text-white transition-colors">
              {messages.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
