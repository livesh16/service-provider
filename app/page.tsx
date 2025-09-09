// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-6 px-8 bg-white/90 backdrop-blur-md fixed top-0 z-50">
        <div className="text-2xl font-bold text-gray-900">Mauritius Menus</div>
        <ul className="flex gap-8 text-gray-700 font-medium">
          <li className="hover:text-gray-900 transition">Home</li>
          <li className="hover:text-gray-900 transition">Restaurants</li>
          <li className="hover:text-gray-900 transition">About</li>
          <li className="hover:text-gray-900 transition">Contact</li>
        </ul>
      </nav>

    {/* Hero Section */}
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: 'url(menu.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Hero Text */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Discover the Best Menus in Mauritius
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-200 drop-shadow-md">
          Explore, taste, and enjoy your favorite restaurants.
        </p>
        <button className="mt-8 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg transition">
          Explore Restaurants
        </button>
      </div>
    </section>


      {/* Featured Restaurants */}
      <section className="py-20 px-8 bg-gray-50">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Featured Restaurants
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {["Le Blue Lagoon", "Sunset Grill", "Tropical Bites"].map((restaurant) => (
            <div
              key={restaurant}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition transform"
            >
              <Image
                src={`/restaurants/${restaurant.replace(/\s/g, "-").toLowerCase()}.jpg`}
                alt={restaurant}
                width={400}
                height={250}
                className="object-cover w-full h-48"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{restaurant}</h3>
                <p className="mt-2 text-gray-600">Exquisite local cuisine.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 px-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <div className="text-lg font-semibold">Mauritius Menus</div>
          <p className="mt-4 md:mt-0 text-sm">
            &copy; {new Date().getFullYear()} Mauritius Menus. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
