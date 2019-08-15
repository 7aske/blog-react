import React from "react";
import shortid from "shortid";
import M, {Modal} from "materialize-css";

type ModalConfirmProps = {
	title: string;
	question: string;
	onCancel: Function;
	onConfirm: Function;
}
type ModalConfirmState = { id: string; instance: Modal | null }

class ModalConfirm extends React.Component {
	props: ModalConfirmProps;
	state: ModalConfirmState;

	constructor(props: ModalConfirmProps) {
		super(props);
		this.props = props;
		this.state = {id: "modal-question" + shortid.generate(), instance: null};
		this.onConfirmHandler = this.onConfirmHandler.bind(this);
		this.onCancelHandler = this.onCancelHandler.bind(this);
		this.open = this.open.bind(this);
	}

	componentDidMount(): void {
		const instance = M.Modal.init(document.querySelector("#" + this.state.id) as unknown as MElements, {preventScrolling: true});
		this.setState({instance});
	}

	open() {
		if (this.state.instance) {
			this.state.instance.open();
		}
	}

	onCancelHandler() {
		this.props.onCancel(false);
	}

	onConfirmHandler() {
		this.props.onConfirm(true);
	}

	render() {
		return (
			<div id={this.state.id} className="modal">
				<div className="modal-content">
					<h4 id="modal-question-title">{this.props.title}</h4>
					<p id="modal-question-body">{this.props.question}</p>
				</div>
				<div className="modal-footer">
					<a id="btn-modal-reject" onClick={this.onCancelHandler}
					   className="modal-close waves-effect waves-green btn red">Close</a>
					<a id="btn-modal-confirm" onClick={this.onConfirmHandler}
					   className="modal-close waves-effect waves-green btn">Confirm</a>
				</div>
			</div>);
	}
}

export default ModalConfirm;
