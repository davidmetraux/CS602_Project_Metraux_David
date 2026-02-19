import mongoose from 'mongoose';
import {dbURL}  from "./credentials.js";
import {Customer, Order, Quantity, Product} from 
    './models/index.js';

export const connection = await mongoose.connect(dbURL);


export const lookupByCustomerId =  async (id) => {
	console.log("\nLookup by CustomerId:", id);

	let result = await Customer.findById(id).populate("orders");
	console.log(result)

	return result;

};


export const lookupByOrderId = async (id) => {
  	console.log("\nLookup by OrderId:", id);


	let result = await Order.findById(id);


	return result;

};


export const lookupByQuantityId =  async (id) => {
	console.log("\nLookup by QuantityId:", id);
	
	let result = await Quantity.findById(id);
	console.log(result)

	return result;
};

export const lookupByProductId =  async (id) => {
	console.log("\nLookup by ProductId:", id);
	
	let result = await Product.findById(id);

	return result;
};

export const lookupByProductName =  async (name) => {
	console.log("\nLookup by ProductName:", name);

	name = name?.trim();
  	if (!name)
  		return [];
	
	let result = await Product.find({name: new RegExp(name, "i")});

	if (result)
		return result;
	else
		return [];
};

export const allProducts =  async () => {
	console.log("\nall products");

	let result = await Product.find({});

	return result
};

export const productsWithinRange =  async (startInclusive, endInclusive) => {
	console.log("products within $"+startInclusive+" and $"+endInclusive)

	let result =  await Product.find({price: {$gte: startInclusive ?? 0, $lte: endInclusive ?? Number.POSITIVE_INFINITY}})

	return result
}

//mutations

export const moveToCart = async (productId, customerId, quantity) => {
	let customer = await Customer.findById(customerId).populate({
			path: 'orders',
			match: { inCart: true },
			populate: {
				path: 'quantities',
			}
		}
	)
	// let product = await Customer.findById(productId)
	let cart = customer.orders[0]

	console.log("cart", cart)

	let existingQuantity = cart.quantities.find((quantity)=>quantity.product==productId)
	if (existingQuantity){


		existingQuantity.quantity+=quantity
		await existingQuantity.save()
	} else{
		let newQuantityId= new mongoose.Types.ObjectId().toString()

		await Quantity.create({
			_id: newQuantityId,
			product: productId,
			quantity: quantity,
			orders:[cart._id],
		})

		cart.quantities.push(newQuantityId)
		await cart.save()

	}
	

	return cart
}


export const removeFromCart = async (customerId, productId) => {
}

export const submitOrder = async (customerId) => {
//maybe remove customecart and just find the item
	let customer = await Customer.findById(customerId).populate("orders");
	let customerCart = await Customer.findById(customerId).populate({
			path: 'orders',
			match: { inCart: true },
		}
	)
	customerCart = customerCart.orders[0]

	customerCart.inCart=false
	await customerCart.save()

	let newOrderId= new mongoose.Types.ObjectId().toString()

	let newCart = await Order.create({
		_id: newOrderId,
		customer: customerId,
		quantities: [],
		inCart: true
	})

	customer.orders.push(newOrderId)
	await customer.save()

	return newCart


}


