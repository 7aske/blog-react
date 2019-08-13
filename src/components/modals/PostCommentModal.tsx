import React from "react";
import M from "materialize-css";
import shortid from "shortid";
import axios from "axios";

type PostCommentModalProps = {
	postid: string;
	onNewComment: Function;
}
type PostCommentModalState = {
	author?: string;
	text?: string;
	email?: string;
	postid: string;
}

class PostCommentModal extends React.Component {
	props: PostCommentModalProps;
	modalId: string;
	state: PostCommentModalState;

	constructor(props: PostCommentModalProps) {
		super(props);
		this.props = props;
		this.state = {postid: props.postid};
		this.modalId = "modal" + shortid.generate();
		this.onChange = this.onChange.bind(this);
		this.submit = this.submit.bind(this);
	}

	onNewCommentHandler(comment:any){
		this.props.onNewComment(comment)
	}

	onChange(event: React.KeyboardEvent) {
		const type = (event.target as HTMLElement).attributes.getNamedItem("name")!.value;
		console.log(type);
		switch (type) {
			case "text":
				this.setState({text: (event.target as HTMLInputElement).value});
				break;
			case "email":
				this.setState({email: (event.target as HTMLInputElement).value});
				break;
			case "author":
				this.setState({author: (event.target as HTMLInputElement).value});
				break;
		}
	}

	submit() {
		console.log(this.state);
		const commentApiUrl = new URL(window.location.href);
		commentApiUrl.pathname = `/api/v1/posts/${this.state.postid}/comments`;
		commentApiUrl.port = "5000";

		const author = this.state.author;
		const email = this.state.email;
		const text = this.state.text;

		if (author !== undefined && author.length > 0 && email !== undefined && email.length > 0 && text !== undefined && text.length > 0) {
			axios.post(commentApiUrl.href, {
				data: JSON.stringify({
					author,
					email,
					text,
				}),
			}).then(res => {
				console.log(res);
				this.onNewCommentHandler(res.data);
				// window.location.reload();
			}).catch(err => console.error(err));
		}
	}

	componentDidMount(): void {
		M.Modal.init(document.querySelector("#" + this.modalId) as unknown as MElements, {});
	}

	render() {
		return (
			<div>
				<div className="right-align p-2">
					<button className="btn modal-trigger mr-1 orange black-text" data-target={this.modalId}>Comment
					</button>
				</div>
				<div id={this.modalId} className="modal">
					<div className="modal-content">
						<h4 id="modal-info-title">Post a comment</h4>
						<form className="col s12">
							<div className="row">
								<div className="input-field col s6">
									<i className="material-icons prefix">account_circle</i>
									<input onKeyDown={this.onChange} name="author" type="text" className="validate"/>
									<label htmlFor="reader-nickname">Nickname</label>
								</div>
								<div className="input-field col s6">
									<i className="material-icons prefix">email</i>
									<input onKeyDown={this.onChange} name="email" type="email" className="validate"/>
									<label htmlFor="reader-email">Email</label>
								</div>
							</div>
							<div className="row">
								<div className="input-field col s12 pl-3 pr-2">
									<i className="material-icons prefix">short_text</i>
									<textarea onKeyDown={this.onChange} name="text" className="materialize-textarea"/>
									<label htmlFor="reader-comment">Comment</label>
								</div>
							</div>
						</form>
					</div>
					<div className="modal-footer">
						<a className="modal-close waves-effect waves-green btn red mr-3">Close</a>
						<a onClick={this.submit} className="modal-close waves-effect waves-green btn">Submit</a>
					</div>
				</div>
			</div>
		);
	}
}

export default PostCommentModal;
