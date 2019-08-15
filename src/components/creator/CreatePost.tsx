import React, { createRef, RefObject } from "react";
import { default as SimpleMDE } from "simplemde";
import ModalConfirm from "../modals/ModalConfirm";
import axios from "axios";
import Cookies from "universal-cookie";

type CreatePostProps = {}
type CreatePostState = {
	question: { type?: "submit" | "clear", title: string, text: string; };
	post: { title: string, category: string, description: string, body: string }
}

class CreatePost extends React.Component {
	state: CreatePostState;
	props: CreatePostProps;
	modalConfirm: RefObject<ModalConfirm>;
	inputPostTitle: HTMLInputElement | null;
	inputPostCategory: HTMLInputElement | null;
	inputPostDescription: HTMLTextAreaElement | null;
	mdeAnchor: SimpleMDE | null;

	constructor(props: CreatePostProps) {
		super(props);
		this.props = props;
		this.state = {
			question: {text: "", title: ""}, post: {
				body: "",
				category: "",
				description: "",
				title: "",
			},
		};

		this.inputPostDescription = null;
		this.inputPostTitle = null;
		this.inputPostCategory = null;
		this.mdeAnchor = null;

		this.modalConfirm = createRef();

		this.openModal = this.openModal.bind(this);
		this.modalHandler = this.modalHandler.bind(this);
		this.onChange = this.onChange.bind(this);
		this.clearInputs = this.clearInputs.bind(this);
		this.submitPost = this.submitPost.bind(this);
		this.askClearInputs = this.askClearInputs.bind(this);
		this.askSubmitPost = this.askSubmitPost.bind(this);
	}


	modalHandler(answer: boolean) {
		switch (this.state.question.type) {
			case "clear":
				if (answer) {
					this.clearInputs();
				}
				break;
			case "submit":
				if (answer) {
					this.submitPost();
				}
				break;

		}
	}

	askClearInputs() {
		this.setState({
			question: {
				title: "Warning",
				text: "Are you sure you want to clear your inputs?",
				type: "clear",
			},
		});
		this.openModal();
	}

	askSubmitPost() {
		this.setState({
			question: {
				title: "Warning",
				text: "Are you sure you want to submit this post?",
				type: "submit",
			},
		});
		this.openModal();
	}

	submitPost() {
		if (this.state.post.title.length <= 2 ||
			this.state.post.category.length <= 2 ||
			this.state.post.description.length <= 2 ||
			this.state.post.body.length <= 2) {
			return;
		}
		const url = new URL(window.location.href);
		url.port = "5000";
		url.pathname = "/api/v1/posts";
		const cookies = new Cookies();
		let token = cookies.get("authorization");
		if (token) {
			token = token.replace("%20", " ").split(" ")[1];
			axios.post(url.href, {
				data: JSON.stringify(this.state.post),
			}, {
				headers: {
					"Token": token,
				},
			}).then(res => {
				const data = res.data;
				if (res.status === 201) {
					window.location.href = "/posts/" + data.id;
				}
			}).then(err => console.error(err));
		}
	}

	clearInputs() {
		this.mdeAnchor!.value("");
		this.setState({post: {title: "", category: "", description: "", body: ""}});
		setTimeout(() => {
			this.forceUpdate();
		}, 20);
	}

	openModal() {
		if (this.modalConfirm.current) {
			this.modalConfirm.current.open();
		}
	}

	onChange(ev: React.ChangeEvent) {
		const target = ev.target as unknown as HTMLInputElement;
		const id = target.attributes.getNamedItem("id")!.value;
		switch (id) {
			case "input-post-description":
				this.setState({
					post: {
						description: target.value,
						title: this.state.post.title,
						category: this.state.post.category,
						body: this.state.post.body,
					},
				});
				break;
			case "input-post-title":
				this.setState({
					post: {
						description: this.state.post.description,
						title: target.value,
						category: this.state.post.category,
						body: this.state.post.body,
					},
				});
				break;
			case "input-post-category":
				this.setState({
					post: {
						description: this.state.post.description,
						title: this.state.post.title,
						category: target.value,
						body: this.state.post.body,
					},
				});
				break;
		}
	}

	componentDidMount(): void {
		this.mdeAnchor = new SimpleMDE({
			blockStyles: {
				bold: "__",
				italic: "_",
			},
			element: document.getElementById("mde-anchor") as unknown as HTMLTextAreaElement,
			forceSync: true,
			hideIcons: ["guide", "heading"],
			indentWithTabs: false,
			lineWrapping: false,
			parsingConfig: {
				allowAtxHeaderWithoutSpace: true,
				strikethrough: false,
				underscoresBreakWords: true,
			},
			placeholder: "Type here...",
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
		this.mdeAnchor.codemirror.on("change", (e: any) => {
			this.setState({
				post: {
					description: this.state.post.description,
					title: this.state.post.title,
					category: this.state.post.category,
					body: e.getTextArea().value,
				},
			});
		});
		const inputPostDescription = document.querySelector("#input-post-description") as HTMLFormElement;
		inputPostDescription.focus();
		inputPostDescription.blur();
		this.inputPostDescription = document.querySelector("#input-post-description") as unknown as HTMLTextAreaElement;
		this.inputPostTitle = document.querySelector("#input-post-title") as unknown as HTMLInputElement;
		this.inputPostCategory = document.querySelector("#input-post-category") as unknown as HTMLInputElement;
	}


	render() {
		return (
			<div id="create-post" className="col s12">
				<div className="card create-card pl-4 pr-4">
					<div className="row mt-2 mb-1">
						<div className="input-field col s6">
							<input id="input-post-title"
								   value={this.state.post.title}
								   onChange={this.onChange}
								   type="text"
								   className="validate"/>
							<label className="active" htmlFor="input-post-title">Title</label>
						</div>
						<div className="input-field col s6">
							<input id="input-post-category"
								   value={this.state.post.category}
								   onChange={this.onChange}
								   type="text"
								   className="validate"/>
							<label className="active" htmlFor="input-post-category">Category</label>
						</div>
					</div>
					<div className="row mb-1">
						<div className="input-field col s12 mb-1 mt-1">
                                    <textarea id="input-post-description"
											  className="materialize-textarea"
											  value={this.state.post.description}
											  onChange={this.onChange}/>
							<label htmlFor="input-post-description">Post Description</label>
						</div>
					</div>
					<textarea id="mde-anchor" value={this.state.post.body}/>
					<div className="card-action p-0 pt-1">
						<button onClick={this.askSubmitPost}
								id="btn-submit-post"
								className="btn waves-effect waves-light mb-3"
								type="button"
								name="action">
							Submit<i className="material-icons right">send</i>
						</button>
						<button onClick={this.askClearInputs}
								id="btn-reset"
								className="btn waves-effect waves-light red mb-3"
								type="button"
								name="action">
							Clear<i className="material-icons right">backspace</i>
						</button>
					</div>
				</div>
				<ModalConfirm ref={this.modalConfirm} title={this.state.question.title}
							  question={this.state.question.text}
							  onCancel={this.modalHandler.bind(this)} onConfirm={this.modalHandler.bind(this)}/>
			</div>);
	}
}

export default CreatePost;
