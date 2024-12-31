"use client";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCartStore from "@/hooks/use-cart-store";
import useIsMounted from "@/hooks/use-is-mounted";
import { toast } from "@/hooks/use-toast";
import { createOrder } from "@/lib/actions/order.actions";
import {
  APP_NAME,
  AVAILABLE_DELIVERY_DATES,
  AVAILABLE_PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
} from "@/lib/constants";
import {
  calculateFutureDate,
  formatCurrency,
  formatDateTime,
  timeUntilMidnight,
} from "@/lib/utils";
import { ShippingAddressSchema } from "@/lib/validator";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CheckoutFooter from "./checkout-footer";

const shippingAddressDefaultValues =
  process.env.NODE_ENV === "development"
    ? {
        fullName: "Nguyễn Văn A",
        street: "123 Nguyễn Chí Thanh",
        city: "Hồ Chí Minh",
        province: "Hồ Chí Minh",
        phone: "0992342528",
        postalCode: "70000",
        country: "Việt Nam",
      }
    : {
        fullName: "",
        street: "",
        city: "",
        province: "",
        phone: "",
        postalCode: "",
        country: "",
      };
const CheckoutForm = () => {
  const router = useRouter();
  const {
    cart: {
      items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      shippingAddress,
      deliveryDateIndex,
      paymentMethod = DEFAULT_PAYMENT_METHOD,
    },
    setShippingAddress,
    setPaymentMethod,
    setDeliveryDateIndex,
    clearCart,
  } = useCartStore();
  const isMounted = useIsMounted();
  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
  });
  const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = (values) => {
    setShippingAddress(values);
    setIsAddressSelected(true);
  };
  useEffect(() => {
    if (!isMounted || !shippingAddress) return;
    shippingAddressForm.setValue("fullName", shippingAddress.fullName);
    shippingAddressForm.setValue("street", shippingAddress.street);
    shippingAddressForm.setValue("city", shippingAddress.city);
    shippingAddressForm.setValue("country", shippingAddress.country);
    shippingAddressForm.setValue("postalCode", shippingAddress.postalCode);
    shippingAddressForm.setValue("province", shippingAddress.province);
    shippingAddressForm.setValue("phone", shippingAddress.phone);
  }, [items, isMounted, router, shippingAddress, shippingAddressForm]);

  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] =
    useState<boolean>(false);
  const [isDeliveryDateSelected, setIsDeliveryDateSelected] =
    useState<boolean>(false);
  const handlePlaceOrder = async () => {
    const res = await createOrder({
      items,
      shippingAddress,
      expectedDeliveryDate: calculateFutureDate(
        AVAILABLE_DELIVERY_DATES[deliveryDateIndex!].daysToDeliver
      ),
      deliveryDateIndex,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    if (!res.success) {
      toast({
        description: res.message,
        variant: "destructive",
      });
    } else {
      toast({
        description: res.message,
        variant: "default",
      });
      clearCart();
      router.push(`/checkout/${res.data?.orderId}`);
    }
  };
  const handleSelectPaymentMethod = () => {
    setIsAddressSelected(true);
    setIsPaymentMethodSelected(true);
  };
  const handleSelectShippingAddress = () => {
    shippingAddressForm.handleSubmit(onSubmitShippingAddress)();
  };

  if (!items) return redirect("/");

  const CheckoutSummary = () => (
    <Card>
      <CardContent className="p-4">
        {!isAddressSelected && (
          <div className="border-b mb-4">
            <Button
              className="rounded-full w-full"
              onClick={handleSelectShippingAddress}
            >
              Gửi đến địa chỉ này
            </Button>
            <p className="text-xs text-center py-2">
              Chọn địa chỉ giao hàng và phương thức thanh toán để tính toán phí
              vận chuyển
            </p>
          </div>
        )}
        {isAddressSelected && !isPaymentMethodSelected && (
          <div className=" mb-4">
            <Button
              className="rounded-full w-full"
              onClick={handleSelectPaymentMethod}
            >
              Sử dụng phương thức thanh toán này
            </Button>
            <p className="text-xs text-center py-2">
              Chọn phương thức thanh toán để tiếp tục thanh toán. Bạn vẫn có cơ
              hội xem lại và chỉnh sửa đơn hàng trước khi hoàn tất
            </p>
          </div>
        )}

        <div>
          <div className="text-lg font-bold">Đơn hàng</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sản phẩm:</span>
              <span>
                <ProductPrice price={itemsPrice} plain /> VNĐ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Vận chuyển & Xử lý:</span>
              <span>
                {shippingPrice === undefined ? (
                  "-"
                ) : shippingPrice === 0 ? (
                  "Miễn phí"
                ) : (
                  <>
                    <ProductPrice price={shippingPrice} plain /> VNĐ
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span> VAT:</span>
              <span>
                {taxPrice === undefined ? (
                  "-"
                ) : (
                  <>
                    <ProductPrice price={taxPrice} plain /> VNĐ
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between pt-4 font-bold text-lg">
              <span> Tổng đơn hàng:</span>
              <span>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
          </div>
        </div>
        {isPaymentMethodSelected && isAddressSelected && (
          <div className="mt-4">
            <Button onClick={handlePlaceOrder} className="rounded-full w-full">
              Đặt hàng
            </Button>
            <p className="text-xs text-center py-2">
              Bằng cách đặt hàng, bạn đồng ý với {APP_NAME}&apos;s{" "}
              <Link href="/page/privacy-policy">chính sách bảo mật</Link> và
              <Link href="/page/conditions-of-use"> điều khoản sử dụng</Link>.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
  return (
    <main className="max-w-6xl mx-auto highlight-link">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {/* shipping address */}
          <div>
            {isAddressSelected && shippingAddress ? (
              <div className="grid grid-cols-1 md:grid-cols-12    my-3  pb-3">
                <div className="col-span-5 flex text-lg font-bold ">
                  <span className="w-8">1 </span>
                  <span>Địa chỉ giao hàng</span>
                </div>
                <div className="col-span-5 ">
                  <p>
                    {shippingAddress.fullName} <br />
                    {shippingAddress.street} <br />
                    {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                  </p>
                </div>
                <div className="col-span-2">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setIsAddressSelected(false);
                      setIsPaymentMethodSelected(true);
                      setIsDeliveryDateSelected(true);
                    }}
                  >
                    Thay đổi
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex text-primary text-lg font-bold my-2">
                  <span className="w-8">1 </span>
                  <span>Nhập địa chỉ giao hàng</span>
                </div>
                <Form {...shippingAddressForm}>
                  <form
                    method="post"
                    onSubmit={shippingAddressForm.handleSubmit(
                      onSubmitShippingAddress
                    )}
                    className="space-y-4"
                  >
                    <Card className="md:ml-8 my-4">
                      <CardContent className="p-4 space-y-2">
                        <div className="text-lg font-bold mb-2">
                          Địa chỉ của bạn
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                          <FormField
                            control={shippingAddressForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Họ và tên</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập họ và tên"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={shippingAddressForm.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Tên đường</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập tên đường"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                          <FormField
                            control={shippingAddressForm.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Tỉnh/Thành</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập tỉnh/thành"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Quận/huyện</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập thành phố"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={shippingAddressForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Quốc gia</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập quốc gia"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-5 md:flex-row">
                          <FormField
                            control={shippingAddressForm.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập postal code"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập số điện thoại"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="  p-4">
                        <Button
                          type="submit"
                          className="rounded-full font-bold"
                        >
                          Gửi đến địa chỉ này
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </>
            )}
          </div>
          {/* payment method */}
          <div className="border-y">
            {isPaymentMethodSelected && paymentMethod ? (
              <div className="grid  grid-cols-1 md:grid-cols-12  my-3 pb-3">
                <div className="flex text-lg font-bold  col-span-5">
                  <span className="w-8">2 </span>
                  <span>Phương thức thanh toán</span>
                </div>
                <div className="col-span-5 ">
                  <p>
                    {paymentMethod === "Cash On Delivery"
                      ? "Thanh toán khi giao hàng"
                      : paymentMethod}
                  </p>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsPaymentMethodSelected(false);
                      if (paymentMethod) setIsDeliveryDateSelected(true);
                    }}
                  >
                    Thay đổi
                  </Button>
                </div>
              </div>
            ) : isAddressSelected ? (
              <>
                <div className="flex text-primary text-lg font-bold my-2">
                  <span className="w-8">2 </span>
                  <span>Chọn phương thức thanh toán</span>
                </div>
                <Card className="md:ml-8 my-4">
                  <CardContent className="p-4">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value)}
                    >
                      {AVAILABLE_PAYMENT_METHODS.map((pm) => (
                        <div key={pm.name} className="flex items-center py-1 ">
                          <RadioGroupItem
                            value={pm.name}
                            id={`payment-${pm.name}`}
                          />
                          <Label
                            className="font-bold pl-2 cursor-pointer"
                            htmlFor={`payment-${pm.name}`}
                          >
                            {pm.name === "Cash On Delivery"
                              ? "Thanh toán khi giao hàng"
                              : pm.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button
                      onClick={handleSelectPaymentMethod}
                      className="rounded-full font-bold"
                    >
                      Sử dụng phương thức thanh toán này
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
                <span className="w-8">2 </span>
                <span>Chọn phương thức thanh toán</span>
              </div>
            )}
          </div>
          {/* items and delivery date */}
          <div>
            {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
              <div className="grid  grid-cols-1 md:grid-cols-12  my-3 pb-3">
                <div className="flex text-lg font-bold  col-span-5">
                  <span className="w-8">3 </span>
                  <span>Sản phẩm và vận chuyển</span>
                </div>
                <div className="col-span-5">
                  <p>
                    Giao ngày:{" "}
                    {
                      formatDateTime(
                        calculateFutureDate(
                          AVAILABLE_DELIVERY_DATES[deliveryDateIndex]
                            .daysToDeliver
                        )
                      ).dateOnly
                    }
                  </p>
                  <ul>
                    {items.map((item, _index) => (
                      <li key={_index}>
                        {item.name} x {item.quantity} ={" "}
                        {formatCurrency(item.price)} VNĐ
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-2">
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setIsPaymentMethodSelected(true);
                      setIsDeliveryDateSelected(false);
                    }}
                  >
                    Thay đổi
                  </Button>
                </div>
                {isPaymentMethodSelected && isAddressSelected && (
                  <div className="mt-12 lg:hidden md:hidden">
                    <Button
                      onClick={handlePlaceOrder}
                      className="rounded-full w-full"
                    >
                      Đặt hàng
                    </Button>
                    <p className="text-xs text-center py-2">
                      Bằng cách đặt hàng, bạn đồng ý với {APP_NAME}&apos;s{" "}
                      <Link href="/page/privacy-policy">
                        chính sách bảo mật
                      </Link>{" "}
                      và
                      <Link href="/page/conditions-of-use">
                        {" "}
                        điều khoản sử dụng
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            ) : isPaymentMethodSelected && isAddressSelected ? (
              <>
                <div className="flex text-primary  text-lg font-bold my-2">
                  <span className="w-8">3 </span>
                  <span>Xem lại sản phẩm và phương thức giao hàng</span>
                </div>
                <Card className="md:ml-8">
                  <CardContent className="p-4">
                    <p className="mb-2">
                      <span className="text-lg font-bold text-green-700">
                        Giao hàng ngày{" "}
                        {
                          formatDateTime(
                            calculateFutureDate(
                              AVAILABLE_DELIVERY_DATES[deliveryDateIndex!]
                                .daysToDeliver
                            )
                          ).dateOnly
                        }
                      </span>{" "}
                      Nếu bạn đặt hàng trong {timeUntilMidnight().hours} giờ và{" "}
                      {timeUntilMidnight().minutes} phút tới.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        {items.map((item, _index) => (
                          <div key={_index} className="flex gap-4 py-2">
                            <div className="relative w-16 h-16">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="20vw"
                                style={{
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">
                                {item.name}, {item.color}, {item.size}
                              </p>
                              <p className="font-bold">
                                <ProductPrice price={item.price} plain />
                                VNĐ
                              </p>
                              <Input
                                value={`Số lượng ${item.quantity.toString()}`}
                                readOnly
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className=" font-bold">
                          <p className="mb-2"> Chọn ngày giao hàng dự kiến:</p>
                          <ul>
                            <RadioGroup
                              value={
                                AVAILABLE_DELIVERY_DATES[deliveryDateIndex!]
                                  .name
                              }
                              onValueChange={(value) =>
                                setDeliveryDateIndex(
                                  AVAILABLE_DELIVERY_DATES.findIndex(
                                    (address) => address.name === value
                                  )!
                                )
                              }
                            >
                              {AVAILABLE_DELIVERY_DATES.map((dd) => (
                                <div key={dd.name} className="flex">
                                  <RadioGroupItem
                                    value={dd.name}
                                    id={`address-${dd.name}`}
                                  />
                                  <Label
                                    className="pl-2 space-y-2 cursor-pointer"
                                    htmlFor={`address-${dd.name}`}
                                  >
                                    <div className="text-green-700 font-semibold">
                                      {
                                        formatDateTime(
                                          calculateFutureDate(dd.daysToDeliver)
                                        ).dateOnly
                                      }
                                    </div>
                                    <div>
                                      {(dd.freeShippingMinPrice > 0 &&
                                      itemsPrice >= dd.freeShippingMinPrice
                                        ? 0
                                        : dd.shippingPrice) === 0 ? (
                                        "Miễn phí giao hàng"
                                      ) : (
                                        <>
                                          <ProductPrice
                                            price={dd.shippingPrice}
                                            plain
                                          />{" "}
                                          VNĐ
                                        </>
                                      )}
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </ul>
                        </div>
                        {isPaymentMethodSelected && isAddressSelected && (
                          <div className="mt-4">
                            <Button
                              onClick={handlePlaceOrder}
                              className="rounded-full w-full"
                            >
                              Đặt hàng
                            </Button>
                            <p className="text-xs text-center py-2">
                              Bằng cách đặt hàng, bạn đồng ý với {APP_NAME}
                              &apos;s{" "}
                              <Link href="/page/privacy-policy">
                                chính sách bảo mật
                              </Link>{" "}
                              và
                              <Link href="/page/conditions-of-use">
                                {" "}
                                điều khoản sử dụng
                              </Link>
                              .
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex text-muted-foreground text-lg font-bold my-4 py-3">
                <span className="w-8">3 </span>
                <span>Sản phẩm và vận chuyển</span>
              </div>
            )}
          </div>

          <CheckoutFooter />
        </div>
        <div className="hidden md:block">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  );
};
export default CheckoutForm;
