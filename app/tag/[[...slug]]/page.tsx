import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Feed from "@/components/Feed";
import Loader from "@/components/Loader";
import MessageFeed from "@/components/MessageFeed";
import MsgDialog from "@/components/MsgDialog";
import { Button } from "@/components/ui/button";
import { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React, { Suspense } from "react";
import { BiArrowBack } from "react-icons/bi";

type Props = {
  params: { slug: string[] };
  searchParams: any;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = params.slug?.length > 0 ? params.slug[0].replace("-", " ") : "";
  if (tag.length == 0) {
    return {
      title: "All Messages",
      description:
        "Browse all messages and find the best one to share with your friends or loved ones on special days!",
    };
  }
  return {
    title: `${tag.toLocaleUpperCase()} Messages`,
    description: `Browse the best messages to share with your loved ones about ${tag.toLocaleUpperCase()} or many other occasions.`,
  };
}

export default async function Tag({ params, searchParams }: Props) {
  const tag = params.slug?.length > 0 ? params.slug[0] : "";
  const session = await getServerSession(authOptions);

  return (
    <section className="flex flex-col items-center justify-start">
      <div className="w-full">
        <Link href={"/"}>
          <Button variant={"ghost"} className="gap-1 text-base">
            <BiArrowBack /> Back
          </Button>{" "}
        </Link>
      </div>
      <h1 className="mt-5 text-center font-sans text-2xl font-bold leading-[1.15]  text-black dark:text-gray-300 md:text-3xl">
        {tag.length > 0
          ? "#" + tag.toUpperCase().replace("-", " ")
          : "ALL MESSAGES"}
      </h1>

      <p className="mt-2 max-w-2xl px-4 text-gray-600 dark:text-gray-300 sm:text-xl md:text-lg">
        {tag.length > 0
          ? "Here are the latest messages for this occasion!"
          : "Displaying all messages"}
      </p>

      {/* <div className="mx-auto mt-4 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-8 xl:max-w-screen-xl"> */}
      <div>
        {/* Only show create msg button if user is logged in */}
        {session && (
          <MsgDialog
            initialData={
              tag.length > 0 ? { message: "", categories: tag } : undefined
            }
          />
        )}

        <Suspense fallback={<Loader />}>
          {/* @ts-expect-error Async Server Component */}
          <Feed params={{ ...searchParams, tag }} />
        </Suspense>
      </div>
    </section>
  );
}
