# ServiceNow Incident Management: Client Script & UI Policy Implementation

[![Platform](https://img.shields.io/badge/Platform-ServiceNow%20Brazil%20Patch%200-80B434?logo=servicenow&logoColor=white)](https://dev388119.service-now.com)
[![SkillWallet](https://img.shields.io/badge/SkillWallet-100%25%20Completed-brightgreen)](https://myskillwallet.ai)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade ServiceNow customization on the `incident` table enforcing automated urgency assignment, dynamic mandatory controls, submission validation, and list-editing protections.

---

## 📌 Executive Summary

| Attribute | Value |
|---|---|
| **SkillWallet Project** | Implement Client Script & UI Policy (Incident) |
| **SkillWallet Project ID** | `6a96be31a12a0aa74175619b` |
| **SkillWallet Subscribed ID** | `6ab4c9b66603573ccfb52b9e` |
| **ServiceNow Instance (PDI)** | [https://dev388119.service-now.com](https://dev388119.service-now.com) |
| **Target Table** | `incident` |
| **Test Record** | `INC0010001` (Priority: 1 - Critical) |
| **Repository URL** | [https://github.com/Ramajayam06/servicenow-incident-client-script-ui-policy](https://github.com/Ramajayam06/servicenow-incident-client-script-ui-policy) |
| **Demo URL** | [https://dev388119.service-now.com](https://dev388119.service-now.com) |
| **Completion Status** | 100% (All 7 Epics / 11 Stories Completed) |

---

## Team Members

| Name | Role | Email |
|------|------|-------|
| Ramajayam V | Team Leader | ramajayamv06@gmail.com |
| Sharmila A | Member | sharmilathanam2007@gmail.com |
| Shyam S | Member | shyam10a2@gmail.com |
| Dhayanithi S | Member | Dhayanithi08012008@gmail.com |

---

## 🏗️ Architecture & Requirements Overview

```
                      +-----------------------------+
                      |   Incident Form / List View |
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                      |                      |
      [Field: impact == 1]   [Field: Assigned To]    [Field: state]
              |                      |                      |
              v                      v                      v
     +-----------------+    +-----------------+    +-----------------+
     | onChange Script |    | onSubmit Script |    | onCellEdit      |
     | Auto Urgency=1  |    | Block if Empty  |    | Block List Edit |
     +--------+--------+    +-----------------+    +-----------------+
              |
              v
     +-----------------+
     | UI Policy       |
     | High Impact     |
     | - Urgency: Lock |
     | - Group: Mand.  |
     +-----------------+
```

### Business Rules Enforced:
1. **Dynamic Urgency Sync**: When an incident's Impact is set to `1 - High`, Urgency is automatically set to `1 - High` and a banner is displayed.
2. **Dynamic UI Governance**: If Impact is `1 - High`, Assignment Group becomes mandatory and Urgency is rendered read-only so operators cannot downgrade urgency without addressing impact.
3. **Submission Gatekeeper**: High-impact incidents must have an `Assigned To` person assigned prior to saving. Submission is blocked with a field error if missing.
4. **List Audit Protection**: State progression cannot be bypassed via inline cell editing in incident list views. Operators must open the record form.

---

## 🛠️ Implemented Configurations

### 1. UI Policy: High Impact Control
- **Table**: `incident`
- **Short Description**: `High Impact Control`
- **Active**: `true` | **Global**: `true` | **Reverse if false**: `true`
- **Conditions**: `impact=1^EQ` (Impact is 1 - High)
- **Actions**:
  - `assignment_group` -> Mandatory: `true`, Visible: `ignore`, Read-only: `ignore`
  - `urgency` -> Read-only (disabled): `true`, Mandatory: `ignore`, Visible: `ignore`

### 2. Client Scripts

#### A. onChange Client Script: "Auto set urgency for high impact"
- **Table**: `incident`
- **Type**: `onChange`
- **Field name**: `impact`
- **Logic**:
```javascript
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }
    if (newValue === '1') {
        g_form.setValue('urgency', '1');
        g_form.addInfoMessage('Urgency set to High for High impact incident.');
    }
}
```

#### B. onSubmit Client Script: "Prevent save if Assigned To missing"
- **Table**: `incident`
- **Type**: `onSubmit`
- **Logic**:
```javascript
function onSubmit() {
    var impact = g_form.getValue('impact');
    var assignedTo = g_form.getValue('assigned_to');
    
    if (impact === '1' && (!assignedTo || assignedTo.trim() === '')) {
        g_form.showFieldMsg('assigned_to', 'Assigned To is mandatory for High impact incidents.', 'error');
        return false;
    }
    return true;
}
```

#### C. onCellEdit Client Script: "Prevent state change via list edit"
- **Table**: `incident`
- **Type**: `onCellEdit`
- **Field name**: `state`
- **Logic**:
```javascript
function onCellEdit(sysIDs, table, oldValues, newValue, callback) {
    var saveAndClose = false;
    alert('State cannot be updated using list editing. Please open the Incident.');
    callback(saveAndClose);
}
```

---

## 🧪 Functional Verification & Test Evidence

All 5 core validation scenarios were tested directly on ServiceNow instance `https://dev388119.service-now.com`:

| Scenario | Objective | Input / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-01** | Mandatory & Lock Enforcement | Impact changed to `1 - High`, `assigned_to` empty, click Save | Urgency auto-sets to 1, info banner displayed, Assignment Group mandatory, save blocked with error | Info message displayed, urgency set & disabled, assignment group mandatory, save rejected | **PASSED** |
| **TC-02** | Successful High-Impact Save | Impact `1 - High`, Assignment Group `Hardware`, Assigned To `David Loo`, click Save | Record saves cleanly, Priority auto-calculates to `1 - Critical` | Incident `INC0010001` created with Critical priority | **PASSED** |
| **TC-03** | UI Policy Reversal | Change Impact from `1 - High` to `2 - Medium` | Urgency unlocks, Assignment Group mandatory reverts to optional | Fields dynamically unlocked & reverted | **PASSED** |
| **TC-04** | List Edit Block | Double-click `State` column in `incident_list.do` | Edit modal interrupted with alert dialogue, change cancelled | Alert shown: *"State cannot be updated..."*, edit aborted | **PASSED** |
| **TC-05** | Form State Update | Change State to `In Progress` in form view and save | State updates successfully without blocking | Record updated cleanly in database | **PASSED** |

---

## 📂 Repository Structure

```
servicenow-incident-client-script-ui-policy/
│
├── README.md                                    # Project overview and documentation
├── scripts/                                     # JavaScript source code & UI policy definitions
│   ├── client_script_onChange_impact.js         # Auto-set urgency onChange script
│   ├── client_script_onSubmit_assigned_to.js    # Validation onSubmit script
│   ├── client_script_onCellEdit_state.js        # List-edit guard onCellEdit script
│   └── ui_policy_high_impact_control.json       # UI Policy export payload
│
├── docs/                                        # Technical design and documentation
│   ├── architecture.md                          # Architecture diagram & execution flow
│   ├── configuration_guide.md                   # Step-by-step PDI setup guide
│   └── test_plan.md                             # Comprehensive test cases & matrix
│
├── evidence/                                    # Proof of deployment and test logs
│   ├── servicenow_api_verification.json         # Live API export of deployed records
│   └── test_execution_logs.md                   # Real-time execution output logs
│
├── screenshots/                                 # UI verification captures
│   ├── 01_incident_form_high_impact.png         # Live incident form verification
│   └── 02_skillwallet_workspace.png             # SkillWallet 100% completion verification
│
└── demo/                                        # Demo environment details
    ├── demo_walkthrough.md                      # End-to-end interactive demo guide
    └── instance_info.txt                        # Target PDI instance specifications
```

---

## 🚀 Deployment Instructions

1. **Deploy UI Policy**:
   - Navigate to **System UI > UI Policies**.
   - Create new policy for table `incident`.
   - Set condition `Impact is 1 - High`.
   - Add UI Policy Actions for `assignment_group` (Mandatory = True) and `urgency` (Read-only = True).
2. **Deploy Client Scripts**:
   - Navigate to **System Definition > Client Scripts**.
   - Import each script from `scripts/` matching the respective Table, Type, and Field configurations.
3. **Verify Functionality**:
   - Execute verification test plan documented in `docs/test_plan.md`.

---

## 👤 Author & Credentials
- **Student**: Ramajayam V (`ramajayamv06@gmail.com`)
- **GitHub**: [@Ramajayam06](https://github.com/Ramajayam06)
- **Project Verified On**: SkillWallet & ServiceNow PDI `dev388119`
