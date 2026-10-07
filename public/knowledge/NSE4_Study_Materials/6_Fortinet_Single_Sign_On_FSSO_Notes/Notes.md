---
title: "6. Fortinet Single Sign-On (FSSO)"
slug: "6_Fortinet_Single_Sign_On_FSSO_Notes"
description: "NSE4 study notes: Fortinet Single Sign-On (FSSO)"
date: "2026-10-07"
folder: "Notes"
tags: ["Fortinet", "NSE4", "Notes"]
---

### SSO and FSSO
- SSO is a process that allows identified users access to multiple applications without having to reauthenticate
- Users who are already identified can access applications without being prompted to provide credentials
	- FSSO software identifies a user's user ID, IP address, and group membership
	- FortiGate allows access based on membership in FSSO groups configured on FortiGate
	- FSSO groups can be mapped to individual users, user groups, organizational units (OUs), or a combination
- FSSO is typically used with directory services, such as Windows Active Directory or Novell eDirectory

### FSSO Deployment and Configuration
**Microsoft Active Directory (AD)
- Domain controller (DC) agent mode
- Polling mode:
	- Collector agent-based
	- Agentless
- Terminal server (TS) agent
	- Enhances login capabilities of a collector agent or FortiAuthenticator
	- Gathers logins for Citrix and terminal server where multiple users share the same IP address

**Novell eDirectory
- eDirectory agent mode
- Uses Novell API or LDAP setting

### DC Agent Mode
- DC agent mode is the most scalable mode and is, in most environments, the recommended mode for FSSO
- Requires one DC agent (dcagent.dll) installed on each Windows DC in the `Windows\system32` directory. The DC agent is responsible for:
	- Monitoring user login events and forwarding them to the collector agents
	- Handling DNS lookups (by default)

- Requires one or more collector agents installed on Windows servers. The collector agent is responsible for:
	- Group verification
	- Workstation checks
	- Updates of login records on FortiGate
	- Sending domain local security group, organizational units (OUs), and global security group information to FortiGate

### DC Agent Mode Process
1. The user authenticates against the Windows DC
2. The DC agent sees the login event and forwards it to the collector agent
3. The collector agent receives the event from the DC agent and forwards it to FortiGate
4. FortiGate knows the user based on their IP address, so the user does not need to authenticate

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2001.png)

### Collector Agent-Based Polling Mode
- A collector agent must be installed on a Windows server
	- No FSSO DC agent is required
- Every few seconds, the collector agent polls each DC for user login events. The collector agent uses:
	- SMB (TCP/445) protocol, by default, to request the event logs
	- TCP/135, TCP/139, and UDP/137 as fallbacks
- This mode requires a less complex installation, which reduces ongoing maintenance
- Three methods:
	- NetAPI
	- WinSecLog
	- WMI
- Event logging must be enabled on the DCs (except in NetAPI)

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2002.png)

### Collector Agent-Based Polling Mode Process
1. The user authenticates with the DC
2. The collector agent frequently polls the DCs to collect user login events
3. The collector agent forwards logins to FortiGate
4. The user does not need to authenticate

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2003.png)

### Agentless Polling Mode
- Similar to agent-based polling, but FortiGate polls instead
- Doesn't require an external DC agent or collector agent
	- FortiGate collects the data directly
- Event logging must be enabled on the DCs
- More CPU and RAM required by FortiGate
- Support for polling option WinSecLog only
	- FortiGate uses the SMB protocol to read the event viewer logs
- Fewer available features than collector agent-based polling mode
- FortiGate doesn't poll workstation
	- Workstation verification is not available in agentless polling mode

### Agentless Polling Mode Process
1. The user authenticates with the DC
2. FortiGate frequently polls DCs to collect user login events
	1. FortiGate discovers the login event
3. The user does not need to authenticate
	1. FortiGate already knows whose traffic it is receiving

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2004.png)

### Comparing Modes
![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2005.png)

### Additional FSSO AD Requirements
- The DNS server must be able to resolve all workstation names
	- Microsoft login events contain workstation names, but not IP addresses
	- The collector agent uses a DNS server to resolve the workstation name to an IP address

- For full feature functionality, the collector agent must be able to poll workstations
	- This insforms the collector agents whether or not the user is still logged in
	- TCP ports 445 (default) and 139 (backup) must be open between collector agents or FortiGate an all hosts
	- Collector agent uses Windows Management Instrumentation (WMI) to verify whether a user is still logged in on remote workstations

### FSSO Configuration - Agentless Polling Mode
- Agentless polling mode:
	- FortiGate uses LDAP to query AD

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2006.png)

### FSSO Configuration - Collector Agent-Based Polling or DC Agent Mode
- Collector agent-based polling or DC agent mode:
	- The FSSO agent can monitor users' login information from AD, Exchange, Terminal, Citrix, and eDirectory servers

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2007.png)

### FSSO Agent Installation
1. Visit the Fortinet support website:
	- https://support.fortinet.com
2. Click Support -> Firmware Download
	- Available agents:
		- DC agent: DCAgent_Setup
		- CA for Microsoft servers: FSSO_Setup
		- CA for Novell: FSSO_Setup_edirectory
		- TS Agent: TSAgent_Setup
3. Select FortiGate, then click Download
4. Click v7.00 -> 7.6 -> 7.6.0 -> FSSO

### FSSO Collector Agent Installation Process
1. Run the installation process as Administrator
2. Enter the username in the following format:
	- DomainName\UserName
3. Configure the collector agent for:
	1. Monitoring logins
	2. NTLM authentication
	3. Directory access
4. Optionally, launch the DC agent installation wizard before exiting the collector agent installation wizard

### DC Agent Installation Process
1. IP and port for collector agent
2. Domains to monitor
3. Remove users
4. Select domain controllers to install the DC agent
	1. DC Agent Mode - to install DC agent on selected DC
	2. Polling Mode - DC agent will not be installed

### FSSO Collector Agent Configuration

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2008.png)


### Group Filter
- The FSSO collector agent manages FortiGate group filters
- FortiGate group filters controls which user's login information is sent to that FortiGate device
	- Filters are tied to the FortiGate serial number
- You can set filters for groups, OUs, users, or a combination

### Ignored User List
- The collector agent ignores any login events that match the **Ignore User List** entries
	- Example: network service accounts
- User logins are not reported to FortiGate
- This helps to ensure users get the correct policies and profiles on FortiGate

To add users to the ignore list:
1. Manual entry
2. **Add Users**: Select users you do not want to monitor
3. **Add by OU** Select an OU from the directory tree

### Collector Agent Timers
**Workstation verify interval
- Verifies if a user is still logged on
- Uses remote registry service to verify
- Default: 5 minutes
- Disable: Set value to 0

**Dead entry timeout interval
- Applied to unverified entries only
- Used to purge login information
- Default: 480 minutes (8 hours)
- Disable: set value to 0
	- Under the workstation verify interval

**IP address change verify interval
- Important on DHCP or dynamic environments
- Default - 60 seconds

**Cache user group lookup result
- Collector agent remembers user group membership

### AD Access Mode Configuration
- Standard access mode
	- Windows convention:
		- Domain\groups
	- Firewall policy authentication can apply to AD groups only (no individual users)
		- Nested group is not supported
	- Group filters at collector agent

- Advanced access mode
	- LDAP convention usernames:
		- CN=User,OU=Name,DC=Domain
	- Firewall policy authentication can apply to AD users, groups, and OUs
		- Supports nested or inherited groups
	- Group filtering:
		- FortiGate as an LDAP client, or group filter on collector agent
		- Filter groups defined on FortiGate

### FortiGate FSSO Group Object Configuration
- User & Authentication -> User Groups -> Create new -> Fortinet Single Sign-On (FSSO)

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2009.png)

### AD Group Support
Group type supported:
- Security groups
- Universal groups
- Groups inside OUs
- Local or universal groups that contain universal groups from child domains (only with Global Catalog)

If the user is not part of an FSSO group:
- For passive FSSO authentication:
	- User is part of SSO_Guest_Users
- For passive and active FSSO authentication
	- User is prompted to login

### Advanced Settings
- Citrix / Terminal Server
	- Terminal server (TS) agent mode: monitors user logins in real time
	- Requires a collector agent
		- No polling from FortiGate

- RADIUS accounting
	- Notify the firewall upon login and logout events

- Syslog servers
	- Notify the firewall upon login and logout events

### Troubleshooting Tips for FSSO
- Ensure all firewalls allow the ports that FSSO requires
- Guarantee at least 64kbps bandwidth for each domain controller
- Configure the timeout timer to flush inactive sessions after a shorter time
- Ensure DNS is configured and updating IP addresses if the host IP address changes
- Never set the timer workstation verify interval to 0
- Include all FSSO groups in the firewall policies when using passive authentication

### FSSO Log Messages on FortiGate
- FSSO logs are generated from authentication events, such as user login and logout events and NTLM authentication events
	- To log all events, set the minimum log level to Notification or Information
- Log & Report -> System Events -> User Events

### Log Messages on FSSO Collector Agent

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2010.png)

### Currently Logged-In Users
- Dashboard -> Assets & Identities -> Firewall Users

or

```
diagnose debug authd fsso list
```


### Connection to FortiGate
- Check connectivity between collector agent and FortiGate

```
diagnose debug authd fsso server-status
```

### Additional Commands

```
diagnose debug authd fsso
	filter
	list
	refresh-groups
	summary
	clear-logons
	refresh-logons
	show-address
	server-status
	
diagnose firewall auth clear
diagnose firewall auth filter
diagnose firewall auth list
diagnose firewall auth mac
diagnose firewall auth ipv6
```

### Polling Mode

```
diagnose debug fsso-polling detail
```

![Study diagram](/knowledge-assets/NSE4/6.%20Fortinet%20Single%20Sign-On%20%28FSSO%29%20-%2011.png)
