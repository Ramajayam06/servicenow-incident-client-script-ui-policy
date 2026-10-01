# ServiceNow Incident Client Script & UI Policy Walkthrough

This demo walkthrough outlines the live verification workflow conducted on instance **`https://dev388119.service-now.com`**.

## Prerequisites
- ServiceNow instance: `https://dev388119.service-now.com`
- Incident form: `https://dev388119.service-now.com/incident.do`
- Incident list: `https://dev388119.service-now.com/incident_list.do`

---

## Step-by-Step Functional Demonstration

### Scenario 1: High Impact Incident Dynamic Enforcement
1. Navigate to **Incident > Create New** (`incident.do`).
2. Select Caller: e.g. `System Administrator` or `David Loo`.
3. In the **Impact** dropdown, change value from `3 - Low` to `1 - High`.
4. **Observed Behavior**:
   - **onChange Client Script** executes immediately:
     - Field `Urgency` is set to `1 - High`.
     - Blue banner appears at top: *"Urgency set to High for High impact incident."*
   - **UI Policy ("High Impact Control")** executes:
     - Field `Assignment Group` dynamically gains mandatory asterisk indicator.
     - Field `Urgency` is locked (disabled / read-only) to prevent downgrade.
5. Attempt to click **Save** or **Submit** without filling `Assigned To`.
6. **Observed Behavior**:
   - **onSubmit Client Script** triggers:
     - Red field-level message under `Assigned to`: *"Assigned To is mandatory for High impact incidents."*
     - Form submission is aborted (`return false;`).

---

### Scenario 2: Successful High Priority Incident Creation
1. Populate `Assignment group`: `Hardware` or `Software`.
2. Populate `Assigned to`: `David Loo` (or valid group member).
3. Click **Save** or **Submit**.
4. **Observed Behavior**:
   - Submission completes cleanly.
   - New incident `INC0010001` is saved into database.
   - Calculated **Priority** evaluates to `1 - Critical` (Impact 1 + Urgency 1).

---

### Scenario 3: Reverse Condition Enforcement
1. On an existing incident record, change `Impact` from `1 - High` to `2 - Medium`.
2. **Observed Behavior**:
   - UI Policy reverses automatically:
     - `Urgency` becomes unlocked and editable.
     - `Assignment Group` mandatory requirement is removed.

---

### Scenario 4: List Edit Protection
1. Navigate to **Incident > All** list view (`incident_list.do`).
2. Double-click the **State** cell of any incident row.
3. Attempt to alter the State dropdown from the inline list editor.
4. **Observed Behavior**:
   - **onCellEdit Client Script** intercepts the event:
     - Alert dialogue prompts: *"State cannot be updated using list editing. Please open the Incident."*
     - Inline edit is canceled (`callback(false)`). Record state remains intact.

---

### Scenario 5: Valid Form-Based State Progression
1. Open incident record `INC0010001` in the standard form view.
2. Update **State** from `New` to `In Progress` or `On Hold`.
3. Click **Save**.
4. **Observed Behavior**:
   - Update succeeds without alert, maintaining audit integrity.
