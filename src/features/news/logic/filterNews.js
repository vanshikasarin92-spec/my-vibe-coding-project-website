// News filter. Pure: the news list is passed in.

// News: 'all' or one topic.
export function newsByTopic(items, topic) {
  return items.filter((n) => topic === 'all' || n.topic === topic);
}
