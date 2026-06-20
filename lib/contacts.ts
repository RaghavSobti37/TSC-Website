export const CONTACT_EMAILS = {
  general: 'hello@theshakticollective.in',
  artist: 'artist@theshakticollective.in',
} as const;

export const MAILTO = {
  general: `mailto:${CONTACT_EMAILS.general}`,
  artist: `mailto:${CONTACT_EMAILS.artist}`,
} as const;
