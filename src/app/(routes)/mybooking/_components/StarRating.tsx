import React from 'react';
import { Star as StarIcon } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange: (newRating: number) => void; // Function to handle rating change
  review: string; // Add review as a prop
  onReviewChange: (newReview: string) => void; // Function to handle review change
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onChange, review, onReviewChange }) => {
  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg ">
      {/* <h2 className="mb-2 font-bold">Rating:</h2> */}
      {/* Rating stars */}
      <div className="flex items-center">
        <span className="mr-2 text-gray-400">Poor    </span> {/* Left label */}
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => onChange(index + 1)} // Set rating based on clicked star
            className={`cursor-pointer ${rating > index ? 'text-yellow-500' : 'text-gray-400'}`}
            style={{ fontSize: '32px', margin: '0 5px' }} // Increased font size for stars
          >
            {rating > index ? (
              <StarIcon className="fill-yellow-500" />
            ) : (
              <StarIcon className="fill-none stroke-gray-400" />
            )}
          </span>
        ))}
        <span className="ml-2 text-gray-400">    Excellent</span> {/* Right label */}
      </div>

      {/* Review Input */}
      <div className="mt-4 w-full">
        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => onReviewChange(e.target.value)} // Update review text
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Write your review here..."
        />
      </div>

    </div>
  );
};
