# Lab 01 — System and Network Settings

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

**Audit your live router and build an isolated DHCP segment**

Goal: explain how your FortiGate provides routing, DHCP and administrative access, then practice a reversible configuration change. The core lab uses the current LAN. An optional extension uses a genuinely unused physical port and a separate client.

Time: 60–90 minutes for the core lab; 30–45 minutes for the extension. Complete Lab 02 afterward. You do not need an active FortiGuard subscription for the core exercises.

### Before you begin

1. Work locally from a trusted LAN device. Keep your current administrator session open. Record the model, exact FortiOS version and active VDOM using `get system status`. If VDOMs are enabled, inspect the VDOM carrying your live network traffic; do not enable VDOMs for this lab.

2. Download an encrypted configuration backup from the administrator menu under Configuration > Backup, or the equivalent menu on your release. Store its password separately. Record the backup filename and time. A configuration restore is an outage recovery action, not routine lab cleanup.

3. Record a baseline: open a normal website, resolve its name, and ping your LAN gateway. Verify another household device still has connectivity. Know how you would reach the local console if management access failed.

Scope: do not factory-reset, reboot, upgrade firmware, switch NAT/transparent mode, change WAN settings, alter the production default route, remove switch members, or change the main administrator account. If a step does not match your release, inspect CLI help with ? and stop that step rather than guessing.

| Record before starting | Your value |
| --- | --- |
| Model and FortiOS build | <!-- Fill in --> |
| VDOM and operating mode | <!-- Fill in --> |
| Management IP and interface | <!-- Fill in --> |
| Client IPv4 address and subnet | <!-- Fill in --> |
| Backup filename and time | <!-- Fill in --> |

Evidence handling: keep backups and credentials private. In screenshots or notes shared for review, redact passwords, tokens, public IPs and device serial numbers as appropriate.

## Inspect addressing and the route out

4. On your Windows client, run the commands below. Record the DHCP server, DNS servers, default gateway, adapter name and lease times. Do not assume FortiGate supplies DNS just because it supplies the gateway.

```text
ipconfig /all
route print -4
arp -a
nslookup example.com
```

5. Open Network > Interfaces. Locate your management LAN and WAN. Record each interface’s real name, alias, role, IP/mask and addressing mode. If the LAN is a hardware/software switch, record its members without editing them.

6. Open the LAN interface’s DHCP settings without saving. Record its pool, lease duration, gateway and DNS options. Compare these with the client lease. If DHCP is on another device, document that instead of enabling a second server.

7. Inspect the active routing table in the routing monitor/dashboard and compare it with Network > Static Routes. Use the CLI below as a cross-check. Identify the active default route, next hop and egress interface; note whether it was configured statically or learned from WAN DHCP/PPPoE.

```text
get system status
get router info routing-table all
get system arp
show system dns
```

Expected result: the client’s gateway belongs to its local subnet; the FortiGate has a usable route toward the internet. A DHCP-learned default route may be active without appearing as a manually configured static route. With SD-WAN, record the zone and actual member path separately.

### Explain the packet path

For a DNS server on your local subnet, whose MAC does your client need? For an internet destination, whose MAC does it need? Use your actual addresses.

<!-- Your response: explain your reasoning and cite your observations. -->

Describe the difference between the FortiGate’s own DNS settings and the DNS server addresses given to clients through DHCP.

<!-- Your response: explain your reasoning and cite your observations. -->

### Evidence to retain

Save the client lease summary, LAN/WAN interface screenshots and active default-route entry. Sketch or write the path: client → LAN gateway → WAN next hop. Include where DNS resolution occurs.

## Practice restricted administrator access

This exercise creates a temporary read-only account. It tests authorization and trusted sources without editing the account you depend on.

8. In System > Admin Profiles, create NSE4_LAB_RO with read-only access to system/network/log information and no write permissions. If your release offers a suitable built-in read-only profile, inspect and use it instead. Do not select super_admin or a read-write profile.

9. In System > Administrators, create a local account named nse4_lab_observer. Use a unique strong password and the read-only profile. Restrict its IPv4 trusted hosts to the exact management client address with mask 255.255.255.255. Confirm any other entries do not leave this test account unrestricted. Do not enable new interface management protocols.

10. In a separate private browser window, sign in as the observer through the existing LAN HTTPS address. Verify that you can inspect an allowed page, but editing controls are unavailable. Do not attempt a write to a production object merely to test the restriction.

11. Optional: from another trusted LAN device with a different source IP, attempt one login as the observer. Expect this account to be rejected. The login page may still load because other administrator accounts have different trusted-host settings. Do not repeat failures or alter your client IP to force this test.

12. Log out the observer. Return to the original administrator session and delete nse4_lab_observer. Delete NSE4_LAB_RO only if you created it and nothing else references it.

Expected result: the observer can view permitted information from the allowed source, cannot make changes, and is gone after cleanup. If the first login fails, check the actual source address seen by FortiGate, the profile, VDOM scope and password from your original session; do not loosen your main account’s controls.

### Inspect the other management controls

Read the LAN and WAN administrative-access options, HTTPS/SSH ports, idle timeout and password policy. Record improvements you might make later, but do not apply them in this lab. Interface allowaccess determines which services are exposed; the administrator profile determines what an authenticated account can do. Trusted hosts constrain eligible source addresses. [1]

Why can an HTTPS login page be reachable while this particular account is denied? Why is an interface alias not a security boundary?

<!-- Your response: explain your reasoning and cite your observations. -->

## Inspect services and session behavior

13. Open System > FortiGuard, or the equivalent license dashboard. Record subscription states and database dates. Run `diagnose autoupdate versions` to compare installed engine/database versions with the GUI. Do not force updates or start a trial.

```text
diagnose autoupdate versions
get system performance status
```

14. From your client, make one short web request: `curl.exe -I --max-time 10 https://example.com`. A returned HTTP response is sufficient; a redirect is still a response. Record the time and resolved address. If it fails, use a normal site already reachable from your network.

15. In the FortiView sessions view or session monitor available on your release, filter to your client IP and the request’s destination. Observe source/destination ports, matching policy and translated source if shown. Short sessions may disappear quickly; repeat the single request once if needed.

Prediction: the first packets must establish session state. Subsequent matching packets can use that state, with inspection and hardware acceleration depending on configuration. Replies normally use the existing session; they do not require a new reverse-direction allow policy. Record observations rather than assuming every internal packet-processing stage is visible.

### Concept checks

NAT operating mode means FortiGate routes at Layer 3; it does not mean every policy performs source NAT. Transparent mode still needs management addressing. A physical switch member can carry frames without its own Layer 3 IP. Interface role adjusts available GUI settings; it does not itself permit or deny traffic. Factory defaults vary by model and release and are reference material, not settings to apply to this live router.

What evidence distinguishes an installed signature database from a currently valid update entitlement?

<!-- Your response: explain your reasoning and cite your observations. -->

What source IP should an internet server see for your request, and where does that translation happen in your setup?

<!-- Your response: explain your reasoning and cite your observations. -->

### Core completion check

- [ ] Backup recorded
- [ ] DHCP and DNS compared
- [ ] Default route explained
- [ ] Read-only account tested and removed
- [ ] Licenses inspected
- [ ] Client and second household device still work

If no suitable spare port is available, skip the optional DHCP section and complete the reflection section. This is a valid core-lab completion.

## Optional isolated DHCP exercise

Prerequisites: an unused standalone physical port, one test client with an Ethernet adapter, and your original management device remaining on the normal LAN. A down port is not proof that it is unused. Skip if it is a switch member, FortiLink port, SD-WAN member, zone member, or referenced by any existing configuration. Do not detach a port to make it available.

16. Check the candidate port’s references in Network > Interfaces and record every current setting. Choose an unused private subnet that does not overlap LAN, VPN, routes or other interfaces. The example is 10.254.240.0/24; replace it if already used.

17. Edit only that port: alias NSE4_LAB, role LAN, manual address 10.254.240.1/24 and administrative access PING only. Enable its DHCP server with range 10.254.240.100–10.254.240.110, gateway 10.254.240.1, lease 3600 seconds and DNS 192.0.2.53. This documentation-only DNS address deliberately provides no working resolver on the isolated segment. Do not add a firewall allow policy or default route. [2]

18. Connect only the test client directly to the lab port. Disable Wi-Fi on that test client and ensure it is not bridging adapters or sharing internet access. Leave the management device connected normally. Set the test adapter to obtain IPv4 and DNS automatically.

19. Run `ipconfig /all` on the test client. If needed, use `ipconfig /renew "Ethernet"` with the exact test adapter name; never release all adapters. Confirm the lease is in the lab pool, with the lab gateway, DNS value and expected lease duration.

20. Ping 10.254.240.1 from the test client. Expect replies. Try one internet request; expect failure because this isolated segment has no intended forwarding permission or working DNS. If internet works, check Wi-Fi/bridging and existing broad policies before proceeding.

21. Inspect the DHCP lease monitor for the test client’s MAC and IP. Optional: capture DHCP on this port with the command below, then renew only the test adapter. Renewals can show REQUEST/ACK without DISCOVER/OFFER because the client already has a lease.

```text
diagnose sniffer packet <LAB_PORT> "port 67 or port 68" 4 20 l
```

Replace `<LAB_PORT>` with the real interface name. Stop with Ctrl+C after 20 seconds if the count has not completed. Do not leave a capture running unattended.

### Cleanup in this order

Disconnect the test cable. Disable and remove only the lab DHCP configuration you created, restore the port’s recorded IP, role, alias, administrative access and status, and verify no lab subnet route remains. Restore the test client’s normal adapter/Wi-Fi settings. Confirm household connectivity again. No full configuration restore is needed.

## Record and reflect

Date, elapsed time, completed sections and anything skipped with its reason

<!-- Your response: explain your reasoning and cite your observations. -->

Most useful evidence and what it proves

<!-- Your response: explain your reasoning and cite your observations. -->

Explain why a correct DHCP lease and successful gateway ping do not prove internet access.

<!-- Your response: explain your reasoning and cite your observations. -->

If DNS fails but an established internet session keeps working, what would you inspect first and why?

<!-- Your response: explain your reasoning and cite your observations. -->

Which change in this lesson had the largest possible impact, and how did you limit its scope?

<!-- Your response: explain your reasoning and cite your observations. -->

### Success criteria

You can explain the actual addressing, DHCP/DNS arrangement and default route; demonstrate read-only administrative access; distinguish subscription state from database state; and show all temporary changes were removed. If you completed the optional extension, include the test lease and DHCP observation.

### Sources and version notes

GUI paths are typical of FortiOS 7.x; use the paths and options supported by your model and build. These are guided procedures, not a script tested against your appliance. Use the documentation version selector for your installed build.

[1]: https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/14906

Source 1: [Fortinet — Administrator account options, FortiOS 7.4.0](https://docs.fortinet.com/document/fortigate/7.4.0/administration-guide/14906)

[2]: https://docs.fortinet.com/document/fortigate/8.0.0/administration-guide/747452/basic-configuration

Source 2: [Fortinet — Basic configuration of DHCP servers](https://docs.fortinet.com/document/fortigate/8.0.0/administration-guide/747452/basic-configuration)

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
