"use client";
import React from 'react';

interface SocialLink {
    href: string;
    icon: React.ReactNode;
    label: string;
}

interface FooterSocialProps {
  title: string;
  socialLinks: SocialLink[];
}

export default function FooterSocial({ title, socialLinks }: FooterSocialProps) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2">
        {title}
      </h3>
      <div className="flex space-x-4">
        {socialLinks.map((social, index) => (
          <a 
            key={index}
            href={social.href} 
            className="bg-emerald-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors"
            aria-label={social.label}
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
