import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { ReactNode } from "react";
import { FaEnvelope, FaGithub } from "react-icons/fa";

export const metadata = {
	title: "About",
};

export default function About() {
	return (
		<section className="mx-auto mb-10 flex max-w-2xl flex-col gap-y-4">
			<div className="mb-2 p-4">
				<h1 className="mt-4 text-xl font-bold">About Feely Message</h1>

				{/* TODO: Create better about text */}
				<p className="mt-5  text-gray-600 dark:text-gray-300 sm:text-xl md:text-lg">
					Feely Message is a fullstack application built with Next.Js app router
					as a portfolio project.
				</p>
			</div>
			<div className="mb-4 flex w-full justify-center gap-2">
				<LinkItem href={process.env.NEXT_PUBLIC_GITHUB_URL ?? "#"}>
					<Button type="button" className="gap-1">
						<FaGithub />
						Project Source Code
					</Button>
				</LinkItem>
				{process.env.NEXT_PUBLIC_CONTACT && (
					<LinkItem href={`mailto:${process.env.NEXT_PUBLIC_CONTACT}`}>
						<Button type="button" className="gap-1">
							<FaEnvelope />
							{process.env.NEXT_PUBLIC_CONTACT}
						</Button>
					</LinkItem>
				)}
			</div>
			<AboutItem header="Inspiration">
				<p>
					As part of my learning Next.js and App Router journey, I've stumbled
					upon
					<LinkItem href={"https://www.youtube.com/watch?v=wm5gMKuwSYk"}>
						this
					</LinkItem>
					tutorial by JavascriptMastery youtube channel. I'd like to thank this
					channel for their great tutorial. I got my homepage design and concept
					from this video.
				</p>
			</AboutItem>

			<AboutItem header="Tech Stack">
				<p>Tech stack used in this project are:</p>
				<ul className="p-2 font-normal">
					<li className="py-2">
						<LinkItem href={"https://github.com/vercel/next.js/"}>
							Next.Js 13.4.2
						</LinkItem>
						with App Router & Server Components
					</li>
					<li className="py-2">
						<LinkItem href={"https://github.com/nextauthjs/next-auth"}>
							Next Auth 4.22
						</LinkItem>
						using Google Auth Provider & Firestore Adapter
					</li>
					<li className="py-2">
						<LinkItem href={"https://firebase.google.com/docs"}>
							Firebase/Firestore
						</LinkItem>
						using firebase-admin with service account. Since I wanted to use
						next/auth and not firebase-auth, I managed user session at my own
						backend and used admin privileges to manipulate firestore database.
					</li>

					<li className="py-2">
						<LinkItem href={"https://tailwindcss.com/docs/installation"}>
							Tailwind Css
						</LinkItem>
						to style the whole app. App is responsive without any js
						manipulation and takes system dark mode preference into account.
					</li>
				</ul>
			</AboutItem>

			<AboutItem header="DevOps">
				<p>
					App source is hosted on{" "}
					<LinkItem href={process.env.NEXT_PUBLIC_GITHUB_URL ?? "/"}>
						GitHub
					</LinkItem>
					for free and deployed with{" "}
					<LinkItem href={"https://vercel.com/"}>Vercel</LinkItem> free tier.
					Database and auth provided by{" "}
					<LinkItem href={"https://cloud.google.com/"}>Google Cloud</LinkItem>{" "}
					and
					<LinkItem href={"https://firebase.google.com/"}>
						Google Firebase
					</LinkItem>
					for free.
				</p>
				<p className="mt-2 text-sm font-light italic">
					I would like to thank each company that provides a free tier for
					developers.
				</p>
			</AboutItem>

			<div className="my-4 w-full text-center">
				<p>
					By accessing this website, you agree to our{" "}
					<Link
						href={"/tos"}
						className="font-medium text-blue-700 dark:text-blue-500">
						Terms of Service
					</Link>
					.
				</p>
			</div>
		</section>
	);
}

function AboutItem({
	header = "",
	children,
}: {
	header?: string;
	children: ReactNode;
}) {
	return (
		<div className="rounded-sm bg-white p-4 shadow-sm dark:bg-secondary">
			<h2 className="font-rubik text-lg font-semibold">{header}</h2>
			<div className="mt-2 py-2 text-base font-normal">{children}</div>
		</div>
	);
}

function LinkItem({ href, children }: { href: string; children: ReactNode }) {
	return (
		<Link href={href} target="_blank" className="font-medium text-blue-700 ">
			{" "}
			{children}{" "}
		</Link>
	);
}
