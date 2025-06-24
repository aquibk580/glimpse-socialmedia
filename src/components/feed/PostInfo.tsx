"use client";

import { deletePost } from "@/lib/actions";
import Image from "next/image";
import React, { useState } from "react";
import DeletePostButton from "./DeletePostButton";

const PostInfo = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState<boolean>(false);
  const deletePostWithId = deletePost.bind(null, postId);
  return (
    <div className="relative">
      <Image
        src="/more.png"
        alt="more_image"
        width={16}
        height={16}
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer"
      />
      {open && (
        <div className="absolute top-4 right-0 bg-white w-32 p-4 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
          <span className="cursor-pointer">View</span>
          <span className="cursor-pointer">Re-post</span>
          <form action={deletePostWithId}>
            <DeletePostButton />
          </form>
        </div>
      )}
    </div>
  );
};

export default PostInfo;
