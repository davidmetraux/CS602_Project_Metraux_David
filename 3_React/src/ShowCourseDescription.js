// File: ShowCourseDescription.js

export default function CourseDescription({ courseInfo }) {
  
  if (courseInfo)
    return (
      <div>      
         
        <h3>{courseInfo.course}</h3>
            <b>
              {courseInfo.title} 
            </b>
            <p>{courseInfo.content}</p>
        
      </div>
    );

}