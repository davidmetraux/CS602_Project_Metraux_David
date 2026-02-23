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

export const getCart =  async (customerId) => {
	console.log("cart of user with id "+ customerId)

	let result =  await Order.findOne({
			customer:customerId,
			inCart:true
		}).populate({
			path: "quantities",
			populate: {
				path: "product"
			}
		})
	console.log(result)

	return result
}


//maybe add to graphql, but might not like the lean bit. Kind of annoying. 
// Couldn't figure out how to display from pastOrders with toJSON(), which is how I'd usually do it.
export const getPastOrders =  async (customerId) => {
	console.log("cart of user with id "+ customerId)

	let result =  await Order.find({
			customer:customerId,
			inCart:false
		}).populate({
			path: 'quantities',
			populate: {
				path: "product"
			}
		}).lean(true)

	return result
}

//maybe add to graphql
export const getAllCustomers =  async () => {
	console.log("\nall customers");

	let result = await Customer.find({});

	return result
};

//mutations

export const moveToCart = async (productId, customerId, quantity) => {
	//PUT IN ERROR MESSAGING IF EITHER ID IS WORNG

	
		let customer = await Customer.findById(customerId).populate({
				path: 'orders',
				match: { inCart: true },
				populate: {
					path: 'quantities',
				}
			}
		)
	
		let cart = customer.orders[0]

		console.log("cart", cart)

	if (quantity > 0){

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
	}

	return cart
}


export const removeFromCart = async (customerId, productId) => {

	//PUT IN ERROR MESSAGING IF EITHER ID IS WORNG
	let customer = await Customer.findById(customerId).populate({
			path: 'orders',
			match: { inCart: true },
			populate: {
				path: 'quantities',
			}
		}
	)

	let cart = customer.orders[0]

	console.log("cart", cart)

	let quantity = cart.quantities.find((quantity)=>quantity.product==productId)

	console.log("quantity to remove", quantity)


	let index = cart.quantities.indexOf(quantity)
	cart.quantities.splice(index, 1)
	
	console.log("cart after splicing", cart)

	await cart.save()

	await Quantity.deleteOne({_id: quantity._id})

	return cart
}

export const submitOrder = async (customerId) => {
	//REMOVE FROM INVENTORY AND DON'T ALLOW IT IF IT CAN'T BE

//maybe remove customecart and just find the item
	let customer = await Customer.findById(customerId).populate("orders");
	let customerCart = await Customer.findById(customerId).populate({
			path: 'orders',
			match: { inCart: true },
			populate: {
				path: 'quantities',
				populate: {
					path:'product'
				}
			}
		}
	)
	customerCart = customerCart.orders[0]
	const quantities = customerCart.quantities

	let quantity;
	let product;
	for (let i=0; i<quantities.length; i++){
		quantity = quantities[i]
		console.log("the quantity", quantity)
		product = await quantity.product
		console.log("the product", product)
		if (product.quantity > quantity.quantity)
			product.quantity = product.quantity - quantity.quantity
		else {
			quantity.quantity = product.quantity
			product.quantity = 0
			console.log("product quanity should be 0", product)
		}
		quantity.save()
		product.save()
	}

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


