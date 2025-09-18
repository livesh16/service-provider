import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 px-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          About Our Platform
        </h1>
        <p className="text-lg text-gray-700 mb-12 text-center">
          We’re building a simple and transparent way for people to discover and
          connect with trusted service providers in their area. Whether you’re
          looking for home repairs, personal services, or professional help —
          our platform makes it easy to browse and compare providers.
        </p>

        {/* How it works */}
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How It Works
          </h2>
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>
              <span className="font-medium">For Customers:</span> Search and
              filter services by category, view provider details, and find the
              right fit for your needs.
            </li>
            <li>
              <span className="font-medium">For Providers:</span> Share your
              expertise with potential clients. Profiles can be added by
              reaching out to us directly via email (see below).
            </li>
            <li>
              <span className="font-medium">Transparency:</span> We highlight
              key details like pricing, city, and ratings so you can make
              informed choices quickly.
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-gray-600 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-200 mb-6">
            Whether you’re a customer with questions or a provider looking to
            join, here’s how you can reach us:
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* General contact */}
            <Link
              href="mailto:contact@mauserve.com"
              className="inline-block px-6 py-3 bg-white !text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              General Inquiries
            </Link>

            {/* Provider registration */}
            <Link
              href="mailto:register@mauserve.com"
              className="inline-block px-6 py-3 bg-white !text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Provider Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
