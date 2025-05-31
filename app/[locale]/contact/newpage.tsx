import ContactForm from './ContactForm';

// Simple page with correct props type
export default function ContactPage() {
  return (
    <div className="space-y-12">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Send us a message or contact us directly.
          </p>
        </div>
      </section>      <section>
        <div className="container mx-auto px-4">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
