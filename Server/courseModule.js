import mongoose from 'mongoose';
import {dbURL}  from "./credentials.js";
import {Course, Coordinator} from 
    './models/index.js';

export const connection = await mongoose.connect(dbURL);

// Do not populate
export const lookupByCourseId =  async (id) => {
	console.log("\nLookup by CourseId:", id);
	let cid = id?.trim();
	if (!cid)
		return [];

	let result = await Course.find({ _id: new RegExp(cid)});

	if (result)
		return result;
	else
		return [];
};

// Do not populate
export const lookupByCourseName = async (name) => {
  console.log("\nLookup by CourseName:", name);
  let cname = name?.trim();
  if (!cname)
  	return [];

	let result = await Course.find(
		{ courseName: new RegExp(cname, 'i')});

	if (result)
		return result;
	else
		return [];
};

// Do not populate
export const lookupByCoordinator =  async (id) => {
	console.log("\nLookup by Coordinator:", id);
	
	let result = await Coordinator.findById(id);

	return result;
};

export const getRandomCourse = async () => {
	console.log("\nA Random Course:");
	
	let result = await Course.aggregate([
    { $sample: { size: 1 } }
   ]);
	result = await Course.findById(result[0]._id);
	return result;
};

export const getCourseDescription = async (id) => {
	console.log("\nGet Course Description:", id);
	let response = await fetch("https://kalathur.com/php/getCourseData.php?id=cs" + id);
	let result = await response.json();
	return result;
}

