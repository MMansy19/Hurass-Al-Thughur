"use client";

import Link from "next/link";

interface NavLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface FooterNavigationProps {
  locale: string;
  title: string;
  links: NavLink[];
}

export default function FooterNavigation({ locale, title, links }: FooterNavigationProps) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
                <Link href={link.href} className="px-3 py-2 text-emerald-100 hover:text-white hover:bg-emerald-600 transition-colors flex items-center rounded-md" aria-label={link.label}>
              <span className="mr-2 rtl:ml-2 rtl:mr-0">{link.icon}</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
