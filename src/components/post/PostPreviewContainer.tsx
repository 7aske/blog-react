import React from "react";
import axios from "axios";
import PostPreview from "./PostPreview";
import PostType from "../../@types/Post";


type PostPreviewContainerState = {
	posts: PostType[];
	fetch: boolean;
	done: boolean;
	postCount: number;
	startIndex: number;
}


class PostPreviewContainer extends React.Component {
	state: PostPreviewContainerState;

	constructor(props: any) {
		super(props);
		this.state = {
			posts: [],
			fetch: true,
			done: false,
			postCount: 5,
			startIndex: 0,
		};
		this.onScroll = this.onScroll.bind(this);
	}

	fetchPosts(): void {
		const postApiUrl = new URL(window.location.href);
		postApiUrl.pathname = "/api/v1/posts";
		postApiUrl.port = window.location.port === "0" ? "80" : "5000";
		const url = postApiUrl.href + `?count=${this.state.postCount}&start=${this.state.startIndex}`;

		this.setState({fetch: false});

		axios.get(url).then(res => {
			const data = res.data;
			if (data.posts.length === 0) {
				this.setState({done: true});
				return;
			}
			const posts: PostType[] = this.state.posts;
			(data.posts as PostType[]).forEach(post => posts.push(post));
			this.setState({
				posts: posts,
				startIndex: this.state.startIndex + this.state.postCount,
				fetch: true,
			});
		}).catch(err => console.error(err));
	}

	onScroll(): void {
		const footerPos = document.querySelector("footer")!.offsetTop;
		const scrollPos = window.pageYOffset + window.innerHeight;

		if (scrollPos > footerPos && this.state.fetch && !this.state.done) {
			this.fetchPosts();
		}
	}

	componentWillMount(): void {
		this.fetchPosts();
	}

	componentDidMount(): void {
		window.addEventListener("scroll", this.onScroll, false);
	}

	componentWillUnmount(): void {
		window.removeEventListener("scroll", this.onScroll, false);
	}

	render() {
		return (
			<main className="container" id="posts-container">
				{this.state.posts.map(post => <PostPreview key={post.id} post={post}/>)}
			</main>
		);
	}
}

export default PostPreviewContainer;
