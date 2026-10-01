/**
 * Client Script: Prevent save if Assigned To missing
 * Table: Incident [incident]
 * Type: onSubmit
 * Description: Prevents submission of high impact (impact == 1) incidents if Assigned To is missing.
 */
function onSubmit() {
    var impact = g_form.getValue('impact');
    var assignedTo = g_form.getValue('assigned_to');

    // If Impact is High (1) and Assigned To is not populated, prevent submission
    if (impact == '1' && (!assignedTo || assignedTo.trim() === '')) {
        g_form.showFieldMsg('assigned_to', 'Assigned To is mandatory for High impact incidents.', 'error');
        return false;
    }
}
