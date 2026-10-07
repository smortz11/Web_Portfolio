---
title: "9. Web Filtering"
slug: "9_Web_Filtering_Notes"
description: "NSE4 study notes: Web Filtering"
date: "2026-10-07"
folder: "Notes"
tags: ["Fortinet", "NSE4", "Notes"]
---

### When Does Web Filtering Activate with Initial Unencrypted HTTP Traffic
1. DNS request
2. DNS Response
3. SYN
4. SYN/ACK
5. ACK
6. HTTP GET `<url>` (web filter enters here)

### SSL Certificate Inspection
1. Client Hello (Version, cipher suite, SNI, etc.) -------->
2. Server Hello (Version, certificate, and so on) <--------
3. <-------------
4. Server Hello Done <-----------

- Uses the server name identification (SNI) extension from the Client Hello
- If SNI is not present, FortiGate uses the CN field in the server certificate to obtain the FQDN

### Web Filtering Inspection Modes
- Flow-based inspection
	- Default inspection mode
	- Requires fewer processing resources
	- Faster scanning

- Proxy-based inspection
	- More thorough inspection
	- Provides additional options
	- More resource intensive

- Firewall policy must include an SSL inspection profile and a web filter profile

### Configure SSL Certificate Inspection
- Security Profiles -> SSL/SSH Inspection -> Create new profile -> Select `Multiple Clients connecting to Multiple Server`, SSL certificate inspection as inspect method, and SNI check enable.
	- If disable, always rate URLs based on FQDN

### Configure Web Filter Profiles - Flow Based
- Apply web filter profile to a flow-based firewall policy
	- Security Profiles -> Web Filter
- Select Flow-based
- Enable FortiGuard Category Based Filter and configure for each category
- Enable Safe Search if needed
- Enable and configure Static URL filter if needed
- Enable and configure Rating Options if needed

### Configure Web Filter Profiles - Proxy Based
- Apply a web filter to a proxy-based firewall policy
- Supported on only FortiGate models with more than 2GB RAM
	- A red P in the GUI denotes a proxy-only feature

### FortiGuard Category Filter
- Websites split into multiple categories
- Live connection to FortiGuard with active contract required
- Can use FortiManager instead of FortiGuard
- Security Profiles -> Web Filter
	- FortiGuard Category Based Filter
		- Allow, monitor, block, warning, authenticate

### Web Filter FortiGuard Category Action - Allow or Block
- Allow or block access to web sites
- Security Profiles -> Web Filter

### Web Filter FortiGuard Category Action - Monitor
- Monitor action allows and logs web site accesses

### Web Filter FortiGuard Category Action - Warning
- Informs the user before proceeding
- Displays a customizable warning message

### Web Filter FortiGuard Category Action - Authenticate
- To configure the authenticate action:
	- Define users and a group
	- Set action to Authenticate
	- Select a user group
- User credentials requested in message

### Web Filter FortiGuard Category Action - Quotas
- Applies to Monitor, Warning, and Authenticate actions
- Quotas available only in proxy-based mode
- Security Profiles -> Web Filter
	- Can set time or traffic quotas

### Web Rating Override
- Changes a website category, not the category action
- Security Profiles -> Web Rating Overrides

### Configure a URL Filter
- Check against configured URLs in URL filter from top to bottom
- Security Profiles -> Web Filter
	- Simple, Regular Expression, or Wildcard
	- Exempt, Block, Allow, or Monitor

### HTTPS Inspection Order
![Study diagram](/knowledge-assets/NSE4/9.%20Web%20Filtering%20-%2001.png)

1. Static URL Filter
2. FortiGuard Category Filter
3. Advanced Filters
4. Display Page

### Troubleshooting the FortiGuard Connection
- FortiGuard category filtering requires a live connection

```
diagnose debug rating
```
shows FortiGuard servers and connections

- Change default FortiGuard or FortiManager communications from HTTPS port 443:
	- Disable FortiGuard anycast setting on CLI to use UDP ports 443, 53, 8888

```
config system fortiguard
	set fortiguard-anycast { enable | disable }
	set protocol { udp | https }
	set port { 8888 | 53 | 443 }
end
```

- Enable **Web Filter cache** to reduce requests to FortiGuard
	- Default clear cache time is 60 minutes

### Troubleshooting Web Filtering Issues
- Web filtering not working even with a valid FortiGuard live connection?

- Verify web filter profile is applied to rule
- Make sure certificate inspection is enabled for encrypted protocols
- Compare inspection mode setting with feature set in the web filter profile

### Web Filter Log
- Record HTTP traffic activity including action, profile used, category, URL, and quota info
	- Log & Report -> Security Events -> Web Filter
