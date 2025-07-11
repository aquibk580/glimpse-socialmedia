"use client";

import React from "react";
import { useFormStatus } from "react-dom";

const DeletePostButton = () => {
  const { pending } = useFormStatus();
  return (
    <button className="text-red-500">
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
          Deleting
        </div>
      ) : (
        "Delete"
      )}
    </button>
  );
};

export default DeletePostButton;
