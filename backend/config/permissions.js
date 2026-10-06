/**
 * RLG Admin — role/permission matrix.
 *
 * Single source of truth for "who can touch what". Routes import
 * SECTION_ROLES, the frontend mirrors the same shape via
 * `AdminContext.can()` so nav items can be hidden.
 *
 * Roles (must stay in sync with Admin.model.js):
 *   super_admin - everything
 *   admin       - everything except staff management
 *   editor      - content authoring only (no money, no settings)
 *   moderator   - content authoring + review (no money, no settings)
 */

// Staff who may author/edit content on the public site.
const CONTENT_ROLES = ['super_admin', 'admin', 'editor', 'moderator'];

// Staff who may see financial data and system configuration.
const ADMIN_ROLES = ['super_admin', 'admin'];

/**
 * Which roles may reach each admin section.
 * Use SECTION_ROLES[section] in a route: router.use(authorizeFor('donations'))
 */
const SECTION_ROLES = {
  // Overview
  dashboard: CONTENT_ROLES,

  // Content authoring
  blogs: CONTENT_ROLES,
  programs: CONTENT_ROLES,
  events: CONTENT_ROLES,
  gallery: CONTENT_ROLES,
  testimonials: CONTENT_ROLES,

  // Inbox / community responses
  contacts: CONTENT_ROLES,
  getinvolved: CONTENT_ROLES,

  // Shared
  upload: CONTENT_ROLES,

  // Restricted: money + configuration
  donations: ADMIN_ROLES,
  settings: ADMIN_ROLES,
  admins: ADMIN_ROLES,
  users: ADMIN_ROLES,
};

/** Roles allowed to administer other staff accounts. */
const STAFF_MANAGEMENT_ROLES = ['super_admin'];

const canAccess = (role, section) => {
  const allowed = SECTION_ROLES[section];
  if (!allowed) return false; // unknown section -> deny by default
  return allowed.includes(role);
};

/** Sections a role can see, for the client to build its nav. */
const sectionsFor = (role) =>
  Object.keys(SECTION_ROLES).filter((section) => canAccess(role, section));

module.exports = {
  CONTENT_ROLES,
  ADMIN_ROLES,
  STAFF_MANAGEMENT_ROLES,
  SECTION_ROLES,
  canAccess,
  sectionsFor,
};
