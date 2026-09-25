const modules = import.meta.glob('./*/*.ts', { eager: true });

const messages: Record<string, { translation: Record<string, string> }> = {};

Object.keys(modules).forEach((path) => {
  const match = path.match(/\.\/([^/]+)\/([^/]+)\.ts$/);
  if (match) {
    const [, lang] = match;
    const module = modules[path] as Record<string, unknown>;
    
    if (!messages[lang]) {
      messages[lang] = { translation: {} };
    }
    
    // Collect all string exports (named exports) as translation keys
    Object.entries(module).forEach(([key, val]) => {
      if (typeof val === 'string') {
        messages[lang].translation[key] = val;
      }
    });
    
    // Also merge default export if present
    if (module.default && typeof module.default === 'object' && module.default !== null) {
      messages[lang].translation = {
        ...messages[lang].translation,
        ...(module.default as Record<string, string>)
      };
    }
  }
});

export default messages;