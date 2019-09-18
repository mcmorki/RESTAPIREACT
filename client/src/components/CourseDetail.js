import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component{
  state = {
    details: [],
    name: '',
    authenticated: false

  }


async componentDidMount(){
  const {context} = this.props;
  const {match} = this.props;
  await context.data.getCourseDetails(match.params.id)
    .then(details=>{
      console.log(details)
      if(details === 404){
        return this.props.history.push('/notfound')
      }
      
      const name = details.User.firstName + ' ' + details.User.lastName;
      if(context.authenticatedUser != null){
        if( context.authenticatedUser.id  === details.User.id){
          this.setState({
            authenticated: true
          });
        } else {
          this.setState({
            authenticated: false
          });
      }
    }
      this.setState({
        details,
        name
      })
    })
}
render(){
  const {details, name, authenticated} = this.state;
  const { context } = this.props;
  let emailAddress;
  let password;
  if(authenticated){
     emailAddress = context.authenticatedUser.emailAddress
     password = context.userPassword
   }
  return(
    <div>
      <div className="actions--bar">
        <div className="bounds">
        <div className="grid-100">
        {authenticated ?
            <span>
                <a className="button" href={"/courses/"+this.props.match.params.id+"/update"} onClick={()=>context.actions.updateCourseDetail(details.userId, {emailAddress, password})}> Update Course</a>
                <button className="button" onClick={()=>context.data.deleteCourse(details.id, {emailAddress, password})
                .then(
                  ()=> this.props.history.push('/')
                )}>Delete Course</button>
                 
                
            </span>
            :
            <span></span>
          }

          <a className="button button-secondary" href="/">Return to List</a>
          </div>
        </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{details.title}</h3>
            <p>By {name}</p>
          </div>
          <div className="course--description">
            <ReactMarkdown source={details.description} />
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
              <h4>Estimated Time</h4>
              <h3>{details.estimatedTime}</h3>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <ul>
                  <ReactMarkdown source={details.materialsNeeded} />
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  )
}
}
