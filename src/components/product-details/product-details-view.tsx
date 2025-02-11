"use client";

import React from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Product } from "@/types/product";

interface ProductDetailsViewProps {
  product: Product;
  orderedImages: Product["images"];
  displayedPrice: number;
  colourOptions: { id: number; value: string }[];
  sizeOptions: { id: number; value: string }[];
  selectedColour: string | undefined;
  selectedSize: string | undefined;
  error: { size?: string; colour?: string };
  handleSizeChange: (value: string) => void;
  handleColourChange: (value: string) => void;
  handleAddToCart: () => void;
  isSizeOptionAvailable: (option: { id: number; value: string }) => boolean;
  isColourOptionAvailable: (option: { id: number; value: string }) => boolean;
}

export const ProductDetailsView = ({
  product,
  orderedImages,
  displayedPrice,
  colourOptions,
  sizeOptions,
  selectedColour,
  selectedSize,
  error,
  handleSizeChange,
  handleColourChange,
  handleAddToCart,
  isSizeOptionAvailable,
  isColourOptionAvailable,
}: ProductDetailsViewProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Carousel className="w-[800px] mr-16">
        <CarouselContent>
          {orderedImages.map((image) => (
            <CarouselItem key={image.url}>
              <Image src={image.url} alt={image.alt} width={500} height={500} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div>
        <h1 className="text-2xl font-semibold text-[#282828]">
          {product.title}
        </h1>
        <div className="flex items-center mt-2 mb-4">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-[#282828]">
            {product.rating.value} ({product.rating.count})
          </span>
        </div>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-4xl font-bold tracking-tighter text-[#f04a1c] mt-4">
          ${displayedPrice}
        </p>

        <div className="flex gap-4 mt-4">
          <div>
            <Select value={selectedSize} onValueChange={handleSizeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Size" />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((size) => {
                  const available = isSizeOptionAvailable(size);
                  return (
                    <SelectItem
                      key={size.id}
                      value={size.value}
                      disabled={!available}
                    >
                      {size.value}
                      {!available ? " - Out of Stock" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {error.size && (
              <p className="text-red-500 text-sm mt-1">{error.size}</p>
            )}
          </div>

          <div>
            <Select value={selectedColour} onValueChange={handleColourChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Colour" />
              </SelectTrigger>
              <SelectContent>
                {colourOptions.map((colour) => {
                  const available = isColourOptionAvailable(colour);
                  return (
                    <SelectItem
                      key={colour.id}
                      value={colour.value}
                      disabled={!available}
                    >
                      {colour.value}
                      {!available ? " - Out of Stock" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {error.colour && (
              <p className="text-red-500 text-sm mt-1">{error.colour}</p>
            )}
          </div>
        </div>
        <Button
          className="mt-4 font-semibold"
          size="lg"
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};
