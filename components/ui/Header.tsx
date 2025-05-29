import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  locale: string;
  messages: {
    language: string;
    switchLanguage: string;
    home: string;
    magazine: string;
    dawah: string;
    library: string;
    contact: string;
  };
}

const Header = ({ locale, messages }: HeaderProps) => {
  const isArabic = locale === "ar";
  // The opposite locale for language switching
  const oppositeLocale = isArabic ? "en" : "ar";
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href={`/${locale}`} className="flex items-center">
            <Image 
              src="/globe.svg" 
              alt="Hurass Logo" 
              width={40} 
              height={40} 
              className="mr-2" 
            />
            <span className="font-bold text-2xl text-emerald-700">
              {isArabic ? "حُراس الثغور" : "Hurass"}
            </span>
          </Link>
        </div>
        
        <nav className="flex-grow flex justify-center mx-4">
          <ul className="flex flex-wrap justify-center gap-2 md:gap-8">
            <li>
              <Link 
                href={`/${locale}`}
                className="px-3 py-2 text-gray-800 hover:text-emerald-700 transition-colors"
              >
                {messages.home}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${locale}/magazine`}
                className="px-3 py-2 text-gray-800 hover:text-emerald-700 transition-colors"
              >
                {messages.magazine}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${locale}/dawah`}
                className="px-3 py-2 text-gray-800 hover:text-emerald-700 transition-colors"
              >
                {messages.dawah}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${locale}/library`}
                className="px-3 py-2 text-gray-800 hover:text-emerald-700 transition-colors"
              >
                {messages.library}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${locale}/contact`}
                className="px-3 py-2 text-gray-800 hover:text-emerald-700 transition-colors"
              >
                {messages.contact}
              </Link>
            </li>
          </ul>
        </nav>
        
        <Link
          href={`/${oppositeLocale}${locale === 'ar' ? '' : ''}`}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          {messages.switchLanguage}
        </Link>
      </div>
    </header>
  );
};

export default Header;
