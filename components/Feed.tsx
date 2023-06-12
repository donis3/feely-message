import { wait } from "@/lib/utils";
import React from "react";
import MessageCard from "./MessageItem";
import { Message } from "@/types/Forms";
import Pagination from "./Pagination";
import { Timestamp } from "firebase-admin/firestore";

async function getData(
  page: number = 1,
  tag: string | null | undefined,
  author: string | undefined
) {
  // Create the target url object with search params and pagination
  const apiUrl = new URL(`${process.env.NEXT_PUBLIC_HOSTNAME}/api/messages`);
  const params = new URLSearchParams([["page", page.toString()]]);

  //Add author filter or tag filter if needed
  if (author) {
    params.append("by", author);
  } else if (tag) {
    params.append("tag", tag);
  }

  const targetUrl = new URL(`${apiUrl.origin}${apiUrl.pathname}?${params}`);
  const options: RequestInit = {
    next: { tags: ["messages"], revalidate: 60 },
    cache: author ? "no-cache" : undefined,
  };

  try {
    const res = await fetch(targetUrl, options);
    //await wait(3);

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error: any) {
    //Failed to fetch messages
    console.log(error?.message);
    return null;
  }
}

type FeedProps = {
  params?: { page?: string; tag?: string; author?: string };
  showControls?: boolean;
};

/**
 * Async server components requires "@ts-expect-error Async Server Component" above if it's not in layout.tsx
 *
 * @returns
 */
export default async function Feed({
  params,
  showControls = false,
}: FeedProps) {
  let currentPage = 1;
  if (params?.page && parseInt(params?.page) > 0) {
    currentPage = parseInt(params.page);
  }

  const response: {
    page: number;
    pages: number;
    size: number;
    total: number;
    data: Message[];
  } = await getData(currentPage, params?.tag, params?.author);

  //Failed to fetch data
  if (!response) {
    return <section>Failed to fetch messages</section>;
  }

  if (response.size === 0 && params?.author) {
    //Profile page feed
    return (
      <p className="p-4 text-base font-medium">
        User hasn't shared any messages yet.
      </p>
    );
  }

  // No msg case
  if (response.size === 0) {
    return (
      <div className="w-full space-y-6 overflow-x-clip  py-4 xl:columns-2 xl:gap-6">
        There are no messages to display.
        {response.total > 0 && response.pages > 0 && (
          <div className="">
            <Pagination page={response.page} pages={response.pages} />
          </div>
        )}
      </div>
    );
  }

  // loop messages
  return (
    <>
      {/* <div className="w-full space-y-6 overflow-x-clip  py-4 xl:columns-2 xl:gap-6 h-auto "> */}
      <div className="grid w-full  grid-cols-1 gap-3 py-4 xl:grid-cols-2  ">
        {response.data.map((item: Message) => {
          return (
            <MessageCard
              key={item.id}
              msg={item.message}
              author={item.author}
              hashtags={item.categories}
              showControls={showControls}
              msgId={item.id}
              uid={item.ownerId}
            />
          );
        })}
      </div>
      {/* Show pagination if needed */}
      {response.pages > 1 && (
        <Pagination page={response.page} pages={response.pages} />
      )}
      {response.total > 0 && (
        <div className="w-full p-2 text-center text-sm font-light text-primary/50">
          There {response.total > 1 ? "are" : "is"}{" "}
          <span className="font-bold">{response.total}</span> message
          {response.total > 1 && "s"}
        </div>
      )}
    </>
  );
}

/*
// TEST MODe
  if (process.env.NODE_ENV === "development") {
    const messageExample: Message = {
      id: "ABC",
      author: {
        email: "test@example.com",
        name: "Deniz Özkan",
        picture:
          "https://s.gravatar.com/avatar/face5bccf51f34bf2b2a9663b93416555a6f2c54cab9394619d6026bd56de49a?s=80&r=g",
      },
      categories: ["valentines"],
      createdAt: null,
      message: "Hello there",
      ownerId: "ABC",
    };

    const response: {
      page: number;
      pages: number;
      size: number;
      total: number;
      data: Message[];
    } = {
      page: 1,
      pages: 2,
      size: 10,
      total: 20,
      data: [],
    };

    for (let i = 0; i < 20; i++) {
      const x = Math.ceil(Math.random() * 10);
      if (x % 2 === 0) {
        response.data.push({
          ...messageExample,
          message: `This is an example message with the number ${i}. This one has 2 lines in the message. Its a bit long`,
        });
      } else {
        response.data.push({
          ...messageExample,
          message: `This is an example message with the number ${i}`,
        });
      }
    }
    return response;
  }

  */
