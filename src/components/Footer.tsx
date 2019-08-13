import React from "react";

class Footer extends React.Component {
	render() {
		return (
			<footer className="page-footer grey darken-4 mt-5">
				<div className="container">
					<div className="row">
						<div className="col l6 s12">
							<h5 className="orange-text">Hi,</h5>
							<p className="orange-text">Feel free to contact regarding any IT related topic.</p>
						</div>
						<div className="col l4 offset-l2 s12">
							<h5 className="orange-text">Links</h5>
							<ul>
								<li><a className="orange-text" href="/">Home</a></li>
								<li><a className="orange-text" href="http://portfolio.7aske.com">Portfolio</a></li>
								<li><a className="orange-text" href="https://github.com/7aske">GitHub</a></li>
								<li><a className="orange-text"
									   href="https://www.linkedin.com/in/nikola-tasi%C4%87-87b8bb115/">LinkedIn</a></li>
							</ul>
						</div>
					</div>
				</div>
				<div className="footer-copyright">
					<div className="container orange-text text-lighten-1 pl-2 pr-2">
						© {new Date().getFullYear()} Nikola Tasic
						<a className="orange-text text-lighten-1 right" href="#top">Back to Top</a>
					</div>
				</div>
			</footer>);
	}
}

export default Footer;
