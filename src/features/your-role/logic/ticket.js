// Text that leaves the hub: a ticket for an action, and a role's done-checklist.
// Plain Markdown, which Jira, Azure DevOps and GitHub all accept when pasted:
// "- [ ]" checkboxes and a link back to the hub. Pure: no React, no browser.

// Link back to the hub, opening on the role. `src` says where the link was
// pasted (ticket, checklist) so visits from it can be told apart later.
export function hubLink(base, roleId, src) {
  const q = new URLSearchParams({ role: roleId, src });
  return `${base}?${q.toString()}#role`;
}

// The role a hub link asks for, if it is one of ours.
export function roleFromSearch(search, roleIds) {
  try {
    const id = new URLSearchParams(search).get('role');
    return id && roleIds.includes(id) ? id : null;
  } catch (e) {
    return null;
  }
}

const box = (s) => `- [ ] ${s}`;

// The Do-this-now text as ticket lines: code in a code block, a list as
// checkboxes (its first line is the list's heading), anything else quoted.
export function detailLines(text, kind, codeLang = '') {
  if (!text) return [];
  const lines = text.split('\n');
  if (kind === 'code') return ['```' + codeLang, ...lines, '```'];
  if (kind === 'list') {
    const [head, ...rest] = lines;
    return [`**${head}**`, ...rest.filter((l) => l.trim()).map((l) => box(l.replace(/^-\s*/, '')))];
  }
  return lines.map((l) => (l ? `> ${l}` : '>'));
}

// A ticket for one action. `L` is the ticket labels for the language.
export function ticketText({ L, title, why, byWhen, steps, details, link }) {
  return [
    `${L.prefix}: ${title}`,
    '',
    `**${L.why}:** ${why}`,
    byWhen ? `**${L.byWhen}:** ${byWhen}` : null,
    '',
    `**${L.doneWhen}:**`,
    ...steps.map(box),
    ...(details && details.length ? ['', `**${L.details}:**`, ...details] : []),
    '',
    `${L.more}: ${link}`,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

// A role's definition of done as a checklist to paste into a template.
export function checklistText({ L, dod, link }) {
  return [
    `## ${dod.title}`,
    '',
    dod.intro,
    '',
    ...dod.items.map(box),
    '',
    `${L.from}: ${link}`,
  ].join('\n');
}
