import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { formatCurrency } from "@/lib/utils";
import { IOrder } from "@/lib/db/models/order.model";
import { SERVER_URL } from "@/lib/constants";
type OrderInformationProps = {
  order: IOrder;
};
AskReviewOrderItemsEmail.PreviewProps = {
  order: {
    _id: "123",
    isPaid: true,
    paidAt: new Date(),
    totalPrice: 100,
    itemsPrice: 100,
    taxPrice: 0,
    shippingPrice: 0,
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "New York",
      postalCode: "12345",
      country: "USA",
      phone: "123-456-7890",
      province: "New York",
    },
    items: [
      {
        clientId: "123",
        name: "Product 1",
        image: "https://via.placeholder.com/150",
        price: 100,
        quantity: 1,
        product: "123",
        slug: "product-1",
        category: "Category 1",
        countInStock: 10,
      },
    ],
    paymentMethod: "PayPal",
    expectedDeliveryDate: new Date(),
    isDelivered: true,
  } as IOrder,
} satisfies OrderInformationProps;
const dateFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" });
export default async function AskReviewOrderItemsEmail({
  order,
}: OrderInformationProps) {
  return (
    <Html>
      <Preview>Xem lại đơn hàng</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Xem lại đơn hàng</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Mã đơn hàng
                  </Text>
                  <Text className="mt-0 mr-4">{order._id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Đặt hàng lúc
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Tiền thanh toán
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.items.map((item) => (
                <Row key={item.product} className="mt-8">
                  <Column className="w-20">
                    <Link href={`${SERVER_URL}/product/${item.slug}`}>
                      <Img
                        width="80"
                        alt={item.name}
                        className="rounded"
                        src={
                          item.image.startsWith("/")
                            ? `${SERVER_URL}${item.image}`
                            : item.image
                        }
                      />
                    </Link>
                  </Column>
                  <Column className="align-top">
                    <Link href={`${SERVER_URL}/product/${item.slug}`}>
                      <Text className="mx-2 my-0">{item.name}</Text>
                    </Link>
                  </Column>
                  <Column align="right" className="align-top ">
                    <Button
                      href={`${SERVER_URL}/product/${item.slug}#reviews`}
                      className="text-center bg-blue-500 hover:bg-blue-700 text-white   py-2 px-4 rounded"
                    >
                      Xem lại sản phẩm
                    </Button>
                  </Column>
                </Row>
              ))}
              {[
                { name: "Sản phẩm", price: order.itemsPrice },
                { name: "VAT", price: order.taxPrice },
                { name: "Phí vận chuyển", price: order.shippingPrice },
                { name: "Tổng", price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}:</Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
