"use client";

import React from "react";
import { Product } from "@/types/product";
import { useProductDetails } from "./use-product-details";
import { ProductDetailsView } from "./product-details-view";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const productDetails = useProductDetails(product);

  return (
    <ProductDetailsView
      product={product}
      orderedImages={productDetails.orderedImages}
      displayedPrice={productDetails.displayedPrice}
      colourOptions={productDetails.colourOptions}
      sizeOptions={productDetails.sizeOptions}
      selectedColour={productDetails.selectedColour}
      selectedSize={productDetails.selectedSize}
      error={productDetails.error}
      handleSizeChange={productDetails.handleSizeChange}
      handleColourChange={productDetails.handleColourChange}
      handleAddToCart={productDetails.handleAddToCart}
      isSizeOptionAvailable={productDetails.isSizeOptionAvailable}
      isColourOptionAvailable={productDetails.isColourOptionAvailable}
    />
  );
};
