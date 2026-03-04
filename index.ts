import { z } from "zod/v4";

// -- Schema: single source of truth for shape + validation --
const PostSchema = z.object({
	id: z.number(),
	title: z.string(),
});

// -- Inferred type: use inside your app after validation --
type Post = z.infer<typeof PostSchema>;

// -- Internal function: takes typed data, trusts the caller --
const summarize = (post: Post): string => `#${post.id}: ${post.title}`;

// -- Parse boundary: where untrusted data enters your system --
const fetchPost = async (url: string): Promise<string> => {
	const response = await fetch(url);
	const json: unknown = await response.json();

	const result = PostSchema.safeParse(json);
	if (!result.success) {
		return `Invalid post: ${result.error.issues.map((i) => i.message).join(", ")}`;
	}

	// result.data is now Post — safe to pass to typed functions
	return summarize(result.data);
};

// -- Demo: real API call with parse boundary --
const API = "https://simplejson.vercel.app/api";

console.log(await fetchPost(`${API}/kHBgu13h`)); // { id: 1, title: "Hello World" }
console.log(await fetchPost(`${API}/6qBN482F`)); // { name: "Sean", age: 30 }
