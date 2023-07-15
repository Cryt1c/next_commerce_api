import { Button } from "@/components/Button";
import { getProduct, getProducts } from "@/lib/get-products";
import { resolveSlugToEntity } from "@/lib/get-slug";
import { OrderItem } from "@/types/Types";

export async function generateStaticParams() {
  const result = await getProducts();
  const paths = result.data.map((item: any) => {
    return {
      slug: item.attributes.path.alias.substring(1),
    };
  });
  return paths;
}

export default async function Product({ params }: any) {
  const { slug } = params;
  const {
    entity: { uuid },
  } = await resolveSlugToEntity(slug);
  const result = await getProduct(uuid);
  const product = result.data[0];
  const variation = result.included[0];
  const orderItem: OrderItem = {
    uuid: product.id,
    variationUuid: variation.id,
    title: product.attributes.title,
    price: parseInt(variation.attributes.price.number),
    meta: { quantity: 1 },
    type: product.type,
    variationType: variation.type,
  };

  return (
    <div>
      <div>{orderItem.title}</div>
      <div>${orderItem.price}</div>
      <Button orderItem={orderItem}>Add product</Button>
    </div>
  );
}
