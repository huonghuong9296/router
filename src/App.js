import React from 'react';
import './App.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
	useHistory,
	useLocation
} from "react-router-dom";
// import { render } from '@testing-library/react';

const auth = {
	isAuthenticated: false,
	authenticate(cb) {
	  auth.isAuthenticated = true;
	  setTimeout(cb, 100); 
	},
	signout(cb) {
	  auth.isAuthenticated = false;
	  setTimeout(cb, 100);
	}
};
  
function AuthButton() {
	let history = useHistory();
  
	return auth.isAuthenticated ? (
		<p>
			You are logged in ^ ^
			<button
			onClick={() => {
				auth.signout(() => history.push("/"));
			}}
			>
			Sign out
			</button>
		</p>
	) : (
	  	<p>You are not logged in.</p>
	);
}
  
function PrivateRoute({ children, ...rest }) {
	return (
		<Route
			{...rest}
			render={({ location }) =>
				auth.isAuthenticated ? (children) : (<Redirect to={{
															pathname: "/login",
															state: { from: location }
				}}
				/>
			)
			}
		/>
	);
}
  
function PublicPage() {
	return <h3>Public</h3>;
  }
  
function ProtectedPage() {
	return <h3>Protected</h3>;
}

class LoginPage extends React.Component {
	constructor(props){
		super(props);
		// let history = useHistory();
		// let location = useLocation();
		// let from = location.state || { from: { pathname: "/" } };
		this.state = {
			password: ''
			// isLoggedIn: false
		}
		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e){
		this.setState({
			password : e.target.value
		})	
	}
	
    login = () => {		
		// let history = useHistory();
		// let location = useLocation();

  		// let { from } = location.state || { from: { pathname: "/" } };			
		console.log(this.state);
		if(this.state.password === "123"){
			auth.authenticate(()=>{
				useHistory().replace(useLocation().state);
			});		
		}	
	}
	
	render(){
		return (
			<div>
				<p>You must log in to view the page at protected</p>
				<input id="txt-input" placeholder="Enter password"
				name="password" value={this.state.password} onChange ={this.handleInput}
				
				></input>
				<button onClick={this.login()}>Log in</button>
			</div>
		);
	}
	
}

class App extends React.Component{
	render(){
		return (
			<Router>
				<div className="App">
					
					<h3>Menu:</h3>
					<ul>
						<li><Link to="/public">Public Page</Link></li>
						<li><Link to="/protected">Protected Page</Link></li>
					</ul>
					<h3>Result:</h3>
					<Switch>
						<Route path="/public" >
							<PublicPage />
						</Route>
						<Route path="/login" >
							<LoginPage />
						</Route>
						<PrivateRoute path="/protected">
							<ProtectedPage />
						</PrivateRoute>
						{/* <Route path="*">
							<h1>404 NOT FOUND</h1>
						</Route> */}
					</Switch>
					<AuthButton />
				</div>
			</Router>
		);	
	}
}

export default App;
