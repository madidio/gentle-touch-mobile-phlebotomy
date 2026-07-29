import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500">404</p>

        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          Page not found
        </h1>

        <p className="mt-4 text-gray-600">
          The page you requested does not exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}