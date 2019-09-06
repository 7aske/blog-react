import React from "react";
import CommentType from "../../@types/Comment";
import VoteController from "./VoteController";

type CommentProps = {
	postid: string;
	comment: CommentType;
}

type CommentState = {
	postid: string;
	comment: CommentType;
}


class Comment extends React.Component {
	props: CommentProps;
	state: CommentState;

	constructor(props: CommentProps) {
		super(props);
		this.props = props;
		this.state = {comment: this.props.comment, postid: this.props.postid};
	}

	render() {
		return (
			<div className="row mb-0" id="comment-{{ comment.id }}" data-id="{{ comment.id }}">
				<div className="col s12 m12">
					<div className="card grey darken-4 mb-1">
						<div className="card-content white-text pr-4 pl-3 pt-2 pb-0">
							<span className="card-title mt-1"><h6>{this.state.comment.author}</h6></span>
						</div>
						<div className="pr-4 pl-4 pb-2">
							<p className="mb-2 white-text"
							   style={{wordWrap: "break-word", textAlign: "justify"}}>{this.state.comment.text}</p>
						</div>
						<div className="card-action pr-3 pl-2 pt-1 pb-0">
							<div className="row ml-1 mb-0">
								{/*<div className="col m6 s12">*/}
								{/*	<div className="vote-indicator"><span*/}
								{/*		className="orange-text font-weight-bold">{this.state.comment.votes}</span></div>*/}
								{/*	<a data-id="{{ comment.id }}" data-delta="1"*/}
								{/*	   className="btn-vote white-text mr-0"><i*/}
								{/*		className="material-icons">keyboard_arrow_up</i></a>*/}
								{/*	<a data-id="{{ comment.id }}" data-delta="-1"*/}
								{/*	   className="btn-vote white-text mr-0"><i*/}
								{/*		className="material-icons">keyboard_arrow_down</i></a>*/}
								{/*</div>*/}
								{/*<div className="col m6 s12 right-align date-posted-container pb-1">*/}
								{/*	<small className="grey-text">Posted at <span*/}
								{/*		className="orange-text">{this.state.comment.date_posted}</span></small>*/}
								{/*</div>*/}
								<VoteController id={this.state.postid} votes={this.state.comment.votes} type={"comment"} commentid={this.state.comment.id}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Comment;
