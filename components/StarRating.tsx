import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  setRating: (value: number) => void;
}

export default function StarRating({ rating, setRating }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          className={`cursor-pointer transition-colors ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}
