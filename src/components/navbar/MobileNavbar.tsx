import React from "react";
import M from "materialize-css";
import { Link } from "react-router-dom";

class MobileNavbar extends React.Component {
	id = "mobile-nav";

	componentDidMount(): void {
		M.Sidenav.init(document.querySelector(`#${this.id}`) as unknown as MElements, {
			edge: "left",
			draggable: true,
		});
	}

	render() {
		return (
			<ul className="sidenav grey darken-4" id={this.id}>
				<li className=""><h1 className="orange-text pl-2">.log</h1></li>
				<li className="mt-4"><Link to="/" className="orange-text">Home</Link></li>
			</ul>
		);
	}
}

export default MobileNavbar;
