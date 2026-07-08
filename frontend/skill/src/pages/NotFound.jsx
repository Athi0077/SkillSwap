import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">

        <h1 className="text-8xl font-extrabold text-blue-600">
          404
        </h1>

        <h2 className="text-3xl font-bold mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-4 leading-7">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            <Home size={20} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-xl transition"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

        </div>

      </div>

    </div>
  );
}

export default NotFound;
