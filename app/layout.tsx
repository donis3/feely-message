import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { Raleway, Rubik } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/Toaster";
import Provider from "@/components/Provider";

const raleway = Raleway({ subsets: ["latin-ext"], variable: "--font-raleway" });

const rubik = Rubik({ subsets: ["latin-ext"], variable: "--font-rubik" });

export const metadata = {
	title: {
		template: "Feely Message - %s",
		default: "Feely Message - Messages for special days!", // a default is required when creating a template
	},
	description:
		"Browse many messages for any special occasion to share with your friends and loved ones. " +
		"You may also share your own messages with the world!",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	//render
	return (
		<html
			lang="en"
			className={`${raleway.variable} ${rubik.variable}`}
			suppressHydrationWarning>
			<body className="flex min-h-screen min-w-min flex-col justify-between bg-bodylight font-raleway dark:bg-bodydark">
				<Provider>
					<Navbar />
					<main className="mx-auto w-full min-w-min max-w-screen-xl flex-1 p-4">
						{children}
					</main>
					<Footer />
					<Toaster />
				</Provider>
			</body>
		</html>
	);
}
