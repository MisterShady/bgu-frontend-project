export const formatPrice = (price: number): string => {
    const roundedPrice = Math.round(price);
    return roundedPrice.toString();
};
