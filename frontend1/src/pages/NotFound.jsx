import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white p-4 text-center">
      <h1 className="text-9xl font-extrabold text-purple-600 drop-shadow-lg">404</h1>
      <h2 className="text-4xl font-bold mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2 text-lg max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/" 
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition duration-300 shadow-lg hover:shadow-purple-500/50"
      >
        Go Back Home
      </Link>
    </div>
  );
}