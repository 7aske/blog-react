import React from "react";
import { default as SimpleMDE } from "simplemde";
import "simplemde/dist/simplemde.min.css";
import "../../stylesheets/creator.css";

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
		this.initEditors = this.initEditors.bind(this);
		this.fetchPosts = this.fetchPosts.bind(this);
	}

	componentDidMount(): void {
		M.Tabs.init(document.querySelector("#creator-tabs") as unknown as MElements, {});
		this.initEditors();
	}

	fetchPosts() {

	}

	initEditors() {
		const mdEditor = new SimpleMDE({
			blockStyles: {
				bold: "__",
				italic: "_",
			},
			element: document.getElementById("mde-anchor") as unknown as HTMLTextAreaElement,
			forceSync: true,
			hideIcons: ["guide", "heading"],
			indentWithTabs: false,
			// initialValue: "Hello world!",
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

		const mdEditorEdit = new SimpleMDE({
			blockStyles: {
				bold: "__",
				italic: "_",
			},
			element: document.getElementById("mde-anchor-edit") as unknown as HTMLTextAreaElement,
			forceSync: true,
			hideIcons: ["guide", "heading"],
			indentWithTabs: false,
			initialValue: "Hello world!",
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
			status: ["autosave", "lines", "words", "cursor"],
			styleSelectedText: false,
			tabSize: 4,
			toolbarTips: true,
		});
		this.setState({mdEditor, mdEditorEdit});
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
				<div id="create-post" className="col s12">
					<div className="card create-card p-4">
						<div className="row mt-4">
							<div className="input-field col s6">
								<input id="input-post-title" defaultValue="Title" type="text" className="validate"/>
								<label className="active" htmlFor="input-post-title">Title</label>
							</div>
							<div className="input-field col s6">
								<input id="input-post-category" defaultValue="Category" type="text"
									   className="validate"/>
								<label className="active" htmlFor="input-post-category">Category</label>
							</div>
						</div>
						<div className="row">
							<div className="input-field col s12">
                                    <textarea id="input-post-description"
											  className="materialize-textarea" defaultValue="Description"/>
								<label htmlFor="input-post-description">Post Description</label>
							</div>
						</div>
						<textarea id="mde-anchor"/>
						<div className="card-action">
							<button id="btn-submit-post" className="btn waves-effect waves-light mb-3" type="button"
									name="action">
								Submit
								<i className="material-icons right">send</i>
							</button>
							<button id="btn-reset" className="btn waves-effect waves-light red mb-3" type="button"
									name="action">Clear
								<i className="material-icons right">backspace</i>
							</button>
						</div>
					</div>
				</div>
				<div id="edit-posts" className="col s12">
					<div className="col m3 s12 card">
						<ul className="collection">
						</ul>
					</div>
					<div className="col m9 s12 card edit-card">
						<div className="row mt-4">
							<div className="input-field col s6">
								<input id="input-post-title-edit" defaultValue="Title" type="text"
									   className="validate"/>
								<label className="active" htmlFor="input-post-title-edit">Title</label>
							</div>
							<div className="input-field col s6">
								<input id="input-post-category-edit" defaultValue="Category" type="text"
									   className="validate"/>
								<label className="active" htmlFor="input-post-category-edit">Category</label>
							</div>
						</div>
						<div className="row">
							<div className="input-field col s12">
                                    <textarea id="input-post-description-edit"
											  className="materialize-textarea" defaultValue="Description"/>
								<label htmlFor="input-post-description-edit">Post Description</label>
							</div>
						</div>
						<textarea id="mde-anchor-edit"/>
						<div className="card-action">
							<button id="btn-submit-post-edit" className="btn waves-effect waves-light mb-3"
									type="button"
									name="action">
								Submit
								<i className="material-icons right">send</i>
							</button>
							<button id="btn-reset-edit" className="btn waves-effect waves-light red mb-3" type="button"
									name="action">
								Clear
								<i className="material-icons right">backspace</i>
							</button>
						</div>
					</div>
				</div>
				<div id="test3" className="col s12">Test 3</div>
				<div id="test4" className="col s12">Test 4</div>
			</div>
		);
	}
}

export default Creator;
