import SearchProviders from "@/components/SearchProviders";

export default function ServiceProvidersPage() {
  return (
    <div className="pt-28 sm:pt-32 md:pt-36 lg:pt-40 px-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
        Find Service Providers
      </h1>

      <SearchProviders />
    </div>
  );
}
