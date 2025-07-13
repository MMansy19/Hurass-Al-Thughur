"use client";

interface ContactItem {
  icon: React.ReactNode;
  text: string;
}

interface FooterContactProps {
  title: string;
  contactItems: ContactItem[];
  locale: string;
}

export default function FooterContact({
  title,
  contactItems,
  locale,
}: FooterContactProps) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 border-b border-emerald-700 pb-2">
        {title}
      </h3>
      <div className="space-y-3">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="mx-3 text-emerald-300">{item.icon}</span>
            <span
              dir={
                /^[\d\s\+\-\(\)]+$/.test(item.text)
                  ? "ltr"
                  : locale === "ar"
                    ? "rtl"
                    : "ltr"
              }
              className="text-emerald-100"
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
