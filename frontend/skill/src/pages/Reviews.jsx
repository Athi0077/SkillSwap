
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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">

      {/* User header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-5">
        <div className="flex items-center gap-4">
          {swapUser.profileImage ? (
            <img
              src={swapUser.profileImage}
              alt={swapUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/40"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
          )}
          <div>
            <h3 className="text-white font-bold text-lg">{swapUser.name}</h3>
            {swapUser.skillsOffered?.length > 0 && (
              <p className="text-indigo-100 text-sm mt-0.5">
                Offers: {swapUser.skillsOffered.slice(0, 2).join(", ")}
                {swapUser.skillsOffered.length > 2 ? " …" : ""}
              </p>
            )}
          </div>

          {submitted && (
            <div className="ml-auto flex items-center gap-1.5 bg-green-500/20 text-green-100 text-xs px-3 py-1 rounded-full">
              <CheckCircle size={13} />
              Reviewed
            </div>
          )}
        </div>
      </div>

      {/* Review form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4">

        {/* Star rating */}
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-2">
            Your Rating
          </label>
          <StarInput value={rating} onChange={setRating} />
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Share your experience with ${swapUser.name}…`}
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${rating > 0 && !loading
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex gap-4">

      {/* Avatar */}
      {review.reviewer?.profileImage ? (
        <img
          src={review.reviewer.profileImage}
          alt={review.reviewer.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-800 text-sm">
              {review.reviewer?.name}
            </span>
            <span className="text-slate-400 text-xs ml-2">→</span>
            <span className="text-slate-600 text-sm ml-2">
              {review.reviewee?.name}
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-xs text-slate-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
            {isOwner && (
              <button
                onClick={() => onDelete(review._id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
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
              className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}
            />
          ))}
        </div>

        {review.comment && (
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
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

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Reviews</h1>
            <p className="text-slate-500 mt-1">
              Rate and review users you've swapped skills with
            </p>
          </div>

          {/* ── Write Reviews Section ── */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
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
            <div>
              <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-indigo-500" />
                Reviews I've Written
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
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
