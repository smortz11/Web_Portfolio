---
title: "16. FortiSASE"
slug: "16_FortiSASE_Notes"
description: "NSE4 study notes: FortiSASE"
date: "2026-10-07"
folder: "Notes"
tags: ["Fortinet", "NSE4", "Notes"]
---

### Challenges of Work-Form-Anywhere
- Direct internet access is not secure
- Low visibility and control for data
- Use experience challenges
- Implicit access to all applications

### SASE Workflow
- Provides remote workers secure access
- Secures hybrid work by combining networking capabilities with cloud
- Main goals are:
	- Achieve secure internet access
	- Reduce latency by having endpoints connect to closes point-of-presence (POP)
	- Meet traffic demands of offnet endpoints
	- Reduce congestion by distributing endpoint traffic
	- Enforce zero trust to protect networks for off net endpoints

### A Solution to Simplify and Enable Secure Access
- Zero-Trust security posture
- SASE = SD-WAN plus SSE (SWG/firewall, ZTNA, and CASB)
- Outcome is end-to-end digital experience with secure access

### Fortinet Unified SASE
- The unified SASE solution includes FortiSASE SSE solution with secure SD-WAN

### Fortinet SASE Solution
- FortiSASE provides secure access to remote users for the folliwng use cases:
	- Secure internet access (SIA)
	- Secure private access (SPA)
	- Secure SaaS access (SSA)
- Supports FWaaS
	- Same features as FortiGate NGFW
- Supports SWG
	- Uses FortiOS explicit web proxy, captive portal, and authentication features
- Supports ZTNA
	- Provides secure, identity-based access with explicit control
- CASB and DLP
	- Supports both data at rest and in motion
- FortiGate SD-WAN Integration
	- FortiSASE security POPs act as spokes to the FortiGate hub
- DEM
	- Monitor and troubleshoot user-to-SaaS application performance issues
- RBI
	- Protect against web-based threats for end users

### SIA (Secure Internet Access)
- SIA extends an organization's security perimeter
- SIA enforces common security policies for the following:
	- Intrusion prevention systems (IPS)
	- Application control
	- Web and DNS filtering
	- Antimalware
	- Sandboxing
	- Antibotnet/C&C
- For remote users, thin edge, and branch locations

### SIA - Agent-Based Use Case
- Most typical use case
- Install FortiClient on managed endpoints
	- Lightweight agent
	- EPP functionality
- FortiSASE FWaaS is located between the FortiClient endpoint and the internet
- FortiClient connects to FortiSASE using a VPN tunnel
- VPN policies on FortiSASE secure all internet traffic
- User-based licensing is required

### SIA - Agentless Use Case
- Usually for unmanaged endpoints
- PAC file is distributed to users
- SWG service for agentless inline inspection
- Full security stack (antivirus, web filtering, application control, etc.)
- Shared security profiles for consistent protection

### Site-based Remote User Internet Access
- Usually for microbranch offices
- Requires configuring FortiExtender or FortiGate as a LAN extension
- FortiExtender or FortiGate is responsible for centralizing site connectivity to the FortiSASE FWaaS
- FortiExtender, FortiBranchSASE, or FortiGate establishes a secure VXLAN-over-IPsec with FortiSASE

### User Onboarding with SAML SSO
- FortiSASE is the service provider
- Products such as FortiAuthenticator, Okta, Entra ID, and so on can act as identity providers

### SPA
- With ZTNA and SD-WAN integration

### SPA with SD-WAN Integration
- SD-WAN integration with existing SD-WAN hub from any SASE POP
- Fast access to applications using SD-WAN from SASE POP to SD-WAN hub
- Broader application support (UDP-based VoIP, video, unified communications)

### CASB Use Case
- FortiSASE uses its application control and SSL deep inspection to control SaaS cloud application traffic
- FortiSASE uses web filtering and SSL inspection with an inline security component to customize HTTP headers
- FortiSASE uses DLP to keep sensitive data safe from leaking to untrusted networks or people
- Shadow IT report
	- Usage of SaaS applications
	- Sanctioned and unsanctioned applications
- Supports integration with FortiCASB
