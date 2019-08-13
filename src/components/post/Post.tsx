import React from "react";
import "../../stylesheets/post.css";
import marked from "marked";
import VoteController from "./VoteController";
import PostType from "../../@types/Post";

type PostProps = {
	match?: any;
	post: PostType
}

type PostState = {
	post: PostType | null;
}

class Post extends React.Component {
	props: PostProps;
	state: PostState;

	constructor(props: PostProps) {
		super(props);
		this.props = props;
		this.state = {post: props.post};
	}

	componentDidMount(): void {
		const mdContainer = document.querySelector("#post-body-md");
		mdContainer!.innerHTML = marked(mdContainer!.innerHTML);
	}

	render() {
		return (<div className="row mb-1 mt-2">
			<div className="col s12 m12" id="post">
				<div className="card grey lighten-5">
					<div className="card-content pt-1">
                <span className="card-title" style={{borderBottom: "2px solid orange"}}>
                    <h2>
                        {this.props.post ? this.props.post.title : ""}
                    </h2>
                </span>
						<p id="post-body-md">{this.props.post ? this.props.post.body : ""}</p>
					</div>
					<div className="card-action grey darken-4 pb-1 pt-2 pr-4">
						<div className="row mb-1">
							<div className="col s12 m6 black-text p-1">
								<VoteController type={"post"} id={this.state.post ? this.state.post.id : ""}
												votes={this.state.post ? this.state.post.votes : 0}/>
							</div>
							<div className="col s12 m6 white-text right-align date-posted-container p-1 pr-0">
								Posted at <span
								className="text-darken-5 orange-text">{this.props.post ? this.props.post.date_posted : ""}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
}

export default Post;
