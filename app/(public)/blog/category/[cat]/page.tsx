import { redirect } from "next/navigation";

export default function BlogCategoryPage({ params }: { params: { cat: string } }) {
  redirect(`/blog?category=${params.cat}`);
}
