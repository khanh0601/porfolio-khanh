let posthogPromise;

const getPostHog = () => {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return Promise.resolve(null);

  if (!posthogPromise) {
    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: import.meta.env.VITE_POSTHOG_HOST,
        person_profiles: 'identified_only',
      });
      return posthog;
    });
  }

  return posthogPromise;
};

export const initAnalytics = () => getPostHog();

export const captureEvent = (event, properties) => {
  getPostHog()
    .then(posthog => posthog?.capture(event, properties))
    .catch(() => {
      // Analytics must never affect the experience.
    });
};
