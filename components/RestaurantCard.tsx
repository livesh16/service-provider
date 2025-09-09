import Image from "next/image";

interface Props {
  name: string;
  description: string;
  image: string;
}

export default function RestaurantCard({ name, description, image }: Props) {
  return (
    <div className="card">
      <Image
        src={image}
        alt={name}
        width={400}
        height={250}
        className="object-cover w-full h-48"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  );
}
