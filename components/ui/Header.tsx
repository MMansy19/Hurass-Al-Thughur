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
  
  return (    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
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
            <span className="font-bold text-2xl text-emerald-700 group-hover:text-emerald-800 transition-colors">
              {isArabic ? "حُراس الثغور" : "Hurass Al-Thughur"}
            </span>
          </Link>
        </div>
        
        <nav className="flex-grow flex justify-center mx-4">
          <ul className="flex flex-wrap justify-center gap-1 md:gap-4">
            <li>
              <Link 
                href={`/${locale}`}
                className="px-3 py-2 text-gray-800 hover:text-white hover:bg-emerald-600 rounded-md transition-all flex items-center"
              >
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                {messages.home}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${locale}/magazine`}
                className="px-3 py-2 text-gray-800 hover:text-white hover:bg-emerald-600 rounded-md transition-all flex items-center"
              >
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                </svg>
                {messages.magazine}
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
                {messages.dawah}
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
                {messages.library}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${locale}/contact`}
                className="px-3 py-2 text-gray-800 hover:text-white hover:bg-emerald-600 rounded-md transition-all flex items-center"
              >
                <svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                {messages.contact}
              </Link>
            </li>
          </ul>
        </nav>
        
        <Link
          href={`/${oppositeLocale}`}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-sm"
        >          <svg className="w-5 h-5 mx-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"></path>
          </svg>
          {messages.switchLanguage}
        </Link>
      </div>
    </header>
  );
};

export default Header;
