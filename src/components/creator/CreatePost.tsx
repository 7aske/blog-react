import React from "react";
import { default as SimpleMDE } from "simplemde";

type CreatePostProps = {}
type CreatePostState = {}

class CreatePost extends React.Component {
	state: CreatePostState;
	props: CreatePostProps;

	constructor(props: CreatePostProps) {
		super(props);
		this.props = props;
		this.state = {};
		this.initEditor = this.initEditor.bind(this);
	}

	componentDidMount(): void {
		this.initEditor();
	}

	initEditor() {
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
	}

	render() {
		return (
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
			</div>);
	}
}

export default CreatePost;
