"use client";

import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

export const useProductDetails = (product: Product) => {
  const colourOptions =
    product.variantOptions.find((variant) => variant.name === "Colour")
      ?.values || [];
  const sizeOptions =
    product.variantOptions.find((variant) => variant.name === "Size")?.values ||
    [];

  // Initial state for selected options and error validation
  const [selectedColour, setSelectedColour] = useState<string | undefined>(
    undefined,
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined,
  );
  const [error, setError] = useState<{ size?: string; colour?: string }>({});

  const { toast } = useToast();

  //the selected variant of both size and colour are selected
  const selectedVariant = useMemo(() => {
    if (!selectedSize || !selectedColour) return undefined;

    const sizeOption = sizeOptions.find((s) => s.value === selectedSize);
    const colourOption = colourOptions.find((c) => c.value === selectedColour);

    if (!sizeOption || !colourOption) return undefined;

    return product.variants.find(
      (variant) =>
        variant.variantOptionIds.includes(sizeOption.id) &&
        variant.variantOptionIds.includes(colourOption.id),
    );
  }, [
    selectedSize,
    selectedColour,
    sizeOptions,
    colourOptions,
    product.variants,
  ]);

  // Reorder images to make sure the selected images at first
  const orderedImages = useMemo(() => {
    if (!selectedVariant) return product.images;

    const variantImageIndex = selectedVariant.imageIndex;

    if (variantImageIndex < 0 || variantImageIndex >= product.images.length) {
      return product.images;
    }

    const matchingImage = product.images[variantImageIndex];

    const remainingImages = product.images.filter(
      (image, index) => index !== variantImageIndex,
    );

    return [matchingImage, ...remainingImages];
  }, [selectedVariant, product.images]);

  //Check variant is available or outOfStock
  const isSizeOptionAvailable = (sizeOption: { id: number; value: string }) => {
    if (selectedColour) {
      const selectedColourOption = colourOptions.find(
        (c) => c.value === selectedColour,
      );

      if (!selectedColourOption) return true;

      const matchingVariants = product.variants.filter(
        (variant) =>
          variant.variantOptionIds.includes(sizeOption.id) &&
          variant.variantOptionIds.includes(selectedColourOption.id),
      );

      return matchingVariants.some((variant) => !variant.outOfStock);
    }

    //if no colour selected - check size only => return true if has stock of the para size regardless colour
    const matchingVariants = product.variants.filter((variant) =>
      variant.variantOptionIds.includes(sizeOption.id),
    );

    return matchingVariants.some((variant) => !variant.outOfStock);
  };

  // Check whether a given colour option is available or Out of stock => same as size
  const isColourOptionAvailable = (colourOption: {
    id: number;
    value: string;
  }) => {
    if (selectedSize) {
      const selectedSizeOption = sizeOptions.find(
        (s) => s.value === selectedSize,
      );

      if (!selectedSizeOption) return true;

      const matchingVariants = product.variants.filter(
        (variant) =>
          variant.variantOptionIds.includes(colourOption.id) &&
          variant.variantOptionIds.includes(selectedSizeOption.id),
      );

      return matchingVariants.some((variant) => !variant.outOfStock);
    }

    const matchingVariants = product.variants.filter((variant) =>
      variant.variantOptionIds.includes(colourOption.id),
    );

    return matchingVariants.some((variant) => !variant.outOfStock);
  };

  //Select Size Change
  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    setError((prev) => ({ ...prev, size: undefined }));
  };

  //Select Colour Change
  const handleColourChange = (value: string) => {
    setSelectedColour(value);
    setError((prev) => ({ ...prev, colour: undefined }));
  };

  //Add To Cart Click
  const handleAddToCart = () => {
    let errors: { size?: string; colour?: string } = {};
    if (!selectedSize) errors.size = "Please select a size.";
    if (!selectedColour) errors.colour = "Please select a colour.";
    setError(errors);
    if (Object.keys(errors).length === 0) {
      const variantNames = `${selectedSize} - ${selectedColour}`;
      toast({
        title: "Added to Cart",
        description: `You've added ${product.title} - ${variantNames} to your cart.`,
        duration: 10000,
      });
      console.log("Ok to add to cart:", { selectedSize, selectedColour });
      // Add-to-cart logic here.
    }
  };

  // Use the variant’s price if available; otherwise, use the product price.
  const displayedPrice = selectedVariant
    ? selectedVariant.price
    : product.price;

  return {
    colourOptions,
    sizeOptions,
    selectedColour,
    selectedSize,
    error,
    orderedImages,
    displayedPrice,
    isSizeOptionAvailable,
    isColourOptionAvailable,
    handleSizeChange,
    handleColourChange,
    handleAddToCart,
    selectedVariant,
  };
};
