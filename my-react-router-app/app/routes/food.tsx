import type { Route } from "./+types/home";
import { FoodList } from "../food/food";
import "../app.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "food", content: "Welcome to React Router!" },
  ];
}

export default function Food() {
  return <FoodList />;
}
