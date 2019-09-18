import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

//First create context
const Context = React.createContext();

export class Provider extends Component {
  /*create state that saves both the cookies with authenticated approval and a plain text
  *password that can be sent to the api
  */
  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    userPassword: Cookies.getJSON('userPassword') || null
  };
 
  constructor() {
    super();
    this.data = new Data();
  }

 
  render() {
    const { authenticatedUser, userPassword } = this.state;
    const value = {
      authenticatedUser,
      userPassword,
      data: this.data,
      actions:{
        signIn: this.signIn,
        signOut: this.signOut
      
      }
    }
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>
    );
  }
  
//---------------------------------------------------------------------------------------------------------------------//

  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    if( user !== null){
      this.setState(()=>{
          return{
            authenticatedUser: user,
            userPassword: password
          };
        });
        Cookies.set('authenticatedUser', JSON.stringify(user), {expires: 1});
        Cookies.set('userPassword', JSON.stringify(password), {expires: 1});
      }
      return user
    }

//---------------------------------------------------------------------------------------------------------------------//    
    
  signOut = () => {
    this.setState(()=>{
      return{
        authenticatedUser: null,
        userPassword: null
      };
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('userPassword');
  }

}

export const Consumer = Context.Consumer;

/*
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 * method from the Treehouse React Authentication course by Guil Hernandez
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
