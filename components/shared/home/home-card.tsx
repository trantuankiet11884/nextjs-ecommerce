import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
type CardItem = {
  title: string;
  link: { text: string; href: string };
  items: {
    name: string;
    items?: string[];
    image: string;
    href: string;
  }[];
};
export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-md flex flex-col">
          <CardContent className="p-4 flex-1">
            <h3 className="text-xl font-bold mb-4 line-clamp-1">
              {card.title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {card.items.map((item) => (
                <Link
                  prefetch={true}
                  key={item.name}
                  href={item.href}
                  className="flex flex-col border rounded-md p-2"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="aspect-square object-scale-down max-w-full h-auto mx-auto"
                    height={120}
                    width={120}
                    loading="lazy"
                  />
                  <p className="text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
          {card.link && (
            <CardFooter>
              <Link
                prefetch={true}
                href={card.link.href}
                className="mt-4 block hover:underline"
              >
                {card.link.text}
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
