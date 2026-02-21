import { ApolloClient, InMemoryCache, gql } 
   from '@apollo/client';
   
const baseServerURL = "http://localhost:4000";

export const client = new ApolloClient({
  uri: `${baseServerURL}`,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    }
  }
});


export const getRandomCourse = async () => {
	console.log("\nA Random Course:");
	
	const QUERY_GET_RANDOM_COURSE = 
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

	const result = await client.query({
	  query: gql(QUERY_GET_RANDOM_COURSE)
	});

	return result.data;
};

export const getCourseDescription = async (id) => {
	console.log("\nGet Course Description:", id);

	if (id.startsWith("CS "))
      id = id.substring(3);

	const QUERY_GET_COURSE_DESCRIPTION = 
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

	const result = await client.query({
	  query: gql(QUERY_GET_COURSE_DESCRIPTION),
	  variables: {courseDescriptionId: id}
	});

	return result.data;
}


export const lookupByCourseId_V1 =  async (id) => {
	console.log("\nLookup by CourseId (V1):", id);

	const QUERY_GET_BY_COURSE_ID_V1 = 
		`query Course($courseIdLookupId: String!) {
		  courseIdLookup(id: $courseIdLookupId) {
		    _id
		    courseName
		  }
		}
		`;

	const result = await client.query({
	  query: gql(QUERY_GET_BY_COURSE_ID_V1),
	  variables: {courseIdLookupId: id}
	});

	return result.data;
};

export const lookupByCourseId_V2 =  async (id) => {
	console.log("\nLookup by CourseId (V2):", id);

	// fill in the code
	const QUERY_GET_BY_COURSE_ID_V2 = 
		`query Course($courseIdLookupId: String!) {
			courseIdLookup(id: $courseIdLookupId) {
				_id
				courseName
				coordinator {
				  _id
				  firstName
				  lastName
				  courses{
					_id
					courseName
				  }
				}
			}
		}
		`;
	
	try {
		const result = await client.query({
			query: gql(QUERY_GET_BY_COURSE_ID_V2),
			variables: {courseIdLookupId: id}		
		});
		return result.data;
	} catch (e) {
		console.error(e)
		return []
	}	
}

export const lookupByCourseName = async (name) => {
  console.log("\nLookup by CourseName:", name);
  
	// fill in the code
	const QUERY_GET_BY_COURSE_NAME = 
		`query Course($courseName: String!) {
			courseNameLookup(name: $courseName) {
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
	

	try {
		const result = await client.query({
			query: gql(QUERY_GET_BY_COURSE_NAME),
			variables: {courseName: name}
		});

		return result.data;
	} catch (e) {
		console.error(e)
		return []
	}

};

export const lookupByCoordinator =  async (id) => {
	console.log("\nLookup by Coordinator:", id);
	
		// fill in the code
	const QUERY_GET_BY_COORDINATOR = 
		`query Coordinator($coordinatorID: String!) {
			coordinator(id: $coordinatorID) {
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
	
	const result = await client.query({
		query: gql(QUERY_GET_BY_COORDINATOR),
		variables: {coordinatorID: id}
	});

	return result.data;
	
};




