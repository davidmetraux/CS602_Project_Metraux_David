interface Product {
  name: String,
  description: String,
  price: number,
  quantity: number
}

export function FoodList({listOfFood}:{listOfFood:Product[]}){


    return (
        <main>
            <h1>Grocery</h1>
            <ul>
                {listOfFood.map((product)=>
                    <li>
                        {product.name} - {product.description}. <br/> Price: ${product.price} <br/> In Stock: {product.quantity} <br/> <input style={{all:"revert"}}></input> <button style={{all:"revert"}} type="button">Add to Cart</button>
                    </li>
                )}
            </ul>
        </main>

    )
}