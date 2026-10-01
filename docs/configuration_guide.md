# Configuration Guide: Client Scripts & UI Policy (Incident)

## Target Platform
- **Instance**: Personal Developer Instance (PDI) `dev388119.service-now.com`
- **Application**: Incident Management [incident]

## Detailed Configuration Specifications

### 1. UI Policy: High Impact Control
- **Table**: `incident`
- **Short Description**: `High Impact Control`
- **Active**: `true`
- **Global**: `true`
- **On load**: `true`
- **Reverse if false**: `true`
- **Conditions**: `Impact [impact] is 1 - High` (`impact=1^EQ`)

#### UI Policy Actions:
1. **Assignment Group**:
   - Field: `assignment_group`
   - Mandatory: `True`
   - Read-only: `Leave alone`
   - Visible: `Leave alone`
2. **Urgency**:
   - Field: `urgency`
   - Mandatory: `Leave alone`
   - Read-only: `True`
   - Visible: `Leave alone`

---

### 2. Client Script: Auto set urgency for high impact
- **Name**: `Auto set urgency for high impact`
- **Table**: `incident`
- **Type**: `onChange`
- **Field name**: `impact`
- **UI Type**: `All` (Desktop and Mobile/Service Portal)
- **Active**: `true`
- **Global**: `true`

---

### 3. Client Script: Prevent save if Assigned To missing
- **Name**: `Prevent save if Assigned To missing`
- **Table**: `incident`
- **Type**: `onSubmit`
- **UI Type**: `All`
- **Active**: `true`
- **Global**: `true`

---

### 4. Client Script: Prevent state change via list edit
- **Name**: `Prevent state change via list edit`
- **Table**: `incident`
- **Type**: `onCellEdit`
- **Field name**: `state`
- **UI Type**: `All`
- **Active**: `true`
- **Global**: `true`
