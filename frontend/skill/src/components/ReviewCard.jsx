
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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div className="flex items-center gap-4">

          {review?.reviewer?.profileImage ? (
            <img
              src={review.reviewer.profileImage}
              alt={review.reviewer.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue-600" />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg">
              {review?.reviewer?.name}
            </h3>

            <p className="text-sm text-gray-500">
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
                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition"
                title="Edit Review"
              >
                <Pencil size={16} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(review._id)}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
                title="Delete Review"
              >
                <Trash2 size={16} />
              </button>
            )}

          </div>
        )}

      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={
              star <= review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>

      {/* Comment */}
      <p className="mt-5 text-gray-700 leading-7">
        {review.comment}
      </p>

    </div>
  );
}

export default ReviewCard;
