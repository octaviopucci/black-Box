/** URLs de render por modelo — espelha api/_lp-motors/pucci-vehicle-images.ts */
export const vehicleImages: Record<string, string> = {
  pucci_001:
    "https://cdn.imagin.studio/getImage?customer=img&make=porsche&modelFamily=911&modelYear=2022&paintId=grey&angle=23&zoomType=fullscreen",
  pucci_002:
    "https://cdn.imagin.studio/getImage?customer=img&make=porsche&modelFamily=cayenne&modelYear=2021&paintId=white&angle=23&zoomType=fullscreen",
  pucci_003:
    "https://cdn.imagin.studio/getImage?customer=img&make=bmw&modelFamily=m4&modelYear=2023&paintId=blue&angle=23&zoomType=fullscreen",
  pucci_004:
    "https://cdn.imagin.studio/getImage?customer=img&make=bmw&modelFamily=x5&modelYear=2022&paintId=black&angle=23&zoomType=fullscreen",
  pucci_005:
    "https://cdn.imagin.studio/getImage?customer=img&make=mercedes-benz&modelFamily=amg%20gt&modelYear=2021&paintId=silver&angle=23&zoomType=fullscreen",
  pucci_006:
    "https://cdn.imagin.studio/getImage?customer=img&make=mercedes-benz&modelFamily=gle&modelYear=2023&paintId=black&angle=23&zoomType=fullscreen",
  pucci_007:
    "https://cdn.imagin.studio/getImage?customer=img&make=ferrari&modelFamily=roma&modelYear=2021&paintId=red&angle=23&zoomType=fullscreen",
  pucci_008:
    "https://cdn.imagin.studio/getImage?customer=img&make=aston%20martin&modelFamily=db11&modelYear=2020&paintId=green&angle=23&zoomType=fullscreen",
  pucci_009:
    "https://cdn.imagin.studio/getImage?customer=img&make=lamborghini&modelFamily=huracan&modelYear=2022&paintId=yellow&angle=23&zoomType=fullscreen",
  pucci_010:
    "https://cdn.imagin.studio/getImage?customer=img&make=audi&modelFamily=r8&modelYear=2021&paintId=black&angle=23&zoomType=fullscreen",
  pucci_011:
    "https://cdn.imagin.studio/getImage?customer=img&make=mclaren&modelFamily=570s&modelYear=2019&paintId=orange&angle=23&zoomType=fullscreen",
  pucci_012:
    "https://cdn.imagin.studio/getImage?customer=img&make=bentley&modelFamily=continental&modelYear=2022&paintId=white&angle=23&zoomType=fullscreen",
  pucci_013:
    "https://cdn.imagin.studio/getImage?customer=img&make=maserati&modelFamily=granturismo&modelYear=2024&paintId=blue&angle=23&zoomType=fullscreen",
  pucci_014:
    "https://cdn.imagin.studio/getImage?customer=img&make=rolls-royce&modelFamily=ghost&modelYear=2020&paintId=black&angle=23&zoomType=fullscreen",
  pucci_015:
    "https://cdn.imagin.studio/getImage?customer=img&make=lexus&modelFamily=lc&modelYear=2022&paintId=red&angle=23&zoomType=fullscreen",
};

export function vehicleImage(id: string): string {
  return vehicleImages[id] || vehicleImages.pucci_001;
}
