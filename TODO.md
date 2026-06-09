## List of features that needs to be implement in mobile app to make it usable

### NOTES:
- for now, app works only with local files/dirs, no remote. when i say remote, i mean in the future.
- noop - dummy UI, no logic for now.

### TODO

- list of added decks in home screen - each shows how many learned, left to learn and needs reviewing.
- add new deck screen - allow selecting a local directory or zip file (see ./OPEN-DECK_FORMAT.md) on the phone; if this is problematic due to permission/privacy/OS reasons, let me know and I'll propose different approach to add new decks.
- delete decks - deletes locally; in the future, remotely.
- each deck should have: review button, browse button and edit button.
- note review screen: top section - back button, progress bar and 3 dot menu with suspend option; middle - actual note content based on deck type, bottom - reveal and review buttons (good/easy/hard/again); this screen should be smooth, responsive and quick cuz that's the core place users will spend their time.
- note review screen: swipe to right to go back to previous card (fyi, back button at the top is for quitting the review) and allows changing review result (press different review button).
- deck browse button shows a minimized list of notes - on note press reveal the full note data in bottom drawer with edit and delete buttons; edit - noop for now, delete - delete the card fully (local+remote).
- deck edit screen - per-deck review settings, noop for now.
- home screen - stats section with daily, weekly, monthly stats
- sync button - noop for now.
- settings button + screen - noop for now; app settings including sync, data management.
- auto light/dark/system mode.

### IMPORTANT

- every single label, text, icon, or any element must have a purpose - always ask "does this thing have enough value to be on the screen?"; example: bad - "Today", "Good morning" banners, good - nothing instead.
