// const url = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;
//
// export type Address = {
//   address: {
//     langcode: string;
//     country_code: string;
//     locality: string;
//     postal_code: string;
//     address_line1: string;
//     given_name: string;
//     family_name: string;
//   };
//   field_email: string;
//   field_date_of_birth: string;
//   field_phone_number: string;
//   field_salutation: string;
//   field_title: string;
//   email: string;
// };
//
// export function getCartToken(): string {
//   const clientSideToken =
//     localStorage.getItem('cartToken') !== null
//       ? JSON.parse(localStorage.getItem('cartToken'))
//       : Math.random().toString(36).substring(2);
//   localStorage.setItem('cartToken', JSON.stringify(clientSideToken));
//   return clientSideToken;
// }
//
// // Prepares the headers with authentication tokens for the commerce_api calls.
// export async function getCommerceApiHeaders(): Promise<Headers> {
//   const headers = new Headers();
//   // // TODO: Handle expired refreshToken
//   // const session = await getSession();
//   // const accessToken = session?.accessToken;
//   // if (session?.error === 'RefreshAccessTokenError') {
//   //   await signOut({
//   //     callbackUrl: `/user/login?callbackUrl=${window.location.pathname}&error=SessionExpired`,
//   //   });
//   // }
//   // Prioritize user-authorization-token over commerce-cart-token.
//   // if (accessToken) {
//   //   headers.append('Authorization', `Bearer ${accessToken}`);
//   // } else {
//     headers.append('Commerce-Cart-Token', getCartToken());
//   // }
//   headers.append('Content-Type', 'application/vnd.api+json');
//   return headers;
// }
//
// // Returns the cart associated with the cart token.
// export async function getCart() {
//   const headers = await getCommerceApiHeaders();
//   console.log(url);
//
//   // TODO add the language prefix dynamically
//   const response = await fetch(`${url}/jsonapi/carts?include=order_items`, {
//     method: 'GET',
//     headers: headers,
//   });
//   if (!response.ok) {
//     console.log('Get cart response status: ' + response.status);
//     console.log('Get cart response: ', await response.json());
//     return false;
//   } else {
//     const data = await response.json();
//     return data;
//   }
// }
//
// // Adds multiple product to cart based on its id and type.
// export async function addCartItems(items: Array<any>) {
//   const headers = await getCommerceApiHeaders();
//
//   const requestData = {
//     data: items
//       .filter((item) => item.quantity)
//       .map((item) => {
//         return {
//           type: item.type,
//           id: item.id,
//           meta: {
//             quantity: item.quantity,
//             ...(item?.meta?.fields && { fields: item?.meta?.fields }),
//             // Combine defines if orderitems should be merged in the order.
//             ...(item?.meta?.combine == false && {
//               combine: false,
//             }),
//           },
//         };
//       }),
//   };
//   const response = await fetch(`${url}/jsonapi/cart/add`, {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify(requestData),
//   });
//   if (!response.ok) {
//     console.log('Add cart items response status: ' + response.status);
//     console.log('Add cart items response: ', await response.json());
//     return false;
//   } else {
//     setCartFlag();
//     return await response.json();
//   }
// }
//
// // Changes a product in a cart based on its id and type.
// export async function changeCartItem(type, id, quantity, cartId) {
//   const header = await getCommerceApiHeaders();
//   var requestData = {
//     data: {
//       type: type,
//       id: id,
//       attributes: {
//         quantity: quantity,
//       },
//     },
//   };
//   const response = await fetch(`${url}/jsonapi/carts/${cartId}/items/${id}`, {
//     method: 'PATCH',
//     headers: header,
//     body: JSON.stringify(requestData),
//   });
//   if (!response.ok) {
//     console.log('Change cart item response status: ' + response.status);
//     console.log('Change cart item response: ', await response.json());
//     return false;
//   } else {
//     return await response.json();
//   }
// }
//
// // Delete a product in the cart based on its id and type.
// export async function deleteCartItem(type, id, cartId) {
//   const header = await getCommerceApiHeaders();
//   var requestData = {
//     data: [
//       {
//         type: type,
//         id: id,
//       },
//     ],
//   };
//   const response = await fetch(`${url}/jsonapi/carts/${cartId}/items`, {
//     method: 'DELETE',
//     headers: header,
//     body: JSON.stringify(requestData),
//   });
//
//   if (!response.ok) {
//     console.log('Delete cart item response status: ' + response.status);
//     console.log('Delete cart item response: ', await response.json());
//     return false;
//   } else {
//     // The drupal endpoint only returns an ok response but no json therefore we return true.
//     return true;
//   }
// }
//
// // Apply one of the two shipping methods for vouchers
// export async function changeShippingMethod(
//   orderId,
//   orderType,
//   shippingMethodId: ShippingMethods
// ) {
//   const header = await getCommerceApiHeaders();
//   var requestData = {
//     data: {
//       type: orderType,
//       id: orderId,
//       attributes: {
//         shipping_method: shippingMethodId,
//       },
//     },
//   };
//   const response = await fetch(`${url}/jsonapi/checkout/${orderId}`, {
//     method: 'PATCH',
//     headers: header,
//     body: JSON.stringify(requestData),
//   });
//   if (!response.ok) {
//     return false;
//   } else {
//     console.log('Change shipping method response status: ' + response.status);
//     console.log('Change shipping method response: ', await response.json());
//     return false;
//   }
// }
//
// export function createCartObject(response) {
//   const cart = { order: response.data[0], orderItems: response.included };
//   return cart;
// }
//
// // Adjust the shipping or invoice address on an order.
// export async function changeAddresses(
//   orderId,
//   billingAddress: Address,
//   shippingAddress: Address
// ) {
//   const header = await getCommerceApiHeaders();
//
//   // Set defaults.
//   if (billingAddress?.address) {
//     billingAddress.address.langcode = 'de';
//   }
//   if (shippingAddress?.address) {
//     shippingAddress.address.langcode = 'de';
//     shippingAddress.address.country_code = 'CH';
//   }
//
//   var requestData = {
//     data: {
//       type: 'order--default',
//       id: orderId,
//       attributes: {
//         ...(billingAddress && {
//           billing_information: {
//             metatag: [],
//             ...billingAddress,
//             field_address_type: 'HOME',
//             tax_number: {
//               type: null,
//               value: null,
//             },
//           },
//         }),
//         ...(shippingAddress && {
//           shipping_information: {
//             metatag: [],
//             ...shippingAddress,
//             field_address_type: 'HOME',
//             tax_number: {
//               type: null,
//               value: null,
//             },
//           },
//         }),
//       },
//     },
//   };
//   const response = await fetch(`${url}/jsonapi/checkout/${orderId}`, {
//     method: 'PATCH',
//     headers: header,
//     body: JSON.stringify(requestData),
//   });
//   if (!response.ok) {
//     console.log('Change addresses response status: ' + response.status);
//     console.log('Change addresses response: ', await response.json());
//     return false;
//   } else {
//     return await response.json();
//   }
// }
//
// // Set the default shipping method
// export async function setDefaultShippingMethod(
//   cartObject,
//   refreshCart: Function
// ) {
//   // Always set the shipping method to Postversand if the cart contains retail products.
//   if (hasProductType('retail-products', cartObject)) {
//     if (
//       cartObject?.order?.attributes?.shipping_method !==
//       ShippingMethods['Postversand']
//     ) {
//       await changeShippingMethod(
//         cartObject?.order?.id,
//         cartObject?.order?.type,
//         ShippingMethods['Postversand']
//       );
//       refreshCart();
//     }
//     return;
//   }
//
//   // Only set the shipping method to Print@Home if the cart contains vouchers and no shipping method is set yet.
//   if (hasProductType('voucher', cartObject)) {
//     if (!cartObject?.order?.attributes?.shipping_method) {
//       await changeShippingMethod(
//         cartObject?.order?.id,
//         cartObject?.order?.type,
//         ShippingMethods['Print@Home']
//       );
//       refreshCart();
//     }
//     return;
//   }
// }
//
// // Check if the cart contains a product of a specific type
// function hasProductType(productType: string, cartObject) {
//   return cartObject?.orderItems
//     ?.filter((item) => item.type === 'order-item--default')
//     .some(
//       (item) =>
//         item?.relationships?.purchased_entity?.data?.type ===
//         `product-variation--${productType}`
//     );
// }
