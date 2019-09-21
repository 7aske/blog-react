import React from "react";
import { default as SimpleMDE } from "simplemde";
import axios from "axios";
import PostType from "../../@types/Post";
import ModalConfirm, { Question } from "../modals/ModalConfirm";
import Cookies from "universal-cookie";
import CommentType from "../../@types/Comment";

type EditPostProps = {}
type EditPostState = {
	startPost: number;
	postCount: number;
	ready: boolean;
	done: boolean;
	posts: PostType[];
	post: PostType | null;
	commentid?: string | null;
	question?: Question;
}

class EditComments extends React.Component {
	state: EditPostState;
	props: EditPostProps;
	editor: SimpleMDE | null;
	modalConfirm: React.RefObject<ModalConfirm>;

	constructor(props: EditPostProps) {
		super(props);
		this.editor = null;
		this.props = props;
		this.state = {startPost: 0, postCount: 10, done: false, ready: true, posts: [], post: null};
		this.modalConfirm = React.createRef();
		this.fetchPosts = this.fetchPosts.bind(this);
		this.safeFetch = this.safeFetch.bind(this);
		this.postSelectHandler = this.postSelectHandler.bind(this);
		this.commentDeleteHandler = this.commentDeleteHandler.bind(this);
		this.deleteComment = this.deleteComment.bind(this);
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.askDeleteComment = this.askDeleteComment.bind(this);
	}

	onChangeHandler(arg: React.ChangeEvent | string) {
		const post = this.state.post;
		if (post) {
			if (typeof arg === "string") {
				post.body = arg;
				this.editor!.value(arg);
			} else {
				switch (arg.target.attributes.getNamedItem("id")!.value) {
					case "input-post-category-edit":
						post.category = (arg.target as HTMLInputElement).value;
						break;
					case "input-post-title-edit":
						post.title = (arg.target as HTMLInputElement).value;
						break;
					case "input-post-description-edit":
						post.description = (arg.target as HTMLInputElement).value;
						break;
				}
			}
			this.setState({post});
		}
	}

	modalHandler(answer: Boolean) {
		if (answer) {
			switch (this.state.question!.type) {
				case "delete":
					this.deleteComment();
					break;
			}
		}
	}

	postSelectHandler(id: string) {
		const post = this.state.posts.find(post => post.id === id);
		if (post) {
			this.editor!.value(post.body as string);
			this.setState({post});
		}
	}

	commentDeleteHandler(id: string) {
		this.setState({commentid: id});
		this.askDeleteComment();
	}

	deleteComment() {
		if (this.state.commentid && this.state.post) {
			let commentid = this.state.commentid;
			const url = new URL(window.location.href);
			const id = this.state.post.id;
			url.port = window.location.port === "0" || window.location.port === "" ? "80" : window.location.port;
			url.pathname = "/api/v1/posts/" + id + "/comments/" + commentid;
			const cookie = new Cookies();
			let token = cookie.get("authorization");
			if (token) {
				token = token.replace("%20", " ").split(" ")[1];
				axios.delete(url.href, {headers: {"Token": token}}).then(res => {
					if (res.status === 200) {
						const comments = this.state.post!.comments.filter(c => c.id !== commentid);
						const post = this.state.post;
						post!.comments = comments;
						this.setState({post});
						console.log("Deleted");
					}
				}).catch(err => console.error(err));
			}
		}
	}

	askDeleteComment() {
		const question: Question = {
			text: "Are you sure you want to delete this comment?",
			title: "Warning",
			type: "delete",
		};
		this.setState({question});
		this.openModal();
	}

	openModal() {
		if (this.modalConfirm.current) {
			this.modalConfirm.current.open();
		}
	}

	safeFetch() {
		const postList = document.querySelector("#edit-comments ul") as HTMLUListElement;
		if (postList.offsetHeight + postList.scrollTop >= postList.scrollHeight && !this.state.done && this.state.ready) {
			this.fetchPosts();
		}
	}

	fetchPosts() {
		const url = new URL(window.location.href);
		url.port = window.location.port === "0" || window.location.port === "" ? "80" : window.location.port;
		url.pathname = "/api/v1/posts";

		axios.get(url.href + `?start=${this.state.startPost}&count=${this.state.postCount}`).then(res => {
			const posts = this.state.posts;
			let done = false;
			if (res.status === 200) {
				if (res.data.posts.length === 0) {
					done = true;
				} else {
					(res.data.posts as PostType[]).forEach(post => {
						posts.push(post);
					});
				}
			}
			this.setState({
				posts: posts,
				startPost: this.state.startPost + this.state.postCount,
				ready: true,
				done: done,
			});
		}).catch(err => console.error(err));
	}

	componentDidMount(): void {
		const inputPostDescriptionEdit = document.querySelector("#input-post-description-edit") as HTMLFormElement;
		inputPostDescriptionEdit.focus();
		inputPostDescriptionEdit.blur();
		const postList = document.querySelector("#edit-comments ul") as HTMLUListElement;
		postList.addEventListener("scroll", this.safeFetch, false);
		this.fetchPosts();
	}

	componentWillUnmount(): void {
		const postList = document.querySelector("#edit-comments ul") as HTMLUListElement;
		postList.removeEventListener("scroll", this.safeFetch, false);
	}

	render() {
		return (
			<div id="edit-comments" className="col s12">
				<div className="col m3 s12 card mt-0">
					<ul className="collection">
						{this.state.posts.map(post => <PostListItem
							handlePostSelect={this.postSelectHandler.bind(this)}
							post={post}/>)}
					</ul>
				</div>
				<div className="col m9 s12 card edit-card">
					<ul className="collection">
						{this.state.post ? this.state.post.comments.map(comment => <CommentListItem
							handleCommentDelete={this.commentDeleteHandler.bind(this)}
							comment={comment}/>) : <li className={"collection-item avatar pr-5 pl-2"}>
							<p className={"truncate m-0"}>No comments<br/></p>
						</li>}
					</ul>
				</div>
				<ModalConfirm ref={this.modalConfirm} title={this.state.question ? this.state.question.title : ""}
							  question={this.state.question ? this.state.question.text : ""}
							  onCancel={this.modalHandler.bind(this)} onConfirm={this.modalHandler.bind(this)}/>
			</div>
		);
	}
}

type PostListItemProps = {
	post: PostType
	handlePostSelect: Function;
	// handlePostDelete: Function;
};
type PostListItemState = {
	post: PostType
};

class PostListItem extends React.Component {
	props: PostListItemProps;
	state: PostListItemState;

	constructor(props: PostListItemProps) {
		super(props);
		this.props = props;
		this.state = {post: props.post};
		this.handlePostSelect = this.handlePostSelect.bind(this);
	}

	handlePostSelect() {
		this.props.handlePostSelect(this.state.post.id);
	}

	render() {
		return (<li className="collection-item avatar pr-5 pl-2" onClick={this.handlePostSelect}>
			<span className="title truncate">{this.props.post.title}</span>
			<p className="truncate m-0">{this.props.post.description}<br/>{this.props.post.id}</p>
		</li>);
	}
}

type CommentListItemProps = {
	comment: CommentType
	// handleCommentSelect: Function;
	handleCommentDelete: Function;
};
type CommentListItemState = {
	comment: CommentType
};


class CommentListItem extends React.Component {
	props: CommentListItemProps;
	state: CommentListItemState;

	constructor(props: CommentListItemProps) {
		super(props);
		this.props = props;
		this.state = {comment: props.comment};
		this.handleCommentDelete = this.handleCommentDelete.bind(this);
		// this.handlePostSelect = this.handlePostSelect.bind(this);
	}

	handleCommentDelete() {
		this.props.handleCommentDelete(this.state.comment.id);
	}

	render() {
		return (<li className="collection-item avatar pr-5 pl-2">
			<span className="title truncate">{this.props.comment.author}</span>
			<p className="truncate m-0">{this.props.comment.text}<br/>{this.props.comment.id}</p>
			<div className="secondary-content">
				{/*<a onClick={this.handlePostSelect} className="">*/}
				{/*	<i className="material-icons">edit</i></a><br/>*/}
				<a onClick={this.handleCommentDelete} className="">
					<i className="material-icons">delete</i></a>
			</div>
		</li>);
	}
}

export default EditComments;
