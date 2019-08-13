import React from "react";
import { Link } from "react-router-dom";
import PostType from "../../@types/Post";


type PostProps = {
	post: PostType;
}

class PostPreview extends React.Component {
	url: string;
	props: PostProps;

	constructor(props: PostProps) {
		super(props);
		this.props = props;
		this.url = "/posts/" + this.props.post.id;
	}

	render() {
		return (<div className="row">
			<div className="col s12 m12">
				<div className="card grey darken-4">
					<div className="card-content white-text">
						<div className="card-title row">
							<Link className="white-text" to={this.url}>
								<h3 className="col m10 s12 p-2 mt-1 mb-1">
									{this.props.post.title}
								</h3>
								<h6 className="orange-text col m2 s12 mt-0 pt-2 right-align">
									<small>{this.props.post.category}</small></h6>
							</Link>
						</div>
						<p>{this.props.post.description}</p>
					</div>
					<div className="card-action white-text">
						<div className="row mb-1">
							<div className="col s12 m6 black-text p-1">
								<a href={this.url}
								   className="right-align mr-2">Read More</a>
								<a href={this.url}
								   className="right-align mr-2">{this.props.post.comments.length} comments</a>
								<a href={this.url}
								   className="right-align mr-0">{this.props.post.votes} votes</a>
							</div>
							<div className="col s12 m6 grey-text right-align date-posted-container p-1">
								Posted at <span className="orange-text">{this.props.post.date_posted}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
}

export default PostPreview;
