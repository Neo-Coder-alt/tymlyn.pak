export const BRAND = {
  name: "TYMLYN PAK",
  whatsapp: "923372510542",
  whatsappUrl: "https://wa.me/923372510542",
  instagram: "https://www.instagram.com/tymlyn_pak?igsh=MXZ6eTQ2b2NuNWM5cg==",
  facebook: "https://www.facebook.com/share/1GKr7tWfKM/?mibextid=wwXIfr",
};

export const whatsappOrderLink = (message: string) =>
  `${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`;
