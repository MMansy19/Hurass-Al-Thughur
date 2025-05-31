"use client";

import Link from "next/link";
import Image from "next/image";
import styles from '../Header.module.css';

interface LogoProps {
  locale: string;
  messages: {
    siteName: string;
  };
}

const Logo = ({ locale, messages }: LogoProps) => {
  return (
    <Link href={`/${locale}`} className={`flex items-center group ${styles.logoAnimation}`}>
      <div className="relative overflow-hidden rounded-full border-2 border-emerald-500 md:mr-3 rtl:md:mr-0 rtl:md:ml-3 mr-2 rtl:mr-0 rtl:ml-2">
        <Image
          src="/images/logo.jpg"
          alt="Hurass Al-Thughur Logo"
          width={45}
          height={45}
          className="transition-transform group-hover:scale-110 duration-300 sm:w-12 ltr:w-10"
          priority
        />
      </div>      <span className={`font-bold ltr:text-lg text-2xl sm:text-2xl text-emerald-700 group-hover:text-emerald-800 transition-colors`}>
        {messages.siteName}
      </span>
    </Link>
  );
};

export default Logo;
