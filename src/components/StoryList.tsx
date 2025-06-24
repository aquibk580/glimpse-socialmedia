"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Story, User } from "@prisma/client";
import { Plus, PlusCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useOptimistic, useState } from "react";

type StoryWithUser = Story & { user: User };

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState<StoryWithUser[]>(stories);
  const [img, setImg] = useState<any>();

  const { user, isLoaded } = useUser();

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value: StoryWithUser) => [value, ...state]
  );

  const add = async () => {
    if (!img.secure_url) return;

    addOptimisticStory({
      id: Math.random(),
      img: img.secure_url,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,

      user: {
        id: userId,
        username: "Sending...",
        desc: "",
        avatar: user?.imageUrl || "/noAvatar.png",
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
      const createdStory = await addStory(img?.secure_url);
      setStoryList((state) => [createdStory, ...state]);
      setImg(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col items-center gap-2 cursor-pointer relative group">
              <div className="relative">
                <Image
                  src={img?.secure_url || user?.imageUrl || "/noAvatar.png"}
                  onClick={() => open()}
                  alt="story_icon"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full ring-2 ring-blue-500 object-cover"
                />

                {/* Plus Icon */}
                <div
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white"
                  onClick={() => open()}
                >
                  <Plus className="text-white w-5 h-5" />
                </div>
              </div>

              {img ? (
                <form action={add}>
                  <button className="text-xs bg-blue-500 p-1 rounded-md text-white">
                    Send
                  </button>
                </form>
              ) : (
                <span className="font-medium text-sm">Add a Story</span>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
      {optimisticStories.map((story) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          key={story.id}
        >
          <Image
            src={story.user.avatar || "/noAvatar.png"}
            alt="story_icon"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2"
          />
          <span className="font-medium">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}
    </>
  );
};

export default StoryList;
