/**
 * Client Script: Auto set urgency for high impact
 * Table: Incident [incident]
 * Type: onChange
 * Field: Impact [impact]
 * Description: Automatically sets urgency to 1 (High) and displays an info message when impact is set to 1 (High).
 */
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }

    // Check if Impact is changed to 1 - High
    if (newValue == '1') {
        g_form.setValue('urgency', '1');
        g_form.addInfoMessage('Urgency set to High for High impact incident.');
    }
}
