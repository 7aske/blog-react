import React from "react";
import { default as SimpleMDE } from "simplemde";
import "simplemde/dist/simplemde.min.css";
import "../../stylesheets/creator.css";
import CreatePost from "./CreatePost";
import EditPosts from "./EditPosts";

type CreatorState = {
	createPostTitle: string;
	createPostDescription: string;
	createPostBody: string;
	editPostTitle: string;
	editPostDescription: string;
	editPostBody: string;
	mdEditor: SimpleMDE | null;
	mdEditorEdit: SimpleMDE | null;
}

type CreatorProps = {}

class Creator extends React.Component {
	props: CreatorProps;
	state: CreatorState;

	constructor(props: CreatorProps) {
		super(props);
		this.props = props;
		this.state = {
			createPostTitle: "",
			createPostDescription: "",
			createPostBody: "",
			editPostTitle: "",
			editPostDescription: "",
			editPostBody: "",
			mdEditor: null,
			mdEditorEdit: null,
		};
	}

	componentDidMount(): void {
		M.Tabs.init(document.querySelector("#creator-tabs") as unknown as MElements, {});
		window.scroll({top:0})
	}


	render() {
		return (
			<div className="row">
				<div className="col s12">
					<ul className="tabs grey darken-4" id="creator-tabs">
						<li className="tab col s3"><a className="orange-text active" href="#create-post">Create post</a>
						</li>
						<li className="tab col s3"><a className="orange-text" href="#edit-posts">Edit posts</a></li>
						<li className="tab col s3 disabled"><a className="grey-text text-darken-2" href="#test3">Disabled
							Tab</a></li>
						<li className="tab col s3 disabled"><a className="grey-text text-darken-2" href="#test4">Disabled
							Tab</a></li>
					</ul>
				</div>
				<CreatePost />
				<EditPosts />
				<div id="test3" className="col s12">Test 3</div>
				<div id="test4" className="col s12">Test 4</div>
			</div>
		);
	}
}

export default Creator;
