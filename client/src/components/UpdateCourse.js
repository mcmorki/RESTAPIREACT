import React, { Component } from 'react';
import Form from './Form.js';


export default class UpdateCourse extends Component{
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    name: '',
    materialsNeeded: '',
    errors: []
  }


async componentDidMount(){
  const {context} = this.props;
  const {match} = this.props;
  await context.data.getCourseDetails(match.params.id)
    .then(details=>{
      const name = details.User.firstName + ' ' + details.User.lastName;

      const {
              title,
              description,
              estimatedTime,
              materialsNeeded
            } = details;

      this.setState({
        title,
        description,
        estimatedTime,
        materialsNeeded,
        name,
        details
      })
      console.log(this.state);
    })
}



  render(){
    const {
           title,
           description,
           estimatedTime,
           materialsNeeded,
           name,
           errors
          } = this.state;
    return(
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Update Course"
          elements={() => (
            <React.Fragment>
            <div className="grid-66">
            <div className="course--header">
              <div>
                <input
                  id="title"
                  name="title"
                  className="input-title course--title--input"
                  type="text"
                  value={title}
                  onChange={this.change}
                  placeholder="Title" />
                </div>
              <p>by {name}</p>
            </div>
            <div className="course--description">
              <div>
                <textarea
                  id="description"
                  name="description"
                  type="text"
                  value={description}
                  onChange={this.change}
                  placeholder="Course Description"
                />
              </div>
            </div>
            </div>

            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input
                      id="estimatedTime"
                      name="estimatedTime"
                      type="text"
                      value={estimatedTime}
                      onChange={this.change}
                      placeholder="Course Description"
                      />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea
                        id="materialsNeeded"
                        name="materialsNeeded"
                        type="text"
                        value={materialsNeeded}
                        onChange={this.change}
                        placeholder="Materials Needed"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            </React.Fragment>
          )}
          />
        </div>
      </div>
    )
  }
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }
//------------------------------------------------------------------------------------------------------------------------------//  

  submit = () => {
    console.log(this.state.details);
    //testing purposes 

    const {context} = this.props;
    const {title, description, estimatedTime, materialsNeeded} = this.state;
    const {id} = this.state.details;
    const {emailAddress} = context.authenticatedUser;
    const password = context.userPassword;
    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded
    }
    context.data.updateCourseDetail(course, id, {emailAddress, password})
      .then(errors =>{
        const errorArr = Object.values(errors);
        if(errorArr.length){
          this.setState(()=>{
            return { errors: errorArr };
          })
        } else {
          this.props.history.push('/courses/'+id);
        }
      }).catch(err =>{
        console.log(err);
      });
  }

//------------------------------------------------------------------------------------------------------------------------------//  

  cancel = () => {
    this.props.history.push('/');
  }
}
