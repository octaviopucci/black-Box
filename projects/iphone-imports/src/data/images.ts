const u = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${w}&fit=crop&auto=format&q=80`;

/** URLs verificadas (Unsplash) — substitua por fotos próprias em src/data/products.ts */
export const productImages = {
  iphone: u("1695048133142-1a20484d2569"),
  iphonePro: u("1510557880182-3d4d3cba35a5"),
  iphoneAlt: u("1511707171634-5f897ff02aa9"),
  airpods: u("1606220945770-b5b6c2c55bf1"),
  airpodsMax: u("1484704849700-f032a568e944"),
  watch: u("1434493789847-2f02dc6ca35d"),
  watchAlt: u("1508685096489-7aacd43bd3b1"),
  case: u("1601784551446-20c9e07cdbdb"),
  caseAlt: u("1601593346740-925612772716"),
  screen: u("1585060544812-6b45742d762f"),
  charger: u("1588872657578-7efd1f1555ed"),
  chargerAlt: u("1556656793-08538906a9f8"),
  cable: u("1625948515291-69613efd103f"),
  powerbank: u("1587825140708-dfaf72ae4b04"),
  speaker: u("1545454675-3531b543be5d"),
  hub: u("1498049794561-7780e7231661"),
  stand: u("1523275335684-37898b6baf30"),
  car: u("1449965408869-eaa3f722e40d"),
  headphone: u("1590658268037-6bf12165a8df"),
  smartphone: u("1511707171634-5f897ff02aa9"),
  magsafe: u("1625842268584-8f3296236761"),
};

export const heroImages = {
  iphone: u("1695048133142-1a20484d2569", 900),
  airpods: u("1606220945770-b5b6c2c55bf1", 600),
  watch: u("1434493789847-2f02dc6ca35d", 600),
  charger: u("1588872657578-7efd1f1555ed", 500),
};
