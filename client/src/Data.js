import config from './config';

export default class Data {
  /*api method that interacts with the REST api
  * Parameters are the path as a string
  * the HTTP method to be sent to the REST api
  * the body of the request for POST or PUT methods
  * A boolean value decalring if authorization is required
  * the credentials of user's email and password if authorization is required
  * Returns a fetch method
  */
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
    //creating the options for the header of the request
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    //if their is a body present with the request then it is convereted to JSON
    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    //check if authorization is needed
    if(requiresAuth){
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

//---------------------------------------------------------------------------------------------------------------------//
// G E T S   T H E   C U R R E N T L Y   A U T H O R I Z E D   U S E R

  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, {emailAddress, password});
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

//---------------------------------------------------------------------------------------------------------------------//
// C R E A T E S   A   N E W   U S E R   A C C O U N T

  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return await response.json();
    }
    else {
      throw new Error();
    }
  }

//---------------------------------------------------------------------------------------------------------------------//
// R E Q U E S T   F O R   A L L   C O U R S E S 

async getCourses(){
  const response = await this.api('/courses', 'GET', null);
  if (response.status === 200) {
    return response.json().then(data => data);
  }
  else if (response.status === 401 || response.status === 400) {
    return response.json();
  }
  else {
    throw new Error();
  }
}

//---------------------------------------------------------------------------------------------------------------------//
//G E T   D E T A I L S   F O R   S P E C I F I E D   C O U R S E

async getCourseDetails(id){
  const response = await this.api('/courses/'+id, 'GET', null);
  if(response.status === 200){
    return response.json()
  }
  else if (response.status === 401 || response.status === 400) {
    return null;
  }
  else {
    throw new Error();
  }
}

//---------------------------------------------------------------------------------------------------------------------//
//A D D S   A   N E W   C O U R S E   T O   D A T A B A S E

async createCourse(course, {emailAddress, password}){
  const response = await this.api('/courses/', 'POST', course, true, {emailAddress, password});
  if(response.status === 201){
    return [];
  }
  else if (response.status === 401 || response.status === 400) {
    return response.json();
  }
  else {
    throw new Error();
  }

}

//---------------------------------------------------------------------------------------------------------------------//
// U P D A T E  T H E   D E T A I L S 

async updateCourseDetail(course, id, {emailAddress, password}){
  const response = await this.api('/courses/'+id, 'PUT', course, true, {emailAddress, password});
  if(response.status === 204){
    return [];
  }
  else if (response.status === 401 || response.status === 400) {
    return await response.json();
  }
  else {
    throw new Error();
  }
}

//---------------------------------------------------------------------------------------------------------------------//
// D E L E T E S   A    C O U R S E 

async deleteCourse(courseId, {emailAddress, password}){
  const response = await this.api('/courses/'+courseId, 'DELETE', null, true, {emailAddress, password});
  if(response.status === 204){
    return [];
  }
  else {
    throw new Error();
 }
}
}
//---------------------------------------------------------------------------------------------------------------------//