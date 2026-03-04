import { z } from "zod/v4";

const UserSchema = z.object({
	name: z.string(),
	age: z.number(),
});

type User = z.infer<typeof UserSchema>;

const greet = (user: User): string => `${user.name} is ${user.age} years old`;

const result = UserSchema.safeParse({ name: "Sean", age: 30 });

if (result.success) {
	console.log(greet(result.data));
} else {
	console.error(result.error.issues);
}
