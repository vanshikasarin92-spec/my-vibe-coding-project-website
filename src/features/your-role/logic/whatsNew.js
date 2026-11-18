// "What's new for your role": news items dated after the last visit whose
// topic is mapped to the role. Pure: the news list and topic map are passed in.

export function whatsNewFor(news, topicRoles, roleId, since) {
  return news
    .map((n) => ({
      ts: Date.parse(n.date),
      label: n.label,
      title: n.title,
      topic: n.topic,
    }))
    .filter((n) => n.ts > since && (topicRoles[n.topic] || []).includes(roleId))
    .sort((a, b) => b.ts - a.ts);
}
