import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  setRating: (value: number) => void;
}

export default function StarRating({ rating, setRating }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        let icon;
        if (rating >= star) {
          icon = <FaStar className="text-yellow-400" />;
        } else if (rating >= star - 0.5) {
          icon = <FaStarHalfAlt className="text-yellow-400" />;
        } else {
          icon = <FaRegStar className="text-gray-300" />;
        }

        return (
          <div key={star} className="relative cursor-pointer">
            {/* Left half */}
            <span
              className="absolute left-0 top-0 w-1/2 h-full"
              onClick={() => setRating(star - 0.5)}
            />
            {/* Right half */}
            <span
              className="absolute right-0 top-0 w-1/2 h-full"
              onClick={() => setRating(star)}
            />
            <span className="text-2xl">{icon}</span>
          </div>
        );
      })}
    </div>
  );
}
