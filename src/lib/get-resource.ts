/**
 * The API URL
 *
 * @type {string}
 */
const API_URL = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}`;

/**
 * Get a single resource (entity) by slug
 *
 * @return Promise object represents a single resource
 */
export async function getResourcesByType(types: string[]): Promise<any> {
  // Build the JSON API URL based on the slug array
  const jsonApiUrl = `${API_URL}/jsonapi/products/default`;

  try {
    console.log(jsonApiUrl.toString());
    // Fetch the data from the API URL
    const response = await fetch(jsonApiUrl.toString());
    const resource = await response.json();

    // If the resource was resolved, return the data
    return resource;
  } catch (error) {
    throw new Error(`Error fetching resource type ${types}: ${error}`);
  }
}
