import React from "react";
import Link from "next/link";
import Author from "@/types/Author";
import MessageCopy from "./MessageCopy";
import MessageAvatar from "./MessageAvatar";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import MessageDelete from "./MessageDelete";

/**
 * Single Hashtag Component
 */
function HashtagItem({ hashtag }: { hashtag: string }) {
  return (
    <Link
      href={`/tag/${hashtag}`}
      className="hover:text-indigo-900 dark:hover:text-violet-400"
    >
      #{hashtag.replace(/[-]/g, " ")}
    </Link>
  );
}

/**
 * Message Card component for the homepage
 */
export default function MessageCard({
  msgId,
  msg,
  author = { name: "Unknown", email: "unknown", picture: undefined },
  hashtags = [],
  showControls = false,
  uid,
}: {
  msgId: string | undefined;
  msg: string;
  author?: Author;
  hashtags?: Array<string>;
  showControls?: boolean;
  uid?: string;
}) {
  //Get only unique tags
  const tags = Array.from(new Set(hashtags));

  return (
    // <div className="h-fit w-full flex-1 break-inside-avoid rounded-lg border bg-white/40 bg-clip-padding p-3 shadow-sm   backdrop-blur-lg backdrop-filter hover:bg-white/75  dark:bg-black/60 dark:text-white dark:hover:bg-black/50">

    <div className="h-fit w-full break-inside-avoid rounded-lg border bg-white/40 bg-clip-padding p-3 shadow-sm   backdrop-blur-lg backdrop-filter hover:bg-white/75  dark:bg-black/60 dark:text-white dark:hover:bg-black/50">
      <div className="mb-3 flex flex-row items-center gap-x-2">
        {author && <MessageAvatar author={author} uid={uid} />}
        <div className="flex flex-1 flex-col justify-start gap-y-0 overflow-hidden">
          <h3 className="truncate font-rubik text-sm font-semibold leading-none text-gray-700 dark:text-gray-400">
            {author.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {author?.email}
          </p>
        </div>
        <div className="flex gap-1">
          <MessageCopy text={msg} />
          <MessageDelete msgId={msgId} />
        </div>
      </div>

      <p className="break-words p-2 text-sm font-normal text-gray-700 dark:text-gray-50">
        {msg}
      </p>
      {tags.length > 0 && (
        <p className="flex flex-wrap gap-x-3 p-2 font-mono text-sm font-medium text-blue-600 dark:text-violet-600">
          {tags.map((tag, i) => (
            <HashtagItem hashtag={tag} key={`hastag_${i}`} />
          ))}
        </p>
      )}
      {showControls && msgId && (
        <div className="mt-2 flex w-full items-center justify-center gap-4 border-t pt-2 text-sm font-semibold">
          <Link
            href={`/message/edit/${msgId}`}
            className="flex items-center gap-1 text-orange-400"
          >
            <FaPencilAlt />
            Edit
          </Link>
          <Link
            href={`/message/delete/${msgId}`}
            className="flex items-center gap-1 text-red-700"
          >
            <FaTrash />
            Delete
          </Link>
        </div>
      )}
    </div>
  );
}
