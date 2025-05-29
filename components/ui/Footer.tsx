import Image from "next/image";
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
  <footer className="bg-emerald-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
                      <div className="md:col-span-1">
                          <Link href={`/${locale}`} className="flex items-center group">
                              <div className="relative overflow-hidden rounded-full border-2 border-emerald-500 mx-3">
                                  <Image
                                      src="/images/logo.jpg"
                                      alt="Hurass Al-Thughur Logo"
                                      width={50}
                                      height={50}
                                      className="transition-transform group-hover:scale-110 duration-300"
                                  />
                              </div>
                              <span className="font-bold text-2xl text-emerald-700 group-hover:text-white transition-colors">
                                  {locale === "ar" ? "حُراس الثغور" : "Hurass Al-Thughur"}
                              </span>
                          </Link>
                      </div>


            <p className="text-emerald-100">
              {locale === "ar" 
                ? "منصة دعوية تسعى لنشر المعرفة الصحيحة عن الإسلام" 
                : "Islamic outreach platform seeking to spread accurate knowledge about Islam"}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2">
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-emerald-100 hover:text-white transition-colors flex items-center">
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  {locale === "ar" ? "الرئيسية" : "Home"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/magazine`} className="text-emerald-100 hover:text-white transition-colors flex items-center">
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                  </svg>
                  {locale === "ar" ? "المجلة" : "Magazine"}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/dawah`}
                  className="px-3 py-2 text-gray-800 hover:text-white hover:bg-emerald-600 rounded-md transition-all flex items-center"
                >
                  <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                  {locale === "ar" ? "الدعوة" : "Dawah"}
                </Link>
                </li>
              <li>
                <Link
                  href={`/${locale}/library`}
                  className="px-3 py-2 text-gray-800 hover:text-white hover:bg-emerald-600 rounded-md transition-all flex items-center"
                >
                  <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                  </svg>
                  {locale === "ar" ? "المكتبة" : "Library"}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2">
              {locale === "ar" ? "تواصل معنا" : "Contact Us"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 mx-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span className="text-emerald-100">info@hurass.org</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mx-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <span className="text-emerald-100">+123456789</span>
              </div>
              <div className="flex items-center">                <svg className="w-5 h-5 mx-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-emerald-100">{locale === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2">
              {locale === "ar" ? "تابعنا" : "Follow Us"}
            </h3>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="bg-emerald-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="bg-emerald-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="bg-emerald-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
              <a href="#" className="bg-emerald-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-emerald-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0 text-emerald-200">{messages.rightsReserved}</p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <Link href={`/${locale}/terms`} className="text-emerald-200 hover:text-white transition-colors">
              {messages.terms}
            </Link>
            <Link href={`/${locale}/privacy`} className="text-emerald-200 hover:text-white transition-colors">
              {messages.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
