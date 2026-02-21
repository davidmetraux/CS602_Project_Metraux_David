// File: ShowCoordinatorInfo.js

export default function CoordinatorInfo({ coordinatorInfo, describe }) {
  
  function handleCourseClick(event, id) {
    event.preventDefault();
    console.log("Handle Course", id);
    describe(id);
  }

  if (coordinatorInfo)
    return (

      <div>      
         
        <b>Coordinator:{coordinatorInfo.firstName} {coordinatorInfo.lastName}</b>
        <p></p>
        <p>Contact Email: {coordinatorInfo._id}@bu.edu</p>
        <p></p>
        <p>Coordinator for the following courses:</p>
        <ol>
          {coordinatorInfo.courses.map((course)=> <li><a href="dummy" onClick={e => handleCourseClick(e, course._id)}>{course._id}</a> - {course.courseName}</li> )}
        </ol>
        
        
      </div>
      )

}
