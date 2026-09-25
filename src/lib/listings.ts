export const formatPrice = (price: number, currency = "RWF", listingType = "rent") => {
  const amount = Number(price).toLocaleString();
  const value = currency === "RWF" ? `RWF ${amount}` : currency === "EUR" ? `€${amount}` : `$${amount}`;
  return listingType === "rent" ? `${value} / month` : value;
};

export const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
