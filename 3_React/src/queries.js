export const QUERY_GET_BY_COURSE_ID= 
`query Course($courseIdLookupId: String!) {
  courseIdLookup(id: $courseIdLookupId) {
    _id
    courseName
    coordinator {
      _id
      firstName
      lastName
      courses {
        _id
        courseName
      }
    }
  }
}
`;

export const QUERY_GET_BY_COURSE_NAME = 
`query Course($name: String!) {
  courseNameLookup(name: $name) {
    _id
    courseName
    coordinator {
      _id
      firstName
      lastName
      courses {
        _id
        courseName
      }
    }
  }
}
`;

export const QUERY_GET_BY_COORDINATOR = 
`query CoordinatorQuery($coordinatorId: String!) {
  coordinator(id: $coordinatorId) {
    _id
    firstName
    lastName
    courses {
      _id
      courseName
    }
  }
}
`;

export const QUERY_GET_RANDOM_COURSE = 
`query ExampleQuery {
  randomCourse {
    _id
    courseName
    coordinator {
      _id
      firstName
      lastName
    }
  }
}
`;

export const QUERY_GET_COURSE_DESCRIPTION = 
`
query ExampleQuery($courseDescriptionId: String!) {
  courseDescription(id: $courseDescriptionId) {
    course
    title
    credits
    content
  }
}
`;

