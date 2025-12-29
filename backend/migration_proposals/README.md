Proposals for normalizing tickets attachments, tags and parts

These files are proposals only. They contain SQL and step-by-step guidance to:

- create normalized tables (`ticket_attachments`, `tags`, `ticket_tags`, `ticket_parts`)
- migrate existing data from `tickets.attachments`, `tickets.tags`, and `tickets.parts`
- provide a safe sequence of actions to review and execute manually in a controlled environment

DO NOT EXECUTE THESE FILES AUTOMATICALLY. Review on a staging DB and adapt to your current column types (JSONB / TEXT / TEXT[]). 

Files in this folder:
- 20251226-01-create-ticket-attachments.sql
- 20251226-02-create-tags-and-ticket_tags.sql
- 20251226-03-create-ticket-parts.sql
- 20251226-99-migration-guide.md
