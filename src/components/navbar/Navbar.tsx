import React from "react";
import { Link } from "react-router-dom";



class Navbar extends React.Component {
	render() {
		return (
			<nav id="top">
				<div className="nav-wrapper grey darken-4">
					<Link to="/" className="brand-logo pl-3 orange-text">.log</Link>
				</div>
			</nav>
		);
	}
}

export default Navbar;
