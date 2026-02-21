// File: ShowRandomCourse.js

export default function RandomCourse({ course, refresh, describe, coordinatorLookup}) {
  
  function handleSubmitDescription(event) {  
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formJson = Object.fromEntries(formData.entries());
    
    describe(formJson.id1);         
  }

  function handleCourseClick(event, id) {
    event.preventDefault();
    console.log("Handle Course", id);
    describe(id);
  }

  function handleCoordinatorClick(event, id) {
    event.preventDefault();
    console.log("Handle Coordinator", id);
    coordinatorLookup(id);
  }

  if (course)
    return (
      <div>   

        <h4>A Random Course</h4>
           
            <div className="row">
             <b>
              <a href="dummy" onClick={e => handleCourseClick(e, course._id)}>
                  {course._id}
              </a> - {course.courseName} 
              <br/>
              (Coordinator:
                <a href="dummy" onClick={e => handleCoordinatorClick(e, course.coordinator._id)}>
                  {course.coordinator.firstName} {course.coordinator.lastName} 
                </a>)
             </b>
            </div>

            <p></p>
        
           <div className="row">
            <button className="btn btn-primary" onClick={refresh}>
                Refresh Random Course
            </button>
        </div>
        
      </div>
    );

}