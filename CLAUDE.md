# How to build

- Always build code cleanly, modularly, and with proper architecture and separation of concerns.
- Never simply bolt on a feature because I asked for it.
- If you can't find an easy way to build it naturally, and you'd recommend a refactor to make the whole thing clean, stop your work ahead of time and say so.

# Options before edits

- Before you edit anything, give me a few options first: what each one changes, its trade-offs, and which one you recommend. Then wait for me to pick.
- Only carry out the option I picked. If something new comes up while you work, stop and give me options for it too.
- Reading files, searching, running checks and taking screenshots are fine without asking; they help you write the options.
- If I've already named the exact change (for example "remove it" after you gave options), that is my pick.

# Git commit and PR rules

## Attribution
- Do NOT add any `Co-Authored-By:` trailer to commit messages. This includes `Co-Authored-By: Claude <noreply@anthropic.com>`.
- Do NOT add "🤖 Generated with Claude Code" or any similar line to commit messages, PR titles, PR descriptions, or code comments.
- Do NOT mention Claude, Claude Code, AI, or Anthropic in commits or PRs unless I explicitly ask.
- The only author of every commit is the configured git user (`git config user.name` / `user.email`). Do not change these values.

## Commit messages
- Use a short imperative summary line (max ~72 characters), e.g. `Add login validation`.
- Add a body only when the change needs explaining.
- End the message after the last line of the body. Do not add trailers of any kind.

## Before committing
- Check the final commit message and remove any attribution lines before running `git commit`.
- Never run `git push --force` or rewrite history unless I ask for it.
