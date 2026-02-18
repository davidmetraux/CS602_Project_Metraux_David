import { useEffect, useState } from "react"

interface Order {
  quantities: Quantity[],
}

interface Quantity {
    product: Product
    quantity: number
}

interface Product {
  name: String,
  description: String,
  price: number,
  quantity: number
}

export function FoodList(listOfFood:Order){

    const [total, setTotal] = useState(0)

    useEffect(()=>{
        const initialValue = 0;
        const sumWithInitial = listOfFood.quantities.reduce(
            (accumulator, currentQuantity) => accumulator + (currentQuantity.product.price * currentQuantity.quantity),
            initialValue,
        );
        setTotal(sumWithInitial)
    },[listOfFood])


    return (
        <main>
            <h1>Grocery</h1>
            <ul>
                {listOfFood.quantities.map((quantity:Quantity)=>
                    <li>
                        {quantity.product.name} - {quantity.product.description}. 
                        <br/> Price: ${quantity.product.quantity} x In Stock: {quantity.product.price} = {quantity.product.quantity*quantity.product.price}
                        <br/> <button style={{all:"revert"}} type="button">Remove From Cart</button>
                    </li>
                )}
            </ul>
            <div>
                Total Price:
                {total}
            </div>
        </main>

    )
}