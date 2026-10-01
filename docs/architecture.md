# ServiceNow Incident Client Script & UI Policy Architecture

## 1. Overview
This project enhances the ServiceNow Incident Management workflow by enforcing data integrity, automated field propagation, and process governance across Incident records.

## 2. Component Design

```
+---------------------------------------------------------------------------------+
|                                 ServiceNow Platform                             |
+---------------------------------------------------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v                                                         v
+--------------------------+                             +------------------------+
|       Client Scripts     |                             |       UI Policies      |
+--------------------------+                             +------------------------+
| 1. onChange (impact):    |                             | High Impact Control    |
|    When impact == 1      |                             | Condition: impact == 1 |
|    - Auto-set urgency=1  |                             | Actions:               |
|    - Show info message   |                             | - assignment_group:    |
|                          |                             |   Mandatory            |
| 2. onSubmit:             |                             | - urgency:             |
|    When impact == 1 and  |                             |   Read-only (disabled) |
|    assigned_to is empty  |                             | - Reverse if false:    |
|    - Block save          |                             |   Reverts when impact  |
|    - Show field error    |                             |   changes to 2 or 3    |
|                          |                             +------------------------+
| 3. onCellEdit (state):   |
|    Prevent inline state  |
|    change in list view   |
|    - Reject change       |
|    - Prompt form open    |
+--------------------------+
```

## 3. Order of Execution
1. **Form Load**: `onLoad` scripts and UI Policies with `on_load=true` evaluate.
2. **User Interaction**:
   - Changing `impact` to `1` triggers `onChange` client script setting `urgency` to `1` and displaying info banner.
   - UI Policy condition (`impact=1`) evaluates to true: `assignment_group` becomes mandatory, `urgency` becomes read-only.
3. **Form Submission**:
   - `onSubmit` client script evaluates. If `impact == '1'` and `assigned_to` is unpopulated, submission aborts (`return false`) with an inline field message.
4. **List View Protection**:
   - `onCellEdit` intercepts any double-click inline edit on the `state` field and rejects the transaction.
