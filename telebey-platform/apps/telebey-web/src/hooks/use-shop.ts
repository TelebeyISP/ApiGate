
import { useContext } from "react"
import { ShopContext } from "@/context/ShopContext"

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within a ShopProvider');
  return ctx;
}
