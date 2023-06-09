import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";

export default function Tos() {
	return (
		<Card className="w-full dark:bg-secondary">
			<CardHeader>
				<CardTitle className="text-center text-xl font-bold">
					Terms of Service
				</CardTitle>
				<CardDescription className="text-justify">
					These terms and conditions outline the rules and regulations for the
					use of {process.env.NEXT_PUBLIC_APP_AUTHOR}'s Website, located at
					{process.env.NEXT_PUBLIC_HOSTNAME} <br />
					By accessing this website, we assume you accept these terms and
					conditions. Do not continue to use {
						process.env.NEXT_PUBLIC_APP_NAME
					}{" "}
					if you do not agree to take all of the terms and conditions stated on
					this page.
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-4 flex flex-col gap-2 text-justify">
				<TosItem title="Cookies">
					The website uses cookies to help personalize your online experience.
					By accessing {process.env.NEXT_PUBLIC_APP_NAME}, you agreed to use the
					required cookies.
				</TosItem>
				<TosItem title="License">
					<p>
						Unless otherwise stated, {process.env.NEXT_PUBLIC_APP_AUTHOR} and/or its licensors own the
						intellectual property rights for all material on{" "}
						{process.env.NEXT_PUBLIC_APP_NAME}. All intellectual property rights
						are reserved. You may access this from
						{process.env.NEXT_PUBLIC_APP_NAME} for your own personal use
						subjected to restrictions set in these terms and conditions.
					</p>
					<TosList
						title="You must not"
						items={`Copy or republish material from ${process.env.NEXT_PUBLIC_APP_NAME} + Sell, rent, or sub-license material from
                        ${process.env.NEXT_PUBLIC_APP_NAME} + Reproduce, duplicate or copy material from ${process.env.NEXT_PUBLIC_APP_NAME} + 
					Redistribute content from ${process.env.NEXT_PUBLIC_APP_NAME}`}
					/>
					<p>
						This Agreement shall begin on the date hereof.
						<br />
						Parts of this website offer users an opportunity to post and share
						text content called Messages. {process.env.NEXT_PUBLIC_APP_AUTHOR} does not filter, edit,
						publish or review Messages before their presence on the website.
						Messages do not reflect the views and opinions of {process.env.NEXT_PUBLIC_APP_AUTHOR}, its
						agents, and/or affiliates. Messages reflect the views and opinions
						of the person who posts their views and opinions. To the extent
						permitted by applicable laws, {process.env.NEXT_PUBLIC_APP_AUTHOR} shall not be liable for
						the Messages or any liability, damages, or expenses caused and/or
						suffered as a result of any use of and/or posting of and/or
						appearance of the Messages on this website.
					</p>
					<p>
						{process.env.NEXT_PUBLIC_APP_AUTHOR} reserves the right to monitor all Messages and remove
						any Messages that can be considered inappropriate, offensive, or
						causes breach of these Terms and Conditions.
					</p>
					<TosList
						title="You warrant and
						represent that:"
						items="You are entitled to post the Messages on our website and have all
                        necessary licenses and consents to do so; + The Messages do not invade
                        any intellectual property right, including without limitation
                        copyright, patent, or trademark of any third party; + The Messages do
                        not contain any defamatory, libelous, offensive, indecent, or
                        otherwise unlawful material, which is an invasion of privacy. + The
                        Messages will not be used to solicit or promote business or custom or
                        present commercial activities or unlawful activity."
					/>

					<p>
						{" "}
						You hereby grant {process.env.NEXT_PUBLIC_APP_AUTHOR} a non-exclusive license to use,
						reproduce, edit and authorize others to use, reproduce and edit any
						of your Messages in any and all forms, formats, or media.
					</p>
				</TosItem>

				<TosItem title="Disclaimer">
					<p>
						To the maximum extent permitted by applicable law, we exclude all
						representations, warranties, and conditions relating to our website
						and the use of this website.
					</p>
					<TosList
						title="Nothing in this disclaimer will:"
						items="limit or exclude our or your liability for death or personal injury;+
    limit or exclude our or your liability for fraud or fraudulent misrepresentation;+
    limit any of our or your liabilities in any way that is not permitted under applicable law; or+
    exclude any of our or your liabilities that may not be excluded under applicable law.+"
					/>
					<p>
						The limitations and prohibitions of liability set in this Section
						and elsewhere in this disclaimer: (a) are subject to the preceding
						paragraph; and (b) govern all liabilities arising under the
						disclaimer, including liabilities arising in contract, in tort, and
						for breach of statutory duty.
					</p>
					<p>
						We do not ensure that the information on this website is correct. We
						do not warrant its completeness or accuracy, nor do we promise to
						ensure that the website remains available or that the material on
						the website is kept up to date.
					</p>
					<p>
						As long as the website and the information and services on the
						website are provided free of charge, we will not be liable for any
						loss or damage of any nature.
					</p>
				</TosItem>
			</CardContent>
		</Card>
	);
}

function TosItem({ title, children }: any) {
	return (
		<div className="flex flex-col gap-y-2">
			<h2 className="text-lg font-bold">{title}</h2>
			{children}
		</div>
	);
}

function TosList({ title, items }: { title: string; items: string }) {
	return (
		<>
			<p>{title}</p>
			<ul className="px-2">
				{items.split("+").map((item, i) => {
					return <li key={"tos_item_" + i}>{item}</li>;
				})}
			</ul>
		</>
	);
}
