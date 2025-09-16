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
              {/* Left half clickable area (invisible).
                - Covers the left 50% of the star box
                - When clicked, sets rating to (star - 0.5)
                - Example: clicking left side of star #4 => rating = 3.5 */}
            <span
              className="absolute left-0 top-0 w-1/2 h-full"
              onClick={() => setRating(star - 0.5)}
            />
             {/* Right half clickable area (invisible).
                - Covers the right 50% of the star box
                - When clicked, sets rating to (star)
                - Example: clicking right side of star #4 => rating = 4 */}
            <span
              className="absolute right-0 top-0 w-1/2 h-full"
              onClick={() => setRating(star)}
            />
             {/* The actual star icon (always visible).
            - Sits underneath the invisible spans
            - Gets colored yellow or gray depending on current rating */}
            <span className="text-2xl">{icon}</span>
          </div>
        );
      })}
    </div>
  );
}
