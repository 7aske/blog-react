import PostType from "./Post";

type CommentType = {
	id: string;
	author: string;
	date_posted: string;
	text: string;
	votes: number;
}

export default CommentType
