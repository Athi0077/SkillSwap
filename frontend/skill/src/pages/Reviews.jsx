
import { useEffect, useState } from "react";
import { Star, User, Send, CheckCircle, MessageSquare } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { toast } from "react-hot-toast";

import {
  getMyReviews,
  getAcceptedSwapUsers,
  createReview,
  deleteReview,
} from "../services/reviewService";

import { fireConfetti } from "../utils/confetti";

import { useAuth } from "../context/AuthContext";

/* ── Star Rating Input ── */
function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={26}
            className={
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

/* ── Review Form Card (for each accepted swap user) ── */
function ReviewFormCard({ swapUser, existingReview, onSubmit }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    setLoading(true);
    try {
      await onSubmit({ revieweeId: swapUser._id, rating, comment });
      setSubmitted(true);
      if (rating === 5) {
        fireConfetti();
      }
      toast.success("Review submitted!");
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const initials = swapUser.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="glow-card-wrapper bg-[#120F17] hover:shadow-lg transition-all duration-300 overflow-hidden relative">

      {/* User header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 relative z-10">
        <div className="flex items-center gap-4">
          {swapUser.profileImage ? (
            <img
              src={swapUser.profileImage}
              alt={swapUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#120F17]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-black/20 border-2 border-[#120F17] flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-white font-bold text-lg">{swapUser.name}</h3>
            {swapUser.skillsOffered?.length > 0 && (
              <p className="text-indigo-200 text-sm mt-0.5">
                Offers: {swapUser.skillsOffered.slice(0, 2).join(", ")}
                {swapUser.skillsOffered.length > 2 ? " …" : ""}
              </p>
            )}
          </div>

          {submitted && (
            <div className="ml-auto flex items-center gap-1.5 bg-green-500/20 text-green-300 border border-green-500/30 text-xs px-3 py-1 rounded-full">
              <CheckCircle size={13} />
              Reviewed
            </div>
          )}
        </div>
      </div>

      {/* Review form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4 relative z-10">

        {/* Star rating */}
        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">
            Your Rating
          </label>
          <StarInput value={rating} onChange={setRating} />
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-semibold text-gray-400 block mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Share your experience with ${swapUser.name}…`}
            rows={3}
            className="w-full bg-[#1E1A29] border border-[#2F293A] text-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none placeholder-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${rating > 0 && !loading
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              : "bg-[#2F293A] text-gray-500 cursor-not-allowed"
            }`}
        >
          <Send size={15} />
          {loading ? "Submitting…" : submitted ? "Update Review" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

/* ── Submitted Review Display Card ── */
function ReviewDisplayCard({ review, currentUserId, onDelete }) {
  const isOwner = String(review.reviewer?._id) === String(currentUserId);
  const initials = review.reviewer?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="glow-card-wrapper bg-[#120F17] rounded-2xl p-5 flex gap-4 relative">

      {/* Avatar */}
      {review.reviewer?.profileImage ? (
        <img
          src={review.reviewer.profileImage}
          alt={review.reviewer.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0 relative z-10"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold flex-shrink-0 relative z-10">
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-semibold text-white text-sm">
              {review.reviewer?.name}
            </span>
            <span className="text-gray-500 text-xs ml-2">→</span>
            <span className="text-gray-400 text-sm ml-2">
              {review.reviewee?.name}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            {isOwner && (
              <button
                onClick={() => onDelete(review._id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}
            />
          ))}
        </div>

        {review.comment && (
          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
            {review.comment}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Main Reviews Page ── */
function Reviews() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [swapUsers, setSwapUsers] = useState([]);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [usersRes, reviewsRes] = await Promise.all([
        getAcceptedSwapUsers(),
        getMyReviews(),
      ]);
      setSwapUsers(usersRes.users || []);
      setMyReviews(reviewsRes.reviews || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async ({ revieweeId, rating, comment }) => {
    await createReview({ reviewee: revieweeId, rating, comment });
    // Refresh reviews list
    const res = await getMyReviews();
    setMyReviews(res.reviews || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(id);
    setMyReviews((prev) => prev.filter((r) => r._id !== id));
  };

  // Find existing review for each swap user
  const getExistingReview = (userId) =>
    myReviews.find(
      (r) => String(r.reviewee?._id) === String(userId)
    ) || null;

  if (loading) return <LoadingSpinner fullScreen message="Loading reviews..." />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        {/* <Sidebar /> */}

        <main className="flex-1 p-8">

          {/* Header */}
          <div className="mb-8 relative z-10">
            <h1 className="text-3xl font-bold text-white">Reviews</h1>
            <p className="text-gray-400 mt-1">
              Rate and review users you've swapped skills with
            </p>
          </div>

          {/* ── Write Reviews Section ── */}
          <div className="mb-10 relative z-10">
            <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-yellow-400" />
              Write a Review
            </h2>

            {swapUsers.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {swapUsers.map((swapUser) => (
                  <ReviewFormCard
                    key={swapUser._id}
                    swapUser={swapUser}
                    existingReview={getExistingReview(swapUser._id)}
                    onSubmit={handleSubmitReview}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No accepted swaps yet" 
                message="Once someone accepts your swap request, they'll appear here for review." 
                icon={User} 
              />
            )}
          </div>

          {/* ── My Submitted Reviews Section ── */}
          {myReviews.length > 0 && (
            <div className="relative z-10">
              <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-purple-400" />
                Reviews I've Written
                <span className="bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  {myReviews.length}
                </span>
              </h2>

              <div className="space-y-3">
                {myReviews.map((review) => (
                  <ReviewDisplayCard
                    key={review._id}
                    review={review}
                    currentUserId={user?._id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}

export default Reviews;
