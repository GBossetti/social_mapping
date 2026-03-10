# Social Emergency Map — Product Description

## Vision

Help emergency coordinators and field workers act together, in real time, on a shared map — so no vulnerable person gets missed.

---

## Problem

During a social emergency (flood, earthquake, displacement), coordination happens over WhatsApp, spreadsheets, and phone calls. Teams don't know where each other are, who has already been attended, or where resources are. People fall through the cracks.

---

## Users

### Ana — Emergency Coordinator
- Runs the response from a command post or vehicle
- Declares the emergency, assigns the zone, monitors overall progress
- **Needs:** full situational awareness — who's been attended, what resources exist, where her team is

### Marco — Field Responder (Social Worker / Volunteer)
- Moving through the field, on foot or by vehicle
- Joins with a code shared by Ana
- **Needs:** see priority persons on the map, report what he finds, mark people as attended, share his location so the team knows where he is

---

## Jobs to Be Done

| Persona | Job | "So that..." |
|---------|-----|--------------|
| Coordinator | Declare an emergency with a named zone | the team has a shared operational picture |
| Coordinator | Share a join code with responders | anyone can join without accounts or IT setup |
| Coordinator | See all priority persons and their status | no one gets missed |
| Coordinator | See where each team member is | she can dispatch and redirect |
| Field Responder | Join an active emergency instantly | he can start working without delay |
| Field Responder | See priority persons near him on the map | he knows who to visit next |
| Field Responder | Mark a person as attended | the team knows that case is handled |
| Field Responder | Report a new person or situation found in the field | newly discovered needs get logged |
| Field Responder | Share his GPS location | the coordinator and teammates can see him |
| Any user | See available resources (shelters, supplies) | they can direct people to the right place |

---

## Core User Journey

1. **Crisis starts** — Ana opens the app, declares "Lisbon Flood 2026", places the emergency center on the map, and sets a radius.
2. **Team assembles** — Ana shares the 6-character code. Marco and 3 other volunteers enter it, type their name and role, and land on the same map.
3. **Field work begins** — Marco sees priority persons as pins on the map (pre-loaded from a registry or reported by others). He navigates to the nearest one.
4. **Person attended** — Marco visits an elderly woman, taps her pin, opens the panel, taps "Mark as Attended". The pin updates for the whole team instantly.
5. **New discovery** — Marco finds an isolated family not in the registry. He taps +, drops a pin, and fills in their details. They appear as a new priority person for the team.
6. **Resource found** — A volunteer locates a shelter with spare capacity. She adds it as a Resource. Other team members can now see it and direct evacuees.
7. **Coordination** — Ana watches the map. She sees which zone still has unattended persons (red pins) and messages Marco to move there. She can see his GPS dot moving.
8. **Resolution** — As all pins turn attended, Ana closes the emergency.

---

## Key Features

- **Declare or join** — Create an emergency in seconds or join one with a 6-character code. No accounts needed.
- **Shared live map** — Everyone sees the same map, updated in real time as the team works.
- **Priority persons** — Pin vulnerable individuals on the map with vulnerability tags (elderly, disabled, child, medical, isolated) and track their attendance status (Pending → Attended).
- **Resources** — Add shelters, supply points, mobile teams, and partner organizations as map markers.
- **Situation reports** — Drop a free-text pin anywhere to flag something the team needs to know.
- **Location sharing** — Voluntarily broadcast GPS position so the coordinator and teammates can see where you are on the map.
- **Attendance tracking** — Mark a priority person as attended; the whole team sees it immediately.
- **Mobile-first** — Works on a phone in the field with a bottom-sheet UI; desktop gets a full sidebar.

---

## Non-Goals

- **No authentication** — The product relies on the join code for access control. There are no accounts, passwords, or roles enforced by the system.
- **No case management** — Detailed case notes, follow-ups, and legal documentation are out of scope. A link-out to external case systems is the only connection to case management.
- **No messaging / chat** — Communication happens outside this tool (WhatsApp, radio). This app is map + status, not a communications platform.
- **No historical analytics** — Post-emergency reports, dashboards, or data exports are not in scope for the MVP.
- **No offline mode** — The app requires internet. Offline field use is not a current requirement.
- **No multi-emergency management** — Coordinators manage one emergency at a time. There is no global dashboard across emergencies.

---

## Domain Glossary

| Term | Meaning |
|------|---------|
| **Emergency** | A named response operation with a geographic zone and a team |
| **Priority Person** | A vulnerable individual who needs to be visited and assisted |
| **Attend / Attended** | A field responder has reached and assisted a priority person |
| **Vulnerability tags** | Risk factors associated with a person: elderly, disabled, child, medical, isolated |
| **Resource** | Infrastructure or service available to the team (shelter, supply point, mobile team, partner org) |
| **Situation** | A free-text field observation that doesn't fit a person or resource |
| **Team Member** | Anyone who has joined the emergency (coordinator or field responder) |
| **Emergency Zone** | A circular area on the map defining the operational boundary |
| **Join Code** | 6-character code used to join an emergency without an account |
| **Location Sharing** | Voluntary GPS broadcast; a team member's dot appears on the map for others |

---

## Open Questions

- [ ] Can a coordinator pre-load priority persons from a CSV or external registry before the emergency starts?
- [ ] Is there a maximum number of team members per emergency?
- [ ] Can the emergency zone be a polygon instead of a circle?
- [ ] What happens to data after an emergency is closed — is it archived or deleted?
- [ ] Should "Situation" markers have a status (open / resolved) that the team can update?
- [ ] Is the join code intended to be public (sharable on social media) or controlled (shared only with trusted responders)?
