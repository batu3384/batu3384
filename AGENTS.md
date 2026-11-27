# Repository conventions

- `README.md` and `assets/board-*.svg` are generated artifacts. Edit `scripts/render-profile.mjs`, then run `node scripts/render-profile.mjs`. Never hand-edit generated files.
- Commit messages: plain conventional style (`feat:`, `fix:`, `chore:`). No AI-attribution lines — no "Generated with" trailers, no `Co-Authored-By` entries for tools or assistants.
- Automation commits use the repository owner's identity; bot accounts must not appear in the contributors list.
