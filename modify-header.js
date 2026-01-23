for (const a in val) {
	if (val[a].name.toLowerCase() === 'set-cookie') {
        const cookieStr = val[a].value;
        if (cookieStr.includes('SameSite=')) {
            // 替换现有的SameSite值
            val[a].value = cookieStr.replace(/SameSite=[^;\s]*/i, 'SameSite=None; Secure;');
        } else {
          val[a].value = cookieStr + '; SameSite=None; Secure;';
        }
	}
    if (val[a].name.toLowerCase() === 'access-control-allow-origin') {
        val[a].value = "*";
    }
    if (val[a].name.toLowerCase() === 'content-security-policy') {
        val[a].value = "_header_editor_remove_";
    }
    if (val[a].name.toLowerCase() === 'content-security-policy-report-only') {
        val[a].value = "_header_editor_remove_";
    }
    if (val[a].name.toLowerCase() === 'x-frame-options') {
        val[a].value = "_header_editor_remove_";
    }
}