import React from "react";
import Comment from "./Comment";
import CommentType from "../../@types/Comment";

type CommentContainerProps = {
	postid: string;
	comments: CommentType[]
}

type CommentContainerState = {
	postid: string;
	comments: CommentType[]
}

class CommentContainer extends React.Component {
	props: CommentContainerProps;
	state: CommentContainerState;

	constructor(props: CommentContainerProps) {
		super(props);
		this.props = props;
		this.state = {comments: props.comments, postid: props.postid};
	}
	render() {
		return (
			<div>
				{this.state.comments.reverse().map(comment => <Comment key={comment.id} comment={comment}
															 postid={this.state.postid}/>)}
			</div>
		);
	}
}

export default CommentContainer;
