export default function Skeleton({ className = "", rounded = "rounded-xl" }) {
  return (
    <div className={`animate-shimmer ${rounded} ${className}`} />
  );
}
