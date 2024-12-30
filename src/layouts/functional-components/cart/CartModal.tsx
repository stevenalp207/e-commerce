import { cart, refreshCartState, totalQuantity } from "@/cartStore";
import { DEFAULT_OPTION } from "@/lib/constants";
import { useStore } from "@nanostores/react";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import OpenCart from "./OpenCart";
import Price from "../Price";
import CloseCart from "./CloseCart";
import DeleteItemButton from "./DeleteItemButton";
import EditItemQuantityButton from "./EditItemQuantityButton";
import { createUrl } from "@/lib/utils";
import LoadingDots from "../loadings/LoadingDots";

const CartModal: React.FC = () => {
  const currentCart = useStore(cart);
  const quantity = useStore(totalQuantity);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Refresh the cart when the component mounts
  useEffect(() => {
    async function initializeCart() {
      try {
        await refreshCartState();
      } catch (error) {
        console.error("Failed to refresh cart:", error);
      } finally {
        setLoading(false);
      }
    }

    initializeCart(); // Initialize cart on mount
  }, []);

  // Handlers for opening and closing the cart
  const openCart = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling when the cart is open
  };

  const closeCart = () => {
    setIsOpen(false);
    document.body.style.overflow = ""; // Re-enable scrolling when the cart is closed
  };

  // Crear el mensaje para WhatsApp con más detalles (como una factura)
  const createWhatsAppMessage = () => {
    if (!currentCart) return "";
  
    const productList = currentCart.lines.map((item: any) => {
      const productTitle = item.merchandise.product.title;
      const productQuantity = item.quantity;
      const productPrice = item.cost.totalAmount.amount; // Precio total del artículo
      const currencyCode = item.cost.totalAmount.currencyCode;
  
      return `*${productTitle}* - *Cantidad:* ${productQuantity} - *Precio:* ${productPrice} ${currencyCode}`;
    }).join("\n");
  
    const taxAmount = currentCart.cost.totalTaxAmount.amount;
    const taxCurrency = currentCart.cost.totalTaxAmount.currencyCode;
    const shippingAmount = 0;
    const shippingCurrency = taxCurrency;
    const totalAmount = currentCart.cost.totalAmount.amount;
    const totalCurrency = currentCart.cost.totalAmount.currencyCode;
  
    // Mensaje personalizado con la negrita y resumen de la factura solo con el total
    return `¡Hola! Quiero comprar los siguientes productos:\n\n${productList}\n\n---\n\n*Resumen de la factura:*\n\n*Total:* ${totalAmount} ${totalCurrency}\n\n*¡Gracias por tu atención!*`;
  };
  

  if (loading) return <LoadingDots className="bg-black dark:bg-white" />;
  if (!currentCart) return <OpenCart quantity={quantity} />;

  // Número de WhatsApp (ajústalo con el número de la dueña)
  const whatsAppNumber = "+50670112732";
  const message = createWhatsAppMessage();

  return (
    <>
      <div className="cursor-pointer" aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={quantity} />
      </div>

      <div
        id="cartOverlay"
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? "block" : "hidden"
          }`}
        onClick={closeCart}
      ></div>

      <div
        id="cartDialog"
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[390px] transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="h-fit flex flex-col border-l border-b drop-shadow-lg rounded-bl-md border-neutral-200 bg-body p-6 text-black dark:border-neutral-700 dark:bg-darkmode-body dark:text-white">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Tu carrito</p>
            <button aria-label="Close cart" onClick={closeCart}>
              <CloseCart />
            </button>
          </div>

          <div className="w-full h-px absolute bg-dark dark:bg-darkmode-dark left-0 top-16"></div>

          {currentCart.lines.length === 0 ? (
            <div className="flex flex-col justify-center items-center space-y-6 my-auto">
              <div className="md:mt-16">
                <FaShoppingCart size={76} />
              </div>
              <p>Oops. Tu carrito esta vació</p>
              <a href="/products" className="btn btn-primary w-full">
                No lo olvides. Añade productos
              </a>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between overflow-hidden p-1">
              <ul className="flex-grow overflow-auto py-4">
                {currentCart.lines.map((item: any) => {
                  const merchandiseSearchParams: Record<string, string> = {};
                  item.merchandise.selectedOptions.forEach(
                    ({ name, value }: any) => {
                      if (value !== DEFAULT_OPTION) {
                        merchandiseSearchParams[name.toLowerCase()] = value;
                      }
                    },
                  );

                  const merchandiseUrl = createUrl(
                    `/products/${item.merchandise.product.handle}`,
                    new URLSearchParams(merchandiseSearchParams),
                  );

                  return (
                    <li
                      key={item.id}
                      className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                    >
                      <div className="relative flex w-full flex-row justify-between px-1 py-4">
                        <div className="absolute z-40 -mt-2 ml-[55px]">
                          <DeleteItemButton item={item} />
                        </div>
                        <a
                          href={merchandiseUrl.toString()}
                          className="z-30 flex flex-row space-x-4"
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300">
                            <img
                              className="h-full w-full object-cover"
                              src={item.merchandise.product.featuredImage?.url || "/images/product_image404.jpg"}
                              alt={item.merchandise.product.featuredImage?.altText || item.merchandise.product.title}
                              width={64}
                              height={64}
                            />
                          </div>
                          <div className="flex flex-1 flex-col text-base">
                            <span>{item.merchandise.product.title}</span>
                            {item.merchandise.title !== DEFAULT_OPTION && (
                              <p className="text-sm text-neutral-500">{item.merchandise.title}</p>
                            )}
                          </div>
                        </a>
                        <div className="flex h-16 flex-col justify-between">
                          <Price
                            amount={item.cost.totalAmount.amount}
                            currencyCode={item.cost.totalAmount.currencyCode}
                          />
                          <div className="flex items-center space-x-2">
                            <EditItemQuantityButton item={item} type="minus" />
                            <p>{item.quantity}</p>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                  <p>Impuestos</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={currentCart.cost.totalTaxAmount.amount}
                    currencyCode={currentCart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Envio</p>
                  <p className="text-right">Calculado al finalizar</p>
                </div>
                <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                  <p>Total</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={currentCart.cost.totalAmount.amount}
                    currencyCode={currentCart.cost.totalAmount.currencyCode}
                  />
                </div>
              </div>

              {/* Botón para redirigir a WhatsApp */}
              <a
                href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`}
                className="block w-full rounded-md bg-dark dark:bg-darkmode-dark p-3 text-center text-sm font-medium text-darkmode-light dark:text-dark opacity-90 hover:opacity-100"
              >
                Pagar tu carrito
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
