import React, { Component } from 'react';

class Signup extends Component {
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

    if(!fields['name']) {
      isValid = false;
      formError['name'] = 'Name is required';
    }

    if(typeof fields["name"] !== "undefined"){
       if(!fields["name"].match(/^[a-zA-Z]+$/)){
          isValid = false;
          formError["name"] = "Only letters";
       }        
    }

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
    } else if(fields['password'] !== 'undefined') {
      var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-z\d!@#$%^&*]{8}/;
      if(!regex.test(fields['password'])) {
        isValid = false;
        formError['password'] = 'Password is invalid';   
      }
    }

    if(!fields['confirmpassword']) {
      isValid = false;
      formError['confirmpassword'] = 'Confirm password is required';
    }

    if(fields['confirmpassword'] !== 'undefined') {
      if(fields['password'] !== fields['confirmpassword']) {
        isValid = false;
        formError['confirmpassword'] = 'Password does not match';
      }
    }

    if(!fields['phone']) {
      isValid = false;
      formError['phone'] = 'Phone is required';
    } else if(typeof fields['phone'] !== 'undefined') {
        if(/^(?=.*[\d])[\d]{5}/.test(fields['phone']) === false) {
          isValid = false;
          formError['phone'] = 'Phone must be numbers with minimum 5 characters';
        }
    }
    
    this.setState({ formError:formError });
    return isValid;
  }
  handleSubmit(e) {
    e.preventDefault();
    if(this.validateForm()) {
      let formData = this.state.fields;
    fetch('http://localhost/studentapi/public/api/v1/register', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if(res.ok) {
          throw new Error('Api Error: Something went wrong...')

          return res.json()
        } else {
          throw new Error('Api Error: Something went wrong...')
        }
      })
      .then(data => {
        this.setState({resData:data, isLoading: false})
      })
      .catch(error => {
        this.setState({error, isLoading:false})
        // this.setState({error, isLoading:false})
        })
    }

  }

  componentDidMount() {
    this.setState({ isLoading:false });
    // predata ajax
  }

renderProducts() {  
  let resData = this.state.resData.response;
  return Object.keys(resData).map((name, index) => {
             return this.renderTemplate(resData[name], name)
          });
}

renderTemplate(temp, name) {
   return temp.map((formError, index) =>  { 
     return <p key={index}>{formError}</p>
    })
}
  render() {

    const isLoading = this.state.isLoading;
    // const resData = this.state.resData.response;
    const isSuccess = this.state.resData.success;
    const error = this.state.error;
    // console.log(error);
    // if (error) {
    //   return <p>{error.message}</p>;
    // }

    if(isLoading) {
      return <p> Loading ... </p>;
    }
    
    return (

      <div>
        <h1> Register </h1>
        {error != null ? <div className="alert alert-danger"> 
            { error.toString() } </div>: ''}
        {isSuccess === true ? <p className="alert alert-success"> Success </p>: ''}
        {isSuccess === false ? <div className="alert alert-danger"> 
            { this.renderProducts() } </div>: ''}
        <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" onChange={this.handleChange} name="firstname" className="form-control" />
            <span style={{color: "red"}}> {this.state.formError['name']} </span>
          </div>

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
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input type="password" onChange={this.handleChange} name="confirmpassword" className="form-control" />
            <span style={{color: "red"}}> {this.state.formError['confirmpassword']} </span>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Mobile</label>
            <input type="text" onChange={this.handleChange} name="phone" className="form-control" />
            <span style={{color: "red"}}> {this.state.formError['phone']} </span>
          </div>

          <div className="form-group">
            <button className="btn btn-primary">Sign Up</button>
          </div>

        </form>
        </div>
      </div>

    );
  }
}

export default Signup;