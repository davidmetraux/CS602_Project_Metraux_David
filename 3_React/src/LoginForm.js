export default function LoginForm({loginHandler}) {

	function handleLoginSubmit(event) {  
	    event.preventDefault();
	    
	    const formData = new FormData(event.target);
	    const formJson = Object.fromEntries(formData.entries());
	    
	    loginHandler(formJson.id1, formJson.id2);         
	}
	
	return (
	  <div className="container">
       <center><h2>Login Page</h2></center>
		<div className="row">
          <form  onSubmit={handleLoginSubmit}>
            <div className="form-group row">
              <label htmlFor="id1">Username</label>
              <input type="text" placeholder="Enter username..." 
                className="form-control" name="id1" id="id1" required />
            </div>
            <div className="form-group row">
              <label htmlFor="id2">Password</label>
              <input type="password" placeholder="Enter password..." 
                className="form-control" name="id2" id="id2" required />
            </div>
            
            <div className="form-group row">
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
         </form>
        </div>
      </div>
	);
}