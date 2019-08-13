type PostType = {
	id: string;
	title: string;
	category: string;
	body?: string;
	description: string;
	comments: CommentType[];
	votes: number;
	date_posted: string;
}

export default PostType
