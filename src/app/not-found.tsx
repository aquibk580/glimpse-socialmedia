"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const NotFound = () => {
  const pathname = usePathname();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-slate-950 dark:text-white px-4"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Oops! Page Not Found</h2>
        <div className="max-w-md mx-auto">
          <p className="text-lg mb-4">
            The route{" "}
            <code className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-md font-mono text-red-500">
              {pathname}
            </code>{" "}
            does not exist.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for might have been removed, renamed, or is
            temporarily unavailable.
          </p>
          <Link
            href="/"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
