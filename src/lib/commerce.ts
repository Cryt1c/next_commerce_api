import { OrderItem } from "@/types/Types";

const url = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

// Prepares the headers with authentication tokens for the commerce_api calls.
export async function getCommerceApiHeaders(): Promise<Headers> {
  const headers = new Headers();
  headers.append("Commerce-Cart-Token", getCartToken());
  headers.append("Content-Type", "application/vnd.api+json");
  return headers;
}

// Load or create new token from local storage.
export function getCartToken(): string {
  const clientSideToken =
    localStorage.getItem("cartToken") !== null
      ? JSON.parse(localStorage.getItem("cartToken") || "")
      : Math.random().toString(36).substring(2);
  localStorage.setItem("cartToken", JSON.stringify(clientSideToken));
  return clientSideToken;
}

// Returns the cart associated with the cart token.
export async function getCart(): Promise<any> {
  const headers = await getCommerceApiHeaders();

  const response = await fetch(`${url}/jsonapi/carts?include=order_items`, {
    method: "GET",
    headers: headers,
  });
  if (!response.ok) {
    throw new Error("getCart response status: " + response.status);
  } else {
    const data = await response.json();
    return data;
  }
}

// Adds multiple product to cart based on its id and type.
export async function addCartItems(items: Array<OrderItem>): Promise<any> {
  const headers = await getCommerceApiHeaders();

  const requestData = {
    data: items
      .filter((item) => item?.meta?.quantity)
      .map((item) => {
        return {
          type: item.variationType,
          id: item.variationUuid,
          meta: {
            ...(item?.meta?.quantity && { quantity: item?.meta?.quantity }),
            ...(item?.meta?.fields && { fields: item?.meta?.fields }),
            // Combine defines if orderitems should be merged in the order.
            ...(item?.meta?.combine == false && {
              combine: false,
            }),
          },
        };
      }),
  };
  const response = await fetch(`${url}/jsonapi/cart/add`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    throw new Error("addCartItems response status: " + response.status);
  } else {
    return await response.json();
  }
}

// Updates a product in a cart based on its id and type.
export async function updateCartItem(
  type: string,
  id: string,
  quantity: number,
  cartId: string
): Promise<any> {
  const header = await getCommerceApiHeaders();
  var requestData = {
    data: {
      type: type,
      id: id,
      attributes: {
        quantity: quantity,
      },
    },
  };
  const response = await fetch(`${url}/jsonapi/carts/${cartId}/items/${id}`, {
    method: "PATCH",
    headers: header,
    body: JSON.stringify(requestData),
  });
  if (!response.ok) {
    throw new Error("changeCartItem response status: " + response.status);
  } else {
    return await response.json();
  }
}

// Removes an order item from the cart based on its id and type.
export async function removeCartItem(
  type: string,
  id: string,
  cartId: string
): Promise<boolean> {
  const header = await getCommerceApiHeaders();
  var requestData = {
    data: [
      {
        id: id,
        type: type,
      },
    ],
  };
  const response = await fetch(`${url}/jsonapi/carts/${cartId}/items`, {
    method: "DELETE",
    headers: header,
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error("deleteCartItem response status: " + response.status);
  } else {
    // The drupal endpoint only returns an ok response but no json therefore we return true.
    return true;
  }
}
