"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";
import { FcGoogle } from "react-icons/fc";

type Props = {
	name: string;
	id: string;
};

export default function ProviderButton({ name, id }: Props) {
	return (
		<Button
			type="button"
			className="gap-2"
			variant={"outline"}
			onClick={() => signIn(id)}>
			<FcGoogle />
			Sign In with {name}
		</Button>
	);
}
