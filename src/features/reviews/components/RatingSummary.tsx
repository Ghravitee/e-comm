// // features/reviews/components/RatingSummary.tsx
// import React from "react";
// import { Star } from "lucide-react";
// import type { ProductRating } from "../types";
// import { RatingStars } from "./RatingStars";

// interface RatingSummaryProps {
//   rating: ProductRating | null;
//   totalReviews?: number;
// }

// export const RatingSummary: React.FC<RatingSummaryProps> = ({ rating }) => {
//   if (!rating || rating.total_reviews === 0) {
//     return (
//       <div className="flex items-center gap-4">
//         <div className="text-center">
//           <div className="text-3xl font-bold text-gray-400">0.0</div>
//           <div className="flex items-center gap-1">
//             <Star className="w-4 h-4 text-gray-300 fill-gray-300" />
//             <Star className="w-4 h-4 text-gray-300" />
//             <Star className="w-4 h-4 text-gray-300" />
//             <Star className="w-4 h-4 text-gray-300" />
//             <Star className="w-4 h-4 text-gray-300" />
//           </div>
//           <p className="text-sm text-gray-500 mt-1">No reviews yet</p>
//         </div>
//       </div>
//     );
//   }

//   const ratingPercentages = {
//     5: (rating.rating_5 / rating.total_reviews) * 100,
//     4: (rating.rating_4 / rating.total_reviews) * 100,
//     3: (rating.rating_3 / rating.total_reviews) * 100,
//     2: (rating.rating_2 / rating.total_reviews) * 100,
//     1: (rating.rating_1 / rating.total_reviews) * 100,
//   };

//   return (
//     <div className="bg-gray-50 rounded-xl p-6">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Average Rating */}
//         <div className="text-center md:text-left">
//           <div className="text-5xl font-bold text-gray-900">
//             {rating.average_rating.toFixed(1)}
//           </div>
//           <RatingStars
//             rating={rating.average_rating}
//             size={20}
//             className="justify-center md:justify-start mt-2"
//           />
//           <p className="text-sm text-gray-500 mt-1">
//             Based on {rating.total_reviews}{" "}
//             {rating.total_reviews === 1 ? "review" : "reviews"}
//           </p>
//         </div>

//         {/* Rating Breakdown */}
//         <div className="flex-1 space-y-2">
//           {[5, 4, 3, 2, 1].map((star) => (
//             <div key={star} className="flex items-center gap-3">
//               <span className="text-sm text-gray-600 w-8">{star} ★</span>
//               <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-yellow-400 rounded-full"
//                   style={{
//                     width: `${ratingPercentages[star as keyof typeof ratingPercentages]}%`,
//                   }}
//                 />
//               </div>
//               <span className="text-sm text-gray-500 w-12">
//                 {rating[`rating_${star}` as keyof ProductRating]}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
