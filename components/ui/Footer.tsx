"use client";

import React from "react";
import FooterLogo from "./footer/FooterLogo";
import FooterNavigation from "./footer/FooterNavigation";
import FooterContact from "./footer/FooterContact";
import FooterSocial from "./footer/FooterSocial";
import FooterBottom from "./footer/FooterBottom";

import {
  HomeIcon,
  MagazineIcon,
  LibraryIcon,
  ArticlesIcon,
} from "./header/Icons";

interface FooterProps {
  locale: string;
  messages: {
    common: {
      home: string;
      magazine: string;
      dawah: string;
      library: string;
      articles: string;
    };
    rightsReserved: string;
    terms: string;
    privacy: string;
    quickLinks: string;
    contactUs: string;
    followUs: string;
    location: string;
    authorName: string;
    madeWith: string;
    by: string;
    logoText: string;
    logoDescription: string;
  };
}

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
  </svg>
);

const ContactIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-.584-1.925-1.516-3.376-2.773-4.314-1.41-1.05-3.221-1.633-5.394-1.647-3.047-.012-5.817.818-7.576 2.267-1.625 1.336-2.52 3.391-2.549 5.896v.014c.029 2.506.924 4.561 2.549 5.896 1.759 1.449 4.529 2.279 7.576 2.267 2.173-.014 3.983-.597 5.394-1.647 1.257-.938 2.189-2.389 2.773-4.314l2.04.569c-.651 2.337-1.832 4.177-3.509 5.467C17.229 23.275 14.932 23.98 12.186 24zM12 6.25c-2.5 0-4.618 1.162-5.876 3.222-.371.607-.669 1.297-.876 2.053l1.737.484c.172-.632.398-1.2.669-1.681.906-1.611 2.372-2.578 4.346-2.578 1.543 0 2.82.678 3.697 1.953.608.884.942 2.003.942 3.147 0 .757-.128 1.394-.382 1.897-.254.502-.623.859-1.097 1.058-.475.2-1.039.3-1.685.3-.646 0-1.21-.1-1.685-.3-.474-.199-.843-.556-1.097-1.058-.254-.503-.382-1.14-.382-1.897v-1.5h-1.75v1.5c0 1.144.334 2.263.942 3.147.877 1.275 2.154 1.953 3.697 1.953.646 0 1.21-.1 1.685-.3.474-.199.843-.556 1.097-1.058.254-.503.382-1.14.382-1.897 0-1.144-.334-2.263-.942-3.147C14.82 6.928 13.543 6.25 12 6.25z"/>
  </svg>
);

const WebsiteIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
  </svg>
);

const Footer = ({ locale, messages }: FooterProps) => {
  // Quick Links configuration
  const quickLinks = [
    {
      href: `/${locale}`,
      icon: <HomeIcon />,
      label: messages.common.home,
    },
    {
      href: `/${locale}/magazine`,
      icon: <MagazineIcon />,
      label: messages.common.magazine,
    },
    {
            href: `/${locale}/articles`,
            icon: <ArticlesIcon />,
            label: messages.common.articles,
    },
    {
      href: `/${locale}/library`,
      icon: <LibraryIcon />,
      label: messages.common.library,
    },
  ];

  // Contact information
  const contactInfo = [
    {
      icon: <EmailIcon />,
      text: "info@hurass.org",
    },
    {
      icon: <PhoneIcon />,
      text: "+20 100 231 5657",
    },
    {
      icon: <ContactIcon />,
      text: "Ryiuhgjh147BOT",
    },
  ];

  // Social links
  const socialLinks = [
    {
      href: "https://t.me/horrasthoghoor",
      icon: <TelegramIcon />,
      label: "Telegram",
    },
    {
      href: "https://hurass-althughur.vercel.app/ar",
      icon: <WebsiteIcon />,
      label: "Website",
    },
    {
      href: "https://www.facebook.com/share/1A5ihYmTrS/",
      icon: <FacebookIcon />,
      label: "Facebook",
    },
    {
      href: "https://x.com/horrasthoghoor?s=09",
      icon: <TwitterIcon />,
      label: "X (Twitter)",
    },
    {
      href: "https://www.instagram.com/horrasthoghoor?utm_source=qr&igsh=MXJrdGRqa3d5d3B2eA==",
      icon: <InstagramIcon />,
      label: "Instagram",
    },
    {
      href: "https://www.threads.net/@dz_14tg",
      icon: <ThreadsIcon />,
      label: "Threads",
    },
  ];
  return (
    <footer className="bg-emerald-900 text-white mt-auto">
      <div className="container mx-auto sm:px-4 px-2 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterLogo
            locale={locale}
            messages={{
              logoText: messages.logoText,
              logoDescription: messages.logoDescription,
            }}
          />
          <FooterNavigation title={messages.quickLinks} links={quickLinks} />

          <FooterContact
            title={messages.contactUs}
            contactItems={contactInfo}
            locale={locale}
          />

          <FooterSocial title={messages.followUs} socialLinks={socialLinks} />
        </div>{" "}
        <FooterBottom
          copyright={messages.rightsReserved}
          messages={{
            madeWith: messages.madeWith,
            by: messages.by,
            authorName: messages.authorName,
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;
