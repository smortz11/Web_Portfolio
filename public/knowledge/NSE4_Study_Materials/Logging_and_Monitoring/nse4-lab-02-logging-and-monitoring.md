# Lab 02 — Logging and Monitoring

## How to use this template

Keep this file as the blank lab manual. Make a copy for each attempt and fill in the environment, observations, evidence and reflection fields. Keep the expected results in place so readers can compare them with what actually happened.

This is a community study lab, not an official Fortinet lab. Commands and menus vary by model and FortiOS build. The procedures have not been validated on your particular appliance. Follow the scope and cleanup instructions before making changes on a router that carries live traffic.

The client commands use Windows. If you use Linux or macOS, record the equivalent commands you used and keep adapter changes limited to the test client.

| Writeup metadata | Value |
| --- | --- |
| Author | <!-- Your name --> |
| Date completed | <!-- YYYY-MM-DD --> |
| Status | <!-- Not started / In progress / Completed / Partially completed --> |
| FortiGate model | <!-- Model --> |
| FortiOS version and build | <!-- Exact version --> |
| VDOM | <!-- VDOM name or not enabled --> |
| Lab environment | <!-- Dedicated lab or live home network --> |
| Time spent | <!-- Actual duration --> |
| Template source | <!-- Link to the blank template when published --> |

## Lab overview

**Generate evidence and investigate a missing traffic log**

Goal: follow an event from generation to storage to search, then use logs to explain one client connection. You will collect an administrative event, inspect traffic records and troubleshoot a deliberately incorrect search filter. No malware, scans or household-wide blocking are required.

Time: 60–90 minutes. Requirements: local administrator access, one test client and an available logging destination. FortiAnalyzer is optional; a paper exercise covers that portion if you do not own one.

### Prepare and record your baseline

1. Record FortiGate model, FortiOS build, VDOM, client IP and start time. Before any logging changes, download an encrypted configuration backup from the administrator menu under Configuration > Backup, or the equivalent menu on your release. Store the password separately and record the backup filename and time; restoring a backup is an outage recovery action, not routine cleanup. Keep the normal administrator session open.

2. Run `get system performance status` and record CPU/memory use. Open an ordinary website from your client and check a second household device. Set a two-minute limit for any temporary increase in policy logging.

3. Open System > Settings to inspect time zone, clock and NTP configuration. Compare time with your client and, if present, the remote collector. Use the read-only NTP status command below. Record discrepancies without changing the live clock.

```text
get system status
get system performance status
diagnose sys ntp status
```

Expected result: timestamps can be correlated across systems. NTP provides a common time basis; a configured NTP server alone does not prove successful synchronization. A wrong display time zone can also make a correct event look missing.

| Baseline item | Your value |
| --- | --- |
| Client IPv4 and adapter | <!-- Fill in --> |
| FortiOS and VDOM | <!-- Fill in --> |
| Local time and UTC offset | <!-- Fill in --> |
| NTP synchronized and server | <!-- Fill in --> |
| CPU and memory | <!-- Fill in --> |
| Backup filename | <!-- Fill in --> |

Version rule: use ? to inspect accepted CLI values. If an option is absent, record that limitation and use the available GUI equivalent. Do not enable disk logging on a diskless model, overwrite an existing collector, clear logs, change retention, or enable broad debugging for this lab.

## Map the logging pipeline

4. Open Log & Report > Log Settings and record enabled destinations: local memory, local disk, FortiGate Cloud, FortiAnalyzer or syslog. Identify the source currently selected in the log viewer; it may differ from the enabled destination you intended to inspect.

5. Record available retention/usage information and filtering thresholds without editing them. Memory logs are volatile and limited; disk and remote destinations have their own capacity and retention behavior. Local logging does not universally require a disk. [1]

6. Open Log & Report > Forward Traffic and System Events (or Events > System Events). Select the correct source and VDOM and a time range that includes your current session. Locate one existing record in each category if available.

If no destination is enabled, inspect whether local memory logging is supported. Record the original status and filter, then temporarily enable Memory logging in Log Settings if offered. If unavailable in the GUI, inspect `show log memory setting` and `show log memory filter`; use the block below only when that configuration exists. Do not change severity filters globally just to make the lab work.

```text
config log memory setting
    set status enable
end
```

If memory is unavailable and you have no working local or remote destination, complete the inspection and paper exercises and record the hands-on logging section as blocked pending a supported destination. Do not configure a fake collector or start a paid service.

### Classify what you find

| Type | Meaning | Example to seek |
| --- | --- | --- |
| Traffic | A flow to, from or through FortiGate | Client HTTPS session |
| Event | System or administrative activity | Administrator login |
| Security or UTM | Security inspection result | Existing web-filter event |

A missing security menu or empty security view does not prove the firewall failed. An applicable profile, a log-producing inspection event, logging settings and a searchable destination all matter. Normal HTTPS browsing does not guarantee a security event.

Write your actual chain: event or flow → logging setting/filter → destination → viewer/source/time range. Where could a record disappear?

<!-- Your response: explain your reasoning and cite your observations. -->

## Generate an administrative event

7. Note the current time. In a separate private browser window, successfully log in to the existing administrator account through your normal LAN HTTPS address, then log out that extra session. Keep the original session open. Do not generate failed logins against the main account.

8. In System Events, select the correct source and a narrow time window around the test. Filter by the administrator username or login action available on your release. Open the detailed/raw view and locate the login and logout if both are recorded.

9. Record timestamp/time zone, type, subtype, level, action, user, source address and message where present. Explain why this is a system event rather than a forward-traffic log. If event filtering suppresses it, record that evidence rather than changing every destination filter.

10. Optional configuration event: create an unused IPv4 address object named NSE4_LAB_LOG_MARKER with 192.0.2.123/32 under Policy & Objects > Addresses. Do not attach it to anything. Delete it immediately, then search system events for its name and your username. If detailed configuration auditing is not already enabled, the name/details may be absent; record the limitation without enabling verbose auditing.

### Read severity correctly

Lower numeric severity means greater urgency. The standard syslog scale has eight levels: 0 emergency, 1 alert, 2 critical, 3 error, 4 warning, 5 notice/notification, 6 informational and 7 debug. Available FortiOS labels can vary. Include debug when reasoning about the full syslog scale. Severity is not the same as log type or firewall action.

Record one real event and explain each field in your own words. Which field identifies the actor, and which describes the outcome?

<!-- Your response: explain your reasoning and cite your observations. -->

Would a threshold of warning include informational events? Predict the result before inspecting the configured threshold.

<!-- Your response: explain your reasoning and cite your observations. -->

### Evidence to retain

Save the raw event or its detail screenshot, the test time, selected destination and your explanation. Never include credentials or session cookies in evidence.

## Correlate one client connection

11. On the Windows test client, run the request below and note the time. The command reports the remote IPv4 address and HTTP status so you can search for the actual destination. If this site is unavailable, choose one harmless site already reachable and record the replacement.

```text
curl.exe -4 -I --max-time 10 -w "remote=%{remote_ip}\n" https://example.com
```

12. In Forward Traffic, filter by client source IP, destination IP and time. Allow time for session-end logging and the configured remote-upload interval, then refresh. A remote destination may take longer than two minutes; keep any temporary increase in policy logging within its separate two-minute limit. Open the detailed/raw view of a matching record. A completed request may not appear immediately.

13. Record policyid, source/destination IP and ports, protocol, action, duration, bytes and sessionid where present. Record NAT fields if shown. Find the corresponding policy in Policy & Objects > Firewall Policy by ID; policy ID is not its displayed row position. Use Show matching logs if available.

14. Inspect that policy’s logging setting without changing its action, NAT, security profiles, interfaces, sources or destinations. Security Events logging can omit ordinary allowed flows; All Sessions is intended to record those flows.

If this flow is not logged: first check source, VDOM, time window, destination filters and session completion. If the identified policy lacks All Sessions logging, record its exact original logtraffic value. During a quiet period, temporarily select All Sessions on that one policy for at most two minutes, send one new request, then restore the original value immediately. This can log other traffic matching that policy; skip the change if the policy is busy or you cannot confidently identify it.

Do not enable session-start logging, clear active sessions, disable offloading or clone/reorder household policies for this exercise. After a temporary logging change, compare CPU/memory and recheck browsing. If CPU/memory rise markedly, revert immediately and stop traffic generation.

### Explain the result

What policy handled the request? Which fields support your conclusion, and what does action actually tell you?

<!-- Your response: explain your reasoning and cite your observations. -->

Why does an allow/accept traffic log alone not prove the web application returned a successful page? Compare it with the curl result.

<!-- Your response: explain your reasoning and cite your observations. -->

A ping or web request launched on the FortiGate itself is local-out traffic. Use the client for this exercise so the request traverses a forwarding policy.

## Search in the CLI and diagnose missing evidence

15. Use the help commands below to select the supported device and category values. Choose the same destination used in the GUI. The example uses memory and traffic; replace them with the values shown by your release. [2]

```text
execute log filter reset
execute log filter device ?
execute log filter category ?
```

```text
execute log filter device memory
execute log filter category traffic
execute log filter field srcip <CLIENT_IP>
execute log display
```

Substitute the actual IPv4 address for `<CLIENT_IP>`. Some releases use numeric selectors; choose those shown by ?. This changes the search, not what FortiGate records. Do not assume GUI and CLI results use the same destination by default.

16. Deliberately change only the search source-IP filter to 192.0.2.123, a documentation address not used by your client. Run `execute log display`. Predict the empty result. Reset the search, reselect device/category and restore the real client filter; confirm your known record reappears.

17. Finish with `execute log filter reset`. Record which filter caused the missing result and how you proved that traffic/log generation had not failed.

### Troubleshoot in this order

| Observation | Next check |
| --- | --- |
| No records at all | Correct source, VDOM and time range; enabled destination |
| Events exist but client traffic does not | Actual forwarding policy and All Sessions setting |
| Only new traffic is missing | Session completion and remote-upload interval |
| CLI and GUI disagree | Same destination, category, VDOM and filters |
| Packet seen but no log appears | Log generation, severity filter and destination health |
| No security events | Applicable inspection profile and actual detected event |

### Optional bounded packet observation

If you already use a remote collector, inspect its actual configured IP and transport without editing it. Capture only that host, generate one login event and stop after 20 seconds even if fewer than 20 packets arrive. UDP packets do not prove storage; TCP acknowledgments do not prove indexing.

```text
diagnose sniffer packet any "host <COLLECTOR_IP>" 4 20 l
```

Replace the placeholder; Ctrl+C stops the capture. Do not assume all FortiAnalyzer/syslog setups use the same default transport. Compare observed ports with your configured reliable/encryption settings.

## FortiAnalyzer study and final reflection

If you already have an authorized FortiAnalyzer, inspect Device Manager for device/log status and Log View for the same event time and device. Compare real-time and historical views. Do not replace an existing FortiAnalyzer destination or change its operating mode. If you do not have one, complete this paper scenario.

### Paper scenario

A branch FortiGate sends logs to a collector-mode FortiAnalyzer, which forwards them to an analyzer-mode FortiAnalyzer. Transport packets arrive, but an administrator cannot find a five-minute-old event in the analyzer’s historical view.

List three checks that distinguish device authorization, forwarding/delivery and searchable analytics. Where would you expect raw archives versus indexed records?

<!-- Your response: explain your reasoning and cite your observations. -->

Self-check after answering: verify the device is authorized; inspect collector forwarding and analyzer receipt; check device/time filters and analytics/indexing/retention. Collector mode focuses on collection, archiving and forwarding; analyzer mode provides analytics. Receiving raw logs and making them searchable are different stages. Verify FortiAnalyzer commands and defaults against the installed release before use.

### Cleanup and completion

- [ ] Remove NSE4_LAB_LOG_MARKER if created
- [ ] Restore the exact original policy logging value if changed
- [ ] Restore memory logging status only if changed for this lab
- [ ] Reset CLI/GUI search filters and stop captures
- [ ] Verify household browsing and compare CPU/memory with baseline
- [ ] Retain one event, one traffic record or documented blocker, and the filter experiment

What did you initially infer from an empty log view? What evidence changed your conclusion?

<!-- Your response: explain your reasoning and cite your observations. -->

Date, elapsed time, skipped sections and the next skill you want to practice

<!-- Your response: explain your reasoning and cite your observations. -->

### Sources and version notes

Record the model, build and available licenses before starting. These procedures prioritize existing destinations; FortiAnalyzer deployment and active UTM-block testing are deferred to an isolated lab. Consult the documentation version matching your installed release.

[1]: https://docs.fortinet.com/document/fortigate/8.0.0/administration-guide/250999/log-settings-and-targets

Source 1: [Fortinet — Log settings and targets](https://docs.fortinet.com/document/fortigate/8.0.0/administration-guide/250999/log-settings-and-targets)

[2]: https://docs.fortinet.com/document/fortigate/7.0.0/administration-guide/668197/log-related-diagnose-commands

Source 2: [Fortinet — Log-related diagnose commands](https://docs.fortinet.com/document/fortigate/7.0.0/administration-guide/668197/log-related-diagnose-commands)

## Lab writeup

### Environment and topology

<!-- Describe the devices, interfaces, subnets and traffic path relevant to this attempt. Use sanitized addresses consistently. Add a diagram if it helps explain the test. -->

### Results by exercise

Duplicate a row for each exercise completed. Record skipped exercises and why they were skipped; do not report an expected result as an observed result.

| Exercise | Expected result | Actual result | Evidence | Status |
| --- | --- | --- | --- | --- |
| <!-- Exercise name --> | <!-- Prediction --> | <!-- What happened --> | <!-- Screenshot or output reference --> | <!-- Pass / Fail / Skipped --> |

### Evidence

<!-- Repeat this block for each useful observation. Explain what the evidence demonstrates and what it cannot prove. -->

**Exercise:** <!-- Name or step -->

**Command or GUI action:** <!-- What you ran or opened -->

**Observed output:**

```text
Replace this line with sanitized output, or remove this block if using a screenshot.
```

<!-- Screenshot example: ![Description of the observed result](./images/lab-result.png)
     Uncomment only after adding the image at the corresponding path. -->

**Interpretation:** <!-- Explain the result in your own words. -->

### Troubleshooting

<!-- For each issue, describe the symptom, initial hypothesis, evidence gathered, change made and verification. Include incorrect hypotheses when they explain what you learned. -->

### Changes and cleanup

| Setting or object | Before | Temporary change | Restored state and verification |
| --- | --- | --- | --- |
| <!-- Exact setting or object --> | <!-- Original value --> | <!-- Lab value --> | <!-- Evidence cleanup succeeded --> |

### What I learned

<!-- Answer the reflection prompts in the manual and summarize the most useful lesson here. Explain why the observed behavior occurs. -->

### Next experiment

<!-- Name one focused follow-up question and how you would test it safely. -->

### Before publishing

- [ ] Replace all response placeholders or remove unused sections.
- [ ] Distinguish observed results from predictions and untested sections.
- [ ] Record the exact model and software version used.
- [ ] Remove credentials, tokens, session cookies and configuration backups.
- [ ] Review hostnames, usernames, serial numbers, public IPs and other identifying details before sharing.
- [ ] Confirm screenshots and local links render correctly.
- [ ] Document cleanup and any changes deliberately retained.
- [ ] Link back to the blank template so readers can repeat the lab.
