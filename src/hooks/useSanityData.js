/**
 * Runtime rooms use their bundled local content. Sanity remains build-only in
 * seo-plugin.js for generated metadata.
 */
export const isSanityConfigured = false;

const localData = Object.freeze({
    projects: null,
    content: null,
    awards: null,
    loaded: true,
    loading: false,
    error: null,
});

export const loadSanityData = () => Promise.resolve(localData);
export const isSanityDataLoaded = () => true;
export const useGalleryProjects = () => null;
export const useStudioContent = () => null;
export const useAwards = () => null;
