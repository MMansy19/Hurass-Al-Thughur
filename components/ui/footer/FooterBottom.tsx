"use client";

import Link from "next/link";

interface FooterBottomProps {
  locale: string;
  copyright: string;
}

export default function FooterBottom({ locale, copyright }: FooterBottomProps) {
  return (
    <div className="border-t border-emerald-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
      <p className="mb-4 md:mb-0 text-emerald-200">{copyright}</p>
      <div className="flex items-center space-x-2">
        <span className="text-emerald-200">
          {locale === "ar" ? "صُنع بكل حب" : "Made with"} 
          <span className="text-red-400 mx-1">❤</span> 
          {locale === "ar" ? "بواسطة" : "by"}
        </span>
        <Link 
            href="https://mahmoud-mansy.vercel.app/ar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-emerald-400 hover:text-white transition-colors"
        >
          {locale === "ar" ? "محمود المنسي" : "Mahmoud Mansy"}
        </Link>
      </div>
    </div>
  );
}
