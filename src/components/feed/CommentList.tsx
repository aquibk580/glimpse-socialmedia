"use client";

import { addComment } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import React, { useOptimistic, useState } from "react";

type CommentsWithUser = Comment & { user: User };

const CommentList = ({
  comments,
  postId,
}: {
  comments: CommentsWithUser[];
  postId: number;
}) => {
  const { user } = useUser();
  const [commentState, setCommentState] =
    useState<CommentsWithUser[]>(comments);

  const [desc, setDesc] = useState<string>("");

  const add = async () => {
    if (!user || !desc) return;

    addOptimisticComment({
      id: Math.random(),
      desc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId,
      user: {
        id: user.id,
        username: "Sending Please Wait...",
        desc: "",
        avatar: user.imageUrl || "/noAvatar.png",
        Cover: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        website: "",
        school: "",
        createdAt: new Date(Date.now()),
      },
    });
    try {
      const createdComment = await addComment(postId, desc);
      setCommentState((state) => [createdComment, ...state]);
    } catch (error) {
      console.log(error);
    }
  };

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentsWithUser) => [value, ...state]
  );
  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
            alt="User_image"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            action={add}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              onChange={(e) => setDesc(e.target.value)}
            />
            <Image
              src="/emoji.png"
              alt="emoji_icon"
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </form>
        </div>
      )}
      {/* COMMENTS  */}
      <div className="">
        {/* COMMENT  */}
        {optimisticComments.map((comment: CommentsWithUser) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            {/* AVATAR  */}
            <Image
              src={comment.user.avatar || "/noAvatar.png"}
              alt="User_image"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            {/* DESC  */}
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">
                {comment.user.name && comment.user.surname
                  ? comment.user.name + " " + comment.user.surname
                  : comment.user.username}
              </span>
              <p>{comment.desc}</p>
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-4">
                  <Image
                    src="/like.png"
                    alt="User_Avatar"
                    width={12}
                    height={12}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">
                    0 <span className="hidden md:inline">Likes</span>
                  </span>
                </div>
                <div className="">Reply</div>
              </div>
            </div>
            {/* ICON  */}
            <Image
              src="/more.png"
              alt="User_Avatar"
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentList;
