import { getResourcesByType } from "@/lib/get-resource";
import { getResourceBySlug } from "@/lib/get-slug";
import { useEffect } from "react";

const ENTITY_TYPES = ["product--default"];

export async function generateStaticParams() {
  const result = await getResourcesByType(ENTITY_TYPES);
  const paths = result.data.map((item: any) => {
    return {
      slug: item.attributes.path.alias.substring(1),
    };
  });
  return paths;
}

export default async function Product({ params }: any) {
  const { slug } = params;
  const result = await getResourceBySlug(slug);
  return <div>{result.label}</div>;
}
