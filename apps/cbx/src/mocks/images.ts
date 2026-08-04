/** Curated Unsplash images for mock marketplace content (no backend). */
export const img = {
  phone: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop',
    ][n - 1]!,
  laptop: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
    ][n - 1]!,
  car: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop',
    ][n - 1]!,
  motorcycle: () =>
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=800&fit=crop',
  house: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=800&fit=crop',
    ][n - 1]!,
  apartment: () =>
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=800&fit=crop',
  fashion: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop',
    ][n - 1]!,
  furniture: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
    ][n - 1]!,
  appliance: () =>
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=800&fit=crop',
  game: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&h=800&fit=crop',
    ][n - 1]!,
  sport: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=800&fit=crop',
    ][n - 1]!,
  bike: () =>
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=800&fit=crop',
  baby: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566454825481-9c31bd88bc34?w=800&h=800&fit=crop',
    ][n - 1]!,
  tools: () =>
    'https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?w=800&h=800&fit=crop',
  books: (n = 1) =>
    [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=800&fit=crop',
    ][n - 1]!,
  pet: () =>
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=800&fit=crop',
  office: () =>
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=800&fit=crop',
  store: {
    tech: {
      logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=400&fit=crop',
    },
    auto: {
      logo: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop',
      cover: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop',
    },
    home: {
      logo: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop',
      cover: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=400&fit=crop',
    },
    games: {
      logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
      cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop',
    },
    kids: {
      logo: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop',
      cover: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=400&fit=crop',
    },
    books: {
      logo: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop',
    },
  },
  avatar: (seed: string) =>
    `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ede9fe`,
  cover: (seed: string) =>
    `https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop&sat=-20&sig=${seed}`,
} as const
