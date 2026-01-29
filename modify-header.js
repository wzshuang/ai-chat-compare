for (const a in val) {
	if (val[a].name.toLowerCase() === 'set-cookie') {
        const cookieStr = val[a].value;
        if (cookieStr.includes('SameSite=')) {
            val[a].value = cookieStr.replace(/SameSite=[^;\s]*/i, 'SameSite=None; Secure;');
        } else {
          val[a].value = cookieStr + '; SameSite=None; Secure;';
        }
	}
    if (val[a].name.toLowerCase() === 'content-security-policy') {
        val[a].value = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: file:; ";
    }
    if (val[a].name.toLowerCase() === 'content-security-policy-report-only') {
        val[a].value = "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: file:; ";
    }
    if (val[a].name.toLowerCase() === 'x-frame-options') {
        val[a].value = "INVALID_VALUE";
    }
}