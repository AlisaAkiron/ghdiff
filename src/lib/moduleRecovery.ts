export function isModuleLoadError(error: Error): boolean {
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading chunk [\w-]+ failed/i.test(
    error.message
  );
}

/** Persist before reloading so an offline tab cannot enter a reload loop. */
export function claimModuleReload(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  now = Date.now()
): boolean {
  const key = 'ghdiff:module-reload';
  try {
    const previous = Number(storage.getItem(key));
    if (previous && now - previous < 60_000) return false;
    storage.setItem(key, String(now));
    return true;
  } catch {
    // Without a durable guard, leave recovery to the refresh button.
    return false;
  }
}
