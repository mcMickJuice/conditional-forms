# Dynamic Conditional Form

View the demo app [here](https://conditionalform.netlify.app/)

<img width="697" alt="Screenshot 2025-05-22 at 3 54 13 PM" src="https://github.com/user-attachments/assets/a5276d1f-ef15-4c82-b84c-1cf3dd3cfccb" />

## Overview

A form input's required state can be determined by the state of one to many form inputs. Rules can be nested, with and/or logic and rules vary from equality checks, comparisons (e.g. greater than) and set membership checks (e.g. includes).

The required state of all forms are re-calculated with every form update.

Rule Definitions are turned into hydrated "rule trees" on the client. These rule trees are then processed by the rules engine on every form change. The rules engine runs entirely on the client.

![image](https://github.com/user-attachments/assets/231d28ea-3d73-45f8-a017-b7d696acfffb)
