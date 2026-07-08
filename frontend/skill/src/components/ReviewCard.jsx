
import { Star, Pencil, Trash2, User } from "lucide-react";

function ReviewCard({
  review,
  currentUser,
  onEdit,
  onDelete,
}) {
  const isOwner =
    currentUser?._id === review?.reviewer?._id;

  return (
    <div className="glow-card-wrapper bg-[#120F17] hover:shadow-lg transition-all duration-300 p-6 relative">

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">

        <div className="flex items-center gap-4">

          {review?.reviewer?.profileImage ? (
            <img
              src={review.reviewer.profileImage}
              alt={review.reviewer.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-indigo-900/50 flex items-center justify-center">
              <User className="text-indigo-400" />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg text-white">
              {review?.reviewer?.name}
            </h3>

            <p className="text-sm text-gray-400">
              {new Date(
                review.createdAt
              ).toLocaleDateString()}
            </p>
          </div>

        </div>

        {isOwner && (onEdit || onDelete) && (
          <div className="flex gap-2">

            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-2 rounded-lg bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-400 transition"
                title="Edit Review"
              >
                <Pencil size={16} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(review._id)}
                className="p-2 rounded-lg bg-red-900/30 hover:bg-red-800/50 text-red-400 transition"
                title="Delete Review"
              >
                <Trash2 size={16} />
              </button>
            )}

          </div>
        )}

      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-5 relative z-10">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={
              star <= review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-700"
            }
          />
        ))}
      </div>

      {/* Comment */}
      <p className="mt-5 text-gray-300 leading-7 relative z-10">
        {review.comment}
      </p>

    </div>
  );
}

export default ReviewCard;
