import { DrupalJsonApiParams } from "drupal-jsonapi-params";

const RESOURCE_TYPE = "product--default";
const RESOURCE_VARIATION_TYPE = "product-variation--default";
const RESOURCE_ENDPOINT = "/jsonapi/products/default";
const BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;

// Get all published products and their path.
export async function getProducts(offset: number = 0, limit: number = 20) {
  const params = new DrupalJsonApiParams();

  params
    .addPageLimit(limit)
    .addPageOffset(offset)
    .addFilter("status", "1")
    .addFields(RESOURCE_TYPE, ["title", "path"]);

  const queryString = params.getQueryString();

  const url = `${BASE_URL}${RESOURCE_ENDPOINT}?${queryString}&jsonapi_include=1`;
  try {
    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error("Response Error: " + JSON.stringify(data.errors));
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get a single product by its uuid.
export async function getProduct(uuid: string | null) {
  const params = new DrupalJsonApiParams();

  params
    .addFilter("id", uuid)
    .addFilter("status", "1")
    .addFields(RESOURCE_TYPE, ["title", "path", "field_price"])
    .addFields(RESOURCE_VARIATION_TYPE, ["price"])
    .addInclude(["variations"]);

  const queryString = params.getQueryString();
  const url = `${BASE_URL}${RESOURCE_ENDPOINT}?${queryString}&jsonapi_include=1`;

  try {
    const res = await fetch(url, {
      method: "GET",
      next: { revalidate: 1 },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error("Response Error: " + JSON.stringify(data.errors));
    }

    const data = await res.json();

    if (!data.data?.length) {
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
