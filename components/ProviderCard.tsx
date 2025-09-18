import Image from "next/image";
import Link from "next/link";

interface Provider {
    id: string;
    name: string;
    username: string;
    description?: string;
    image_url?: string;
    rating?: number;
    city?: string;
    verified: boolean;
}

interface ProviderCardProps {
    provider: Provider;
}

export default function ProviderCard({ provider}: ProviderCardProps) {
    const {name, username, city, description, image_url, rating, verified } = provider;

    const fallbackProfilePic = "https://qbjgfnlpmcyxjxopsnvt.supabase.co/storage/v1/object/public/service_providers_other/blank_profile_pic.png";

    return (
        // We use `className="contents"` on the Link so the rendered <a> does NOT create
        // a layout box (display: contents). This prevents the anchor from changing
        // how the grid/flex container measures item sizes, so the card keeps its exact
        // layout/size while the whole card remains clickable.
        //
        // Note: display: contents can have some older-browser / assistive-technology
        // quirks — we include an accessible label (aria-label / sr-only) to be safe.
        <Link
        href={`/service-providers/${username}`}
        className="contents"
        aria-label={`View ${name}'s profile`}
        >
            <div className="card">
                <div className="relative aspect-square w-45 mx-auto rounded-full overflow-hidden bg-gray-100">
                <Image
                    src={image_url ?? fallbackProfilePic}
                    alt={name}
                    fill
                    className="object-cover"
                />
                </div>

                <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {name}
                    {verified && (
                    <span className="inline-block mt-0 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-semibold">
                        Verified
                    </span>
                    )}
                </h3>
                <p className="mt-2 text-gray-600">{description}</p>

                {/* Rating and City */}
                <div className="mt-4 flex justify-center items-center gap-10 px-4">
                    {rating !== undefined && (
                    <p className="text-yellow-500 font-semibold">⭐ {rating.toFixed(1)}</p>
                    )}
                    {city && (
                    <p className="text-gray-500 flex items-center gap-1">
                        <span>📍</span> {city}
                    </p>
                    )}
                </div>
                </div>
            </div>
        </Link>
    );
}
