import ProviderReviews from "@/components/ProviderReviews";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

interface Provider {
  id: string;
  name: string;
  username: string;
  description?: string;
  phone_number?: string;
  image_url?: string;
  rating?: number;
  city?: string;
  verified?: boolean;
}

interface Service {
  id: string;
  name: string;
  price_estimate?: number;
  description?: string;
}

interface Props {
  params: Promise<{ username: string }>;
}

const blank_profile_pic = "https://qbjgfnlpmcyxjxopsnvt.supabase.co/storage/v1/object/public/service_providers_other/blank_profile_pic.png";

export default async function ProviderPage({ params }: Props) {
    const { username } = await params;
  
    // Fetch provider info
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("username", username)
      .limit(1)
      .single();
  
    const provider = data as Provider | null;
  
    if (!provider) {
      return <p className="text-center mt-20 text-gray-700 text-xl">Provider not found.</p>;
    }
  
    // Fetch services for this provider
    const { data: dataServices, error: servicesError } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", provider.id);
  
      const services = dataServices as Service[] | null;

        // Fetch reviews (public data)
        const { data: reviews } = await supabase
        .from("reviews")
        .select("id, provider_id, user_id, user_name, rating, comment, created_at")
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false });

      return (
        <div className="relative flex flex-col items-center justify-start pt-28 sm:pt-32 md:pt-36 lg:pt-40 min-h-screen px-6 bg-gray-50">
          {/* Provider Info Card */}
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-16">
          <div className="relative w-32 h-32 md:w-60 md:h-60 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={provider.image_url || blank_profile_pic} // 👈 fallback image
                alt={provider.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left mt-4 md:mt-0 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {provider.name}
              </h1>
              {provider.verified && (
                <span className="inline-block mt-2 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-semibold">
                  Verified
                </span>
              )}
              <p className="mt-3 text-gray-700 leading-relaxed">
                {provider.description}
              </p>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start items-center gap-4">
                {provider.rating !== undefined && (
                  <p className="text-yellow-500 font-semibold">⭐ {provider.rating.toFixed(1)}</p>
                )}
                {provider.city && (
                  <p className="text-gray-500 flex items-center gap-1">
                    <span>📍</span> {provider.city}
                  </p>
                )}
                {provider.phone_number && (
                  <p className="text-gray-500 flex items-center gap-1">
                    <span>📞</span> {provider.phone_number}
                  </p>
                )}
              </div>
            </div>
          </div>
    
          {/* Services Section */}
          <section className="w-full max-w-5xl bg-gray-100 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
              Services Offered
            </h2>
            {services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {service.name}
                    </h3>
                    {service.price_estimate && (
                      <p className="text-gray-700 font-medium mb-2">
                        Rs {service.price_estimate}
                      </p>
                    )}
                    {service.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No services listed yet.</p>
            )}
          </section>

          <ProviderReviews providerId={provider.id} initialReviews={reviews || []}/>
    </div>
    );
}
  
