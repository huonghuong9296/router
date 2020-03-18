import React, { useState } from 'react';
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

function LoginPage(props){
	const [password, setPassword] = useState('');
	let history = useHistory();
	let location = useLocation();
		  
	function handleInput(e){
		setPassword(e.target.value);
	}
	
    function login(){					
		// console.log(this.state);
		if(password === "123"){
			auth.authenticate(()=>{
				history.replace(location.state);
			});		
		}else{
			return <h3>Password is incorrect! Please try again!</h3>
		}
	}
	
	return (
		<div>
			<p>You must log in to view the page at protected</p>
			<input id="txt-input" placeholder="Enter password"
			name="password" value={password} onChange ={handleInput}
			
			></input>
			<button onClick={login}>Log in</button>
		</div>
	);
}

function App(){
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

export default App;
