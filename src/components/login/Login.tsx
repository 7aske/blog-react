import React from "react";

type LoginProps = {
	onSubmitClick: Function;
}

type LoginState = {
	username?: string;
	password?: string;
}

class Login extends React.Component {
	props: LoginProps;
	state: LoginState;

	constructor(props: LoginProps) {
		super(props);
		this.props = props;
		this.state = {};
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(event:React.FormEvent) {
		event.preventDefault();
		const target = event.target as HTMLFormElement;
		this.props.onSubmitClick({username: (target[0] as HTMLInputElement).value, password: (target[1] as HTMLInputElement).value});
	}

	render() {
		return (
			<div className="row">
				<div className="col m12 s12 center">
					<div className="card white darken-1">
						<div className="card-content black-text">
							<form onSubmit={this.onSubmit} action="POST">
								<span className="card-title">Login</span>
								<div className="row">
									<div className="input-field col s12 m6 offset-m3">
										<i className="material-icons prefix">account_circle</i>
										<input name="username" type="text"
											   className="validate"/>
										<label htmlFor="username">Username</label>
									</div>
									<div className="row">
									</div>
									<div className="input-field col s12 m6 offset-m3">
										<i className="material-icons prefix">lock</i>
										<input name="password" type="password"
											   className="validate"/>
										<label htmlFor="password">Password</label>
									</div>
								</div>
								<button className="btn waves-effect waves-light"
										type="submit">Submit <i
									className="material-icons">send</i></button>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
			;
	}
}

export default Login;
