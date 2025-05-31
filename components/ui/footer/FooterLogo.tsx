"use client";

import Image from "next/image";
import Link from "next/link";

interface FooterLogoProps {
  locale: string;
  messages: {
    logoText: string;
    logoDescription: string;
  };
}

export default function FooterLogo({ locale, messages }: FooterLogoProps) {
  return (
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
        </div>              <span className="font-bold text-2xl text-emerald-100 group-hover:text-white transition-colors">
          {messages.logoText}
        </span>
      </Link>
      
      <p className="text-emerald-100 mt-3">
        {messages.logoDescription}
      </p>
    </div>
  );
}
