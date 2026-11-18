// Turns Supabase news rows into the shape the News screen uses (same as data/news.js).
export function newsFromRows(rows) {
  return (rows || []).map((r) => ({
    date: r.published_on,
    label: r.date_label,
    topic: r.topic_id,
    tag: r.tag,
    title: r.title,
    body: r.body,
    meansLead: r.means_lead,
    means: r.means,
    sourcesLabel: r.sources_label,
    sources: [...(r.news_sources || [])]
      .sort((a, b) => a.position - b.position)
      .map((s) => ({ label: s.label, href: s.url })),
  }));
}
