// سیستم کش برای API ها
const CACHE_TIME = {
  SHORT: 5 * 60 * 1000, // 5 دقیقه
  MEDIUM: 30 * 60 * 1000, // 30 دقیقه
  LONG: 60 * 60 * 1000, // 1 ساعت
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 ساعت
};

class APICache {
  constructor() {
    this.cache = new Map();
    this.profileCache = new Map(); // کش مخصوص پروفایل‌ها
  }

  get(key, type = "general") {
    const cache = type === "profile" ? this.profileCache : this.cache;
    const item = cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > item.ttl) {
      cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key, data, ttl, type = "general") {
    const cache = type === "profile" ? this.profileCache : this.cache;
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(key, type = "general") {
    const cache = type === "profile" ? this.profileCache : this.cache;
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }

  // پاک کردن کش‌های منقضی شده
  cleanup() {
    const now = Date.now();
    [this.cache, this.profileCache].forEach((cache) => {
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > value.ttl) {
          cache.delete(key);
        }
      }
    });
  }
}

export const apiCache = new APICache();
export { CACHE_TIME };
