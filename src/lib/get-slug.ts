const API_URL = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/router/translate-path?path=`;

// Get a single resource (entity) by slug
export async function resolveSlugToEntity(slug: string): Promise<any> {
  // Build the JSON API URL based on the slug array
  const jsonApiUrl = `${API_URL}/${slug}?format=json_api`;

  try {
    // Fetch the data from the API URL
    const response = await fetch(jsonApiUrl.toString());
    const resource = await response.json();

    // Check if the resource was resolved or not
    if (!resource.resolved) {
      throw new Error("Resource not found");
    }

    // If the resource was resolved, return the data
    return resource;
  } catch (error) {
    throw new Error(`Error fetching resource with slug ${slug}: ${error}`);
  }
}
