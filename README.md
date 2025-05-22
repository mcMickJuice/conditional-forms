# Dynamic Conditional Form

## Overview

A form input's required state can be determined by the state of one to many form inputs. Rules can be nested, with and/or logic and rules vary from equality checks, comparisons (e.g. greater than) and set membership checks (e.g. includes).

The required state of all forms are re-calculated with every form update.

Rule Definitions are turned into hydrated "rule trees" on the client. These rule trees are then processed by the rules engine on every form change. The rules engine runs entirely on the client.

![image](https://github.com/user-attachments/assets/231d28ea-3d73-45f8-a017-b7d696acfffb)
