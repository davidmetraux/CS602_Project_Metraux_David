// File: App.js

import { useState, useEffect } from "react";


import * as clientModule from './clientCourseModule.js'

import RandomCourse from './ShowRandomCourse.js';
import CourseDescription from './ShowCourseDescription.js';
import CoordinatorInfo from './ShowCoordinatorInfo.js';
import Courses from './ListCourses.js';

import './App.css';


function App() {

 const [courses, setCourses] = useState([]);
 const [coordinator, setCoordinator] = useState();
 const [randomCourse, setRandomCourse] = useState();
 const [description, setDescription] = useState();

  useEffect(() => {
    getRandomCourse();
  }, []);

  async function  getRandomCourse() {
   
    console.log("Get random Course");

    const result = await clientModule.getRandomCourse();

    setRandomCourse(result.randomCourse);
  }

  async function  getCourseDescription(id) {

    console.log("Get Course Description", id);
    
    const result = await clientModule.getCourseDescription(id);
   
    setDescription(result.courseDescription);   
  }

  async function  getCoursesById(id) {

    console.log("Get Course By Id", id);

    const result = await clientModule.lookupByCourseId_V2(id);
   
    setCourses(result.courseIdLookup);   
  }

   async function  getCoursesByName(name) {

    console.log("Get Course By Name", name);

    const result = await clientModule.lookupByCourseName(name);
   
    setCourses(result.courseNameLookup);   
  }

  

  async function  getCoordinator(id) {

    console.log("Get Coordinator By Id", id);

    const result = await clientModule.lookupByCoordinator(id);
   
    setCoordinator(result.coordinator);   
  }


 return (
    <div className="container">
       <center><h2>CS602 Assignment5 - David Metraux</h2></center>
      
      <div className="row">
        
        <div className="col-sm-6">

         <RandomCourse course={randomCourse} 
                   refresh={getRandomCourse} 
                   describe={getCourseDescription} 
                   coordinatorLookup={getCoordinator}
                   />

          <p></p>

          <CoordinatorInfo coordinatorInfo={coordinator} 
                           describe={getCourseDescription}  />

        </div>

        <div className="col-sm-6">
         <CourseDescription courseInfo={description}  />
        </div>
        
      </div>

      <div className="row">
        <h3>Course Lookups</h3>  
        <div className="col-sm-10">
         <Courses courseList={courses} 
                   refreshById={getCoursesById}
                   refreshByName={getCoursesByName} 
                   describe={getCourseDescription} 
                   coordinatorLookup={getCoordinator} />
        </div>
        
      </div>

      

    </div>
  );
}

export default App;
