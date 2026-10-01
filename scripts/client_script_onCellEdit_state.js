/**
 * Client Script: Prevent state change via list edit
 * Table: Incident [incident]
 * Type: onCellEdit
 * Field: State [state]
 * Description: Prevents updating the Incident State field via list editing, requiring users to open the form.
 */
function onCellEdit(sysIDs, table, subeditCallback) {
    var saveAndClose = true;
    
    // Alert user that list editing is disallowed for Incident State
    alert('State cannot be updated using list editing. Please open the Incident.');
    
    // Reject the cell edit
    subeditCallback(false);
}
