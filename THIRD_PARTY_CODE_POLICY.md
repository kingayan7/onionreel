# OnionReel — Third‑Party Code Import Policy

Goal: accelerate OnionReel by reusing open-source code *safely*.

## Rules
1) **License gate**: before copying any code, record:
   - Repo URL
   - License (SPDX id)
   - Commit hash

2) **Allowed to copy by default**
- MIT
- Apache-2.0
- BSD-2-Clause / BSD-3-Clause
- ISC

3) **Needs explicit approval**
- GPL-2.0, GPL-3.0, AGPL-3.0, LGPL (copyleft constraints)

4) **Attribution required**
- Add entry to `onionreel/THIRD_PARTY_NOTICES.md` with repo, author, license, commit.

5) **Prefer patterns over copy**
If license is unclear or restrictive, take UX ideas and implement clean-room.

## Import workflow (checklist)
- [ ] Identify candidate repo
- [ ] Inspect `LICENSE` + `package.json` / headers
- [ ] Pin commit hash
- [ ] Copy only minimal files needed
- [ ] Add THIRD_PARTY_NOTICES entry
- [ ] Add smoke test
