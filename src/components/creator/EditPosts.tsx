import React from "react";
import { default as SimpleMDE } from "simplemde";

type EditPostProps = {}
type EditPostState = {}

class EditPosts extends React.Component {
	state: EditPostState;
	props: EditPostProps;
	constructor(props: EditPostProps) {
		super(props);
		this.props = props;
		this.state = {};
		this.initEditor = this.initEditor.bind(this);
	}

	componentDidMount(): void {
		this.initEditor();
		const inputPostDescriptionEdit = document.querySelector("#input-post-description-edit") as HTMLFormElement;
		inputPostDescriptionEdit.focus();
		inputPostDescriptionEdit.blur();
	}

	fetchPosts() {

	}

	initEditor() {
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
	}

	render() {
		return (
			<div id="edit-posts" className="col s12">
				<div className="col m3 s12 card mt-0">
					<ul className="collection">
					</ul>
				</div>
				<div className="col m9 s12 card edit-card">
					<div className="row mt-2 mb-1">
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
					<div className="row mb-1">
						<div className="input-field col s12 mb-1 mt-1">
                                    <textarea id="input-post-description-edit"
											  className="materialize-textarea" defaultValue="Description"/>
							<label htmlFor="input-post-description-edit">Post Description</label>
						</div>
					</div>
					<textarea id="mde-anchor-edit"/>
					<div className="card-action p-0 pt-1">
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
		);
	}
}

export default EditPosts;
