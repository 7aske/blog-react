import React from "react";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min";
import "./stylesheets/materialicons.css";
import "./stylesheets/helpers.css";
import "./stylesheets/common.css";
import "./stylesheets/index.css";
import Navbar from "./components/navbar/Navbar";
import MobileNavbar from "./components/navbar/MobileNavbar";
import PostContainer from "./components/post/PostContainer";
import PostPreviewContainer from "./components/post/PostPreviewContainer";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CreatorWrapper from "./components/creator/CreatorWrapper";

const App: React.FC = () => {
	return (
		<div className="App">
			<Router>
				<Navbar/>
				<MobileNavbar/>
				<Route exact path="/" component={PostPreviewContainer}/>
				<Route exact path="/creator" component={CreatorWrapper}/>
				<Route path="/posts/:postid" component={PostContainer}/>
				<Footer/>
			</Router>
		</div>
	);
};

export default App;
