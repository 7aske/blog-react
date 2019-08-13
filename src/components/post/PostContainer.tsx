import React from "react";
import Post from "./Post";
import axios from "axios";
import CommentContainer from "./CommentContainer";
import VoteType from "../../@types/Vote";
import PostType from "../../@types/Post";

type PostContainerProps = {
	match: any;
}

type PostContainerState = {
	post: PostType | null;
	votes: VoteType[];
}

class PostContainer extends React.Component {
	state: PostContainerState;
	props: PostContainerProps;

	constructor(props: PostContainerProps) {
		super(props);
		this.props = props;
		this.state = {post: null, votes: []};
	}

	componentWillMount(): void {
		const url = new URL(window.location.href);
		url.port = "5000";
		url.pathname = "/api/v1/posts/" + this.props.match.params.postid;
		axios.get(url.href).then(res => {
			const post: PostType = res.data.post;
			document.title = post.title;
			this.setState({post: post});
		}).catch(err => console.error(err));

	}

	render() {
		return (
			<main className="container">
				{this.state.post ? <Post match={this.props.match} post={this.state.post}/> : ""}
				{this.state.post ?
					<CommentContainer postid={this.state.post.id} comments={this.state.post.comments}/> : ""}
			</main>
		);
	}
}

export default PostContainer;
