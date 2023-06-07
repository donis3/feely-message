"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type PaginationProps = {
	page?: number;
	pages?: number;
};

export default function Pagination({ page, pages }: PaginationProps) {
	if (!page) page = 1;
	if (!pages) pages = 1;
	const path = usePathname();

	return (
		<div className="mb-4 mt-4 flex w-full justify-center">
			<div className="flex flex-row items-center gap-2 font-rubik text-lg font-medium">
				{page > 1 && (
					<Link href={`${path}?page=${page - 1}`}>
						<Button variant={"outline"} className="shadow-sm">
							<FaChevronLeft />
						</Button>
					</Link>
				)}
				<span className="rounded-md border bg-secondary px-3 py-1">
					{page}/{pages}
				</span>
				{page < pages && (
					<Link href={`${path}?page=${page + 1}`}>
						<Button variant={"outline"} className="shadow-sm">
							<FaChevronRight />
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
