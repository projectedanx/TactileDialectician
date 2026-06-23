🔒 Fix: Dynamic Evaluation with nerdamer vulnerability

🎯 **What:** The vulnerability fixed
The `executorService` used `nerdamer(input).evaluate()` directly without any input sanitization. This allowed execution of unexpected mathematical logic, and potentially arbitrary JS code execution through Javascript evaluation vectors like `eval()` and `__proto__`.

⚠️ **Risk:** The potential impact if left unfixed
Malicious inputs such as `__proto__=1`, `constructor()`, or `eval()` could be evaluated by the underlying engine. This puts the application at risk of Denial of Service (DoS) and potential Logic Flaws / prototype pollution issues depending on the JavaScript engine.

🛡️ **Solution:** How the fix addresses the vulnerability
A pre-compiled Regular Expression `DANGEROUS_KEYWORDS` was added with a helper function `isSafeInput()`. It uses word boundaries `\b` to efficiently reject dangerous JavaScript keywords and properties (`__proto__`, `constructor`, `eval`, `Function`, `require`, `process`, `global`, `window`, `document`, `setTimeout`, `setInterval`) before evaluating them in both `executeDeterministic` and tool-based `executeLLM` branches. Safe mathematical strings containing these keywords as substrings (e.g., `evaluation` or `revalue`) remain fully functional.

Tests were also included in `lib/executorService.test.ts` to assert that the vulnerable code paths return `Security Error: Dangerous input detected` while safe code paths remain properly evaluated.
