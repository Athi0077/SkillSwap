
function Loader({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`
          ${sizes[size]}
          rounded-full
          border-purple-500
          border-t-transparent
          animate-spin
        `}
      />

      {text && (
        <p className="text-gray-300 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B090F]">
        {loader}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      {loader}
    </div>
  );
}

export default Loader;
