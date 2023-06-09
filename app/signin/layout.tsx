import React from "react";

export default function SigninLayout({ children } : {children: React.ReactNode}) {
	return (
		<section className="mx-auto mt-8 flex w-full max-w-screen-md  flex-col items-center justify-center gap-2 md:mt-16 xl:max-w-screen-xl">
			{children}
		</section>
	);
}
