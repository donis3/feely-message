import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { Raleway, Rubik } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/Toaster";
import Provider from "@/components/Provider";

const raleway = Raleway({ subsets: ["latin-ext"], variable: "--font-raleway" });

const rubik = Rubik({ subsets: ["latin-ext"], variable: "--font-rubik" });

export const metadata = {
	title: "Feely Message",
	description: "One stop message shop",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isDark = false;
	//render
	return (
		<html
			lang="en"
			className={`${raleway.variable} ${rubik.variable} ${isDark && "dark"}`}>
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
