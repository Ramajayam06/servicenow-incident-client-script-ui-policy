# Functional Test Plan & Verification Matrix

| Test ID | Test Scenario | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-01 | Mandatory Enforcement | 1. Open new incident form.<br>2. Set Impact = 1.<br>3. Leave Assigned To empty.<br>4. Attempt submit. | Urgency auto-sets to 1 and becomes read-only. Assignment Group becomes mandatory. Form submission is blocked with error message on Assigned To. | Urgency=1 (read-only), Assignment Group mandatory, submission blocked with field message: "Assigned To is mandatory for High impact incidents." | **PASS** |
| TC-02 | Successful Save | 1. Set Impact = 1.<br>2. Fill Assignment Group.<br>3. Populate Assigned To with valid user.<br>4. Submit form. | Save succeeds. Record is inserted. Priority is calculated as Critical (1). | Record INC0010001 created with Priority 1, Impact 1, Urgency 1. | **PASS** |
| TC-03 | Reverse Condition | 1. Open INC0010001.<br>2. Change Impact to 2 (Medium). | Urgency unlocks from read-only. Assignment Group reverts to non-mandatory. | Urgency unlocked, Assignment Group mandatory state reverts. | **PASS** |
| TC-04 | List Edit Blocking | 1. Navigate to Incident list view.<br>2. Double-click State column cell to edit. | Alert displayed: "State cannot be updated using list editing. Please open the Incident." Cell edit is canceled. | Alert triggered, edit canceled via callback(false). | **PASS** |
| TC-05 | Form-based Update | 1. Open incident form.<br>2. Change State to "In Progress".<br>3. Save form. | State updates successfully from form view. | State updated to In Progress, save successful. | **PASS** |
