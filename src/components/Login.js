import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields:{},
      isLoading: false,
      error:null,
      resData:{},
      formError:{}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let fieldsName = e.target.name; 
    let fieldsValue = e.target.value;
    let fields = this.state.fields;
    fields[fieldsName] =  fieldsValue;
    this.setState({ fields });
  }

  validateForm() {
    let fields = this.state.fields;
    let isValid = true;
    let formError = {};

    if(!fields['email']) {
      isValid = false;
      formError['email'] = 'Email is required';
    }

     if(typeof fields["email"] !== "undefined"){
         let lastAtPos = fields["email"].lastIndexOf('@');
         let lastDotPos = fields["email"].lastIndexOf('.');

         if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
            isValid = false;
            formError["email"] = "Email is not valid";
          }
     } 

    if(!fields['password']) {
      isValid = false;
      formError['password'] = 'Password is required';
    }
    
    this.setState({ formError:formError });
    return isValid;
  }
  handleSubmit(e) {
    e.preventDefault();
    let currentComponent = this;
    if(this.validateForm()) {
      let formData = this.state.fields;
    fetch('http://localhost/studentapi/public/api/v1/login', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if(res.ok) {          
          return res.json()
        } else {
          // console.log(res.json());
          throw res.json()
          // throw new Error('Api Error: Something went wrong...')
        }
      })
      .then(
        (data) => {
        // console.log(data);
        this.setState({resData:data, isLoading: false})
      })

      .catch((error) => {
         Promise.resolve(error)
         .then(function(er) {
          // console.log(er.error);
            currentComponent.setState({ error:er.error })
         })
      })

    }

  }

  componentDidMount() {
    this.setState({ isLoading:false });
    // predata ajax
  }

  renderErrors() {  
    let resData = this.state.resData.response;
    return Object.keys(resData).map((name, index) => {
               return this.ErrorLists(resData[name], name)
            });
  }

  ErrorLists(temp, name) {
     return temp.map((formError, index) =>  { 
       return <p key={index}>{formError}</p>
      })
  }

  render() {

    const isLoading = this.state.isLoading;
    const resData = this.state.resData.response;
    const isSuccess = this.state.resData.success;
    const error = this.state.error;

    console.log(resData.token);
    // console.log('axa',error);
    // if (error) {
    //   return <p>{error.message}</p>;
    // }

    if(isLoading) {
      return <p> Loading ... </p>;
    }
    
    return (

      <div>
        <h1> Login </h1>
        {error != null ? <div className="alert alert-danger"> 
            { error.toString() } </div>: ''}
        {isSuccess === true ? <p className="alert alert-success"> Success </p>: ''}
        {isSuccess === false ? <div className="alert alert-danger"> 
            { this.renderErrors() } </div>: ''}
        <div>
        <form onSubmit={this.handleSubmit}>
        
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" onChange={this.handleChange} name="email" className="form-control" />
            <span style={{color: "red"}}> {this.state.formError['email']} </span>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" onChange={this.handleChange} name="password" className="form-control" />
            <span style={{color: "red"}}> {this.state.formError['password']} </span>
          </div>

          <div className="form-group">
            <button className="btn btn-primary">Sign In</button>
          </div>

        </form>
        </div>
      </div>

    );
  }
}

export default Login;