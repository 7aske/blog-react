import React from "react";
import axios from "axios";

type VoteControllerState = {
	id: string;
	type: string;
	votes: number;
	vote: "up" | "down" | "none";
}

type VoteControllerProps = {
	id: string;
	votes: number;
	type: "comment" | "post";
}

class VoteController extends React.Component {
	props: VoteControllerProps;
	state: VoteControllerState;
	commentApiUrl: URL;
	postVoteApiUrl: URL;

	constructor(props: VoteControllerProps) {
		super(props);
		this.props = props;
		this.state = {
			id: props.id,
			type: props.type,
			votes: props.votes,
			vote: "none",
		};
		this.commentApiUrl = new URL(window.location.href);
		this.postVoteApiUrl = new URL(window.location.href);
		this.commentApiUrl.pathname = `/api/v1/posts/${this.state.id}/comments`;
		this.postVoteApiUrl.pathname = `/api/v1/posts/${this.state.id}`;
		this.commentApiUrl.port = window.location.port === "0" || window.location.port === "" ? "80" : window.location.port;
		this.postVoteApiUrl.port = window.location.port === "0" || window.location.port === "" ? "80" : window.location.port;
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
		console.log(event);
		const btn = event.target as HTMLElement;
		let delta = parseInt(btn.attributes.getNamedItem("data-delta")!.value);

		let vote = "none";
		if (this.state.vote === "none" && delta === -1) {
			vote = "down";
		} else if (this.state.vote === "none" && delta === 1) {
			vote = "up";
		} else if (this.state.vote === "up" && delta === 1) {
			delta = -1;
			vote = "none";
		} else if (this.state.vote === "down" && delta === -1) {
			delta = 1;
			vote = "none";
		} else if (this.state.vote === "up" && delta === -1) {
			vote = "down";
			delta = -2;
		} else if (this.state.vote === "down" && delta === 1) {
			vote = "up";
			delta = 2;
		}

		console.log("Delta:", delta);
		this.setState({vote});


		axios.post(this.postVoteApiUrl + `?delta=${delta}`).then(res => {
			const data = res.data;
			console.log("Total votes:", data.votes);
			this.setState({votes: data.votes});
		}).catch(err => console.error(err));
	}

	render() {
		return (<div>
			<div className="vote-indicator"><span
				className="orange-text font-weight-bold">{this.state.votes}</span>
			</div>
			<VoteButton disabled={this.state.vote === "up"} delta={1} type={"up"}
						onClick={this.handleClick.bind(this)}/>
			<VoteButton disabled={this.state.vote === "down"} delta={-1} type={"down"}
						onClick={this.handleClick.bind(this)}/>
		</div>);
	}
}

type VoteButtonProps = {
	delta: number;
	type: "up" | "down";
	onClick: Function;
	disabled: boolean;
}

class VoteButton extends React.Component {
	props: VoteButtonProps;

	constructor(props: VoteButtonProps) {
		super(props);
		this.props = props;
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
		this.props.onClick(event);
	}

	render() {
		return (<a data-delta={this.props.delta} onClick={this.handleClick}
				   className={this.props.disabled ? "btn-vote white-text mr-0 disabled" : "btn-vote white-text mr-0"}><i
			className="material-icons">{this.props.type === "up" ? "keyboard_arrow_up" : "keyboard_arrow_down"}</i></a>);
	}
}

export default VoteController;

