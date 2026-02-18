import type { Route } from "./+types/home";
import { FoodList } from "../food/food";
import "../app.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "food", content: "Welcome to React Router!" },
  ];
}

const food = [
    {name:"Banana", description: "A yellow curved fruit", price: 1.00, quantity: 5}
]

export default function Food() {
  return <FoodList listOfFood={food}/>;
}
