# CLAUDE.md

## Plugin Overview

Tic-Tac-Toe game plugin for GUI Chat. Play Tic-Tac-Toe against the LLM.

## Common Guidelines

For standard plugin development guidelines, see:
https://github.com/receptron/GUIChatPluginTemplate/blob/main/CLAUDE.md

## Plugin-Specific Notes

### Features
- Interactive 3x3 game board
- User vs LLM gameplay
- Win/draw detection

### Game Pattern
Similar to Othello plugin - uses "User vs LLM" game pattern with `updating` and `instructionsRequired`.

### Dependencies
- `gui-chat-protocol`: Core protocol for GUI Chat plugins

## Updating This Document

When making spec changes through discussion with Claude, update this file to reflect new constraints or architectural decisions.
