export const validateWebhookUrl = (url) => {
  if (!url) return false;
  return url.startsWith("https://hooks.slack.com/services/");
};
