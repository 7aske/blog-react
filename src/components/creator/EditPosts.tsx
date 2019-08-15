import React from "react";
import { default as SimpleMDE } from "simplemde";
import axios from "axios";
import PostType from "../../@types/Post";
import ModalConfirm, { Question } from "../modals/ModalConfirm";
import Cookies from "universal-cookie";

type EditPostProps = {}
type EditPostState = {
	startPost: number;
	postCount: number;
	ready: boolean;
	done: boolean;
	posts: PostType[];
	post: PostType | null;
	question?: Question;
}

class EditPosts extends React.Component {
	state: EditPostState;
	props: EditPostProps;
	editor: SimpleMDE | null;
	modalConfirm: React.RefObject<ModalConfirm>;

	constructor(props: EditPostProps) {
		super(props);
		this.editor = null;
		this.props = props;
		this.state = {startPost: 0, postCount: 5, done: false, ready: true, posts: [], post: null};
		this.modalConfirm = React.createRef();
		this.initEditor = this.initEditor.bind(this);
		this.fetchPosts = this.fetchPosts.bind(this);
		this.safeFetch = this.safeFetch.bind(this);
		this.postSelectHandler = this.postSelectHandler.bind(this);
		this.postDeleteHandler = this.postDeleteHandler.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.updatePost = this.updatePost.bind(this);
		this.discardPost = this.discardPost.bind(this);
		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.askUpdatePost = this.askUpdatePost.bind(this);
		this.askDiscardPost = this.askDiscardPost.bind(this);
		this.askDeletePost = this.askDeletePost.bind(this);
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
				case "update":
					this.updatePost();
					break;
				case "discard":
					this.discardPost();
					break;
				case "delete":
					this.deletePost();
					break;
			}
		}
	}

	discardPost() {
		this.editor!.value("");
		this.setState({post: null});
	}

	postSelectHandler(id: string) {
		const inputPostDescriptionEdit = document.querySelector("#input-post-description-edit") as HTMLInputElement;
		const post = this.state.posts.find(post => post.id === id);
		if (post) {
			this.editor!.value(post.body as string);
			this.setState({post});
			inputPostDescriptionEdit.focus();
			inputPostDescriptionEdit.blur();
		}
	}

	postDeleteHandler(id: string) {
		const inputPostDescriptionEdit = document.querySelector("#input-post-description-edit") as HTMLInputElement;
		const post = this.state.posts.find(post => post.id === id);
		if (post) {
			this.editor!.value(post.body as string);
			this.setState({post});
			inputPostDescriptionEdit.focus();
			inputPostDescriptionEdit.blur();
		}
		this.askDeletePost();
	}

	deletePost() {
		const url = new URL(window.location.href);
		if (this.state.post) {
			const id = this.state.post.id;
			url.port = "5000";
			url.pathname = "/api/v1/posts/" + id;
			const cookie = new Cookies();
			let token = cookie.get("authorization");
			if (token) {
				token = token.replace("%20", " ").split(" ")[1];
				axios.delete(url.href, {headers: {"Token": token}}).then(res => {
					console.log(res);
					if (res.status === 200) {
						const posts = this.state.posts;
						posts.splice(posts.findIndex(post => this.state.post!.id === post.id), 1);
						this.setState({posts});
						this.discardPost();
					}
				}).catch(err => console.error(err));
			}
		}
	}

	askDeletePost() {
		const question: Question = {
			text: "Are you sure you want to delete this post?",
			title: "Warning",
			type: "delete",
		};
		this.setState({question});
		this.openModal();
	}

	askUpdatePost() {
		const question: Question = {
			text: "Are you sure you want to update this post?",
			title: "Warning",
			type: "update",
		};
		this.setState({question});
		this.openModal();
	}

	askDiscardPost() {
		const question: Question = {
			text: "Are you sure you want to discard changes?",
			title: "Warning",
			type: "discard",
		};
		this.setState({question});
		this.openModal();
	}

	updatePost() {
		const post = this.state.post;
		const url = new URL(window.location.href);
		url.port = "5000";
		url.pathname = "/api/v1/posts/";
		if (post) {
			const cookie = new Cookies();
			let token = cookie.get("authorization");
			token = token.replace("%20", " ").split(" ")[1];
			url.pathname += post.id;
			if (post.body!.length > 0 && post.title.length > 0 && post.category.length !== 0 && post.description.length !== 0) {
				axios.put(url.href, {
					data: JSON.stringify({
						body: post.body,
						title: post.title,
						category: post.category,
						description: post.description,
					}),
				}, {headers: {"Token": token}}).then(res => {
					if (res.status === 201) {
						window.location.pathname = "/posts/" + post.id;
					}
				}).then(err => console.error(err));
				console.log(post);
			}
		}
	}

	openModal() {
		if (this.modalConfirm.current) {
			this.modalConfirm.current.open();
		}
	}

	safeFetch() {
		const postList = document.querySelector("#edit-posts ul") as HTMLUListElement;
		if (postList.offsetHeight + postList.scrollTop >= postList.scrollHeight && !this.state.done && this.state.ready) {
			this.fetchPosts();
		}
	}

	fetchPosts() {
		const url = new URL(window.location.href);
		url.port = "5000";
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
		this.initEditor();
		const inputPostDescriptionEdit = document.querySelector("#input-post-description-edit") as HTMLFormElement;
		inputPostDescriptionEdit.focus();
		inputPostDescriptionEdit.blur();
		const postList = document.querySelector("#edit-posts ul") as HTMLUListElement;
		postList.addEventListener("scroll", this.safeFetch, false);
		this.fetchPosts();
	}

	componentWillUnmount(): void {
		const postList = document.querySelector("#edit-posts ul") as HTMLUListElement;
		postList.removeEventListener("scroll", this.safeFetch, false);
	}

	initEditor() {
		this.editor = new SimpleMDE({
			blockStyles: {
				bold: "__",
				italic: "_",
			},
			element: document.getElementById("mde-anchor-edit") as unknown as HTMLTextAreaElement,
			forceSync: true,
			hideIcons: ["guide", "heading"],
			indentWithTabs: false,
			lineWrapping: false,
			parsingConfig: {
				allowAtxHeaderWithoutSpace: true,
				strikethrough: false,
				underscoresBreakWords: true,
			},
			placeholder: "",
			promptURLs: true,
			renderingConfig: {
				singleLineBreaks: false,
				codeSyntaxHighlighting: true,
			},
			shortcuts: {
				drawTable: "Cmd-Alt-T",
			},
			showIcons: ["code", "table"],
			spellChecker: false,
			status: ["lines", "words", "cursor"],
			styleSelectedText: false,
			tabSize: 4,
			toolbarTips: true,
		});
		this.editor.codemirror.on("change", () => {
			const post = this.state.post;
			if (post) {
				post.body = this.editor!.value();
				this.setState({post});
			}
		});
	}

	render() {
		return (
			<div id="edit-posts" className="col s12">
				<div className="col m3 s12 card mt-0">
					<ul className="collection">
						{this.state.posts.map(post => <PostListItem handlePostDelete={this.postDeleteHandler.bind(this)}
																	handlePostSelect={this.postSelectHandler.bind(this)}
																	post={post}/>)}
					</ul>
				</div>
				<div className="col m9 s12 card edit-card">
					<div className="row mt-2 mb-1">
						<div className="input-field col s6">
							<input id="input-post-title-edit"
								   onChange={this.onChangeHandler}
								   value={this.state.post ? this.state.post.title : ""}
								   type="text"
								   className="validate"/>
							<label className="active" htmlFor="input-post-title-edit">Title</label>
						</div>
						<div className="input-field col s6">
							<input id="input-post-category-edit"
								   onChange={this.onChangeHandler}
								   value={this.state.post ? this.state.post.category : ""}
								   type="text"
								   className="validate"/>
							<label className="active" htmlFor="input-post-category-edit">Category</label>
						</div>
					</div>
					<div className="row mb-1">
						<div className="input-field col s12 mb-1 mt-1">
                                    <textarea id="input-post-description-edit"
											  className="materialize-textarea"
											  onChange={this.onChangeHandler}
											  value={this.state.post ? this.state.post.description : ""}
									/>
							<label htmlFor="input-post-description-edit">Post Description</label>
						</div>
					</div>
					<textarea id="mde-anchor-edit"/>
					<div className="card-action p-0 pt-1">
						<button id="btn-submit-post-edit"
								className="btn waves-effect waves-light mb-3"
								onClick={this.askUpdatePost}
								type="button"
								name="action">
							Submit
							<i className="material-icons right">send</i>
						</button>
						<button id="btn-reset-edit"
								onClick={this.askDiscardPost}
								className="btn waves-effect waves-light red mb-3"
								type="button"
								name="action">
							Clear
							<i className="material-icons right">backspace</i>
						</button>
					</div>
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
	handlePostDelete: Function;
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
		this.handlePostDelete = this.handlePostDelete.bind(this);
		this.handlePostSelect = this.handlePostSelect.bind(this);
	}

	handlePostSelect() {
		this.props.handlePostSelect(this.state.post.id);
	}

	handlePostDelete() {
		this.props.handlePostDelete(this.state.post.id);
	}

	render() {
		return (<li className="collection-item avatar pr-5 pl-2">
			<span className="title truncate">{this.props.post.title}</span>
			<p className="truncate m-0">{this.props.post.description}<br/>{this.props.post.id}</p>
			<div className="secondary-content">
				<a onClick={this.handlePostSelect} className="">
					<i className="material-icons">edit</i></a><br/>
				<a onClick={this.handlePostDelete} className="">
					<i className="material-icons">delete</i></a>
			</div>
		</li>);
	}
}

export default EditPosts;
