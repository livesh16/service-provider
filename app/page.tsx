import RestaurantCard from "@/components/RestaurantCard";

export default function Home() {
  const restaurants = [
    { name: "Le Blue Lagoon", description: "Exquisite local cuisine", image: "/restaurants/le-blue-lagoon.jpg" },
    { name: "Sunset Grill", description: "Seafood delights", image: "/restaurants/sunset-grill.jpg" },
    { name: "Tropical Bites", description: "Fresh tropical flavors", image: "/restaurants/tropical-bites.jpg" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: 'url(menu.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="hero-text text-5xl md:text-6xl font-extrabold">Discover the Best Menus in Mauritius</h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 drop-shadow-md">
            Explore, taste, and enjoy your favorite restaurants.
          </p>
          <button className="btn mt-8">Explore Restaurants</button>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 px-8 bg-[var(--color-bg-light)]">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Featured Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {restaurants.map((r) => (
            <RestaurantCard
              key={r.name}
              name={r.name}
              description={r.description}
              image={r.image}
            />
          ))}
        </div>
      </section>
    </>
  );
}
