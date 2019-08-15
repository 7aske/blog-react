import React from "react";
import Login from "../login/Login";
import Creator from "./Creator";
import axios from "axios";
import Cookies from "universal-cookie";


type CreatorWrapperState = {
	loggedIn: boolean;
}
type CreatorWrapperProps = {}

class CreatorWrapper extends React.Component {
	props: CreatorWrapperProps;
	state: CreatorWrapperState;

	constructor(props: CreatorWrapperProps) {
		super(props);
		this.props = props;
		this.state = {loggedIn: false};
		this.autoLogIn = this.autoLogIn.bind(this);
	}

	onSubmit(form: any) {
		const url = new URL(window.location.href);
		url.port = url.port === "0" ? "80" : url.port;
		url.pathname = "/login";
		axios.post(url.href, null, {
			headers: {
				"TOKEN_ONLY": "true",
				"Username": form.username,
				"Password": form.password,
			},
		}).then(res => {
			const token = res.data.token;
			const cookies = new Cookies();
			cookies.set("authorization", "Bearer " + token, {path: "/"});
			console.log(cookies.get("authorization"));
			this.setState({loggedIn: true});
		}).catch(err => console.log(err));
	}

	autoLogIn(){
		const url = new URL(window.location.href);
		url.port = url.port === "0" ? "80" : url.port;
		url.pathname = "/validate";
		const cookies = new Cookies();
		let authCookie = cookies.get("authorization");
		if (authCookie) {
			authCookie = authCookie.replace("Bearer%20");
			const parts = authCookie.split(" ");
			if (parts.length === 2 && parts[0] === "Bearer"){
				axios.post(url.href, null, {headers: {"Token": parts[1]}}).then(res => {
					if (res.status === 200) {
						this.setState({loggedIn: true});
					}
				}).catch(err => console.log(err));

			}

		}
	}

	componentWillMount(): void {
		this.autoLogIn();
	}

	render() {
		return (<main className="container mt-2">
			{this.state.loggedIn ? <Creator/> : <Login onSubmitClick={this.onSubmit.bind(this)}/>}
		</main>);
	}
}

export default CreatorWrapper;
