---
title: "2. Logging and Monitoring \u2014 Notes"
slug: "2_Logging_and_Monitoring_Notes"
description: "NSE4 study notes: Logging and Monitoring"
date: "2026-09-18"
tags: ["Fortinet", "NSE4", "Notes"]
---

### Logging Workflow
1. Traffic passes through FortiGate to your network
2. FortiGate scans the traffic and acts based on configured firewall policies
3. FortiGate records the activity and stores the information in a log message
4. FortiGate adds the log message to a log file on a device capable of storing logs (local FortiGate device or an external device, such as FortiAnalyzer)

- Purpose of logs:
	- Monitor network and internet traffic voluem
	- Diagnose problems
	- Establish normal baselines to recognize anomalies and trends

- Note: NTP servers are required / recommended

### Log Types and Subtypes
- Traffic logs record traffic flow information, such as an HTTP/HTTPS request and its response
- Event logs record system and administrative events, such as adding or modifying a setting, or daemon activities
- Security logs record security events, such as virus attacks and intrusion attempts, based on the security profile type (log type = utm)
	- If no security logs exist, the menu item does not appear in the GUI

![Study diagram](/knowledge-assets/NSE4/Pasted%20image%2020260915113814.png)


### Log Severity Levels
- Each log entry includes a log level (also known as priority level) that ranges in order of importance
	- 0 = high importance, 6 = low importance

![Study diagram](/knowledge-assets/NSE4/Pasted%20image%2020260915113930.png)

## Log Message Layout
- Log Header (similar in all logs)
	- Type and subtype = Name of log file
	- Level = severity level

![Study diagram](/knowledge-assets/NSE4/Pasted%20image%2020260915114007.png)

- Log body (varies by log type)
	- policyid = Firewall policy applied to session
	- hostname = URL or IP of host
	- srcip and dstip = Source/Destination IP
	- action = Action taken by FortiGate
	- msg = Reason for the action

![Study diagram](/knowledge-assets/NSE4/Pasted%20image%2020260915114056.png)

### Log Storage - Local
- To store logs locally on FortiGate, you must enable disk logging
	- Log Settings -> Local Logs -> Disk Logging
	- `config log disk setting` then `set status enable`
- If disk logging is enabled, the report daemon collects statistics used for historical FortiView from disk
	- If disk logging is disabled, FortiView logs are only available in real time
- By default, logs older than seven days are deleted from disk (configurable)
	- `config log disk setting` then `set maximum-log-age <integer>`

### Log Storage - Remote
- Various options available for remote logging:
	- FortiAnalyzer
	- FortiSiem
	- Syslog server
	- FortiCloud
	- FortiManager

### FortiAnalyzer Centralized Log Repository
Workflow:
1. Registered devices send logs to FortiAnalyzer
2. FortiAnalyzer buffers, reorganizes, and stores the logs
3. Administrators:
	1. View and search the logs
	2. Configure, request, and view reports (based on log data)


### Storage of Incoming Logs
- FortiAnalyzer stores incoming logs in the following manner:
1. Raw format
	1. for long-term archive purposes
	2. You cannot view them in FortiView or Log View
2. Inserted into the database
	1. FortiAnalyzer inserts logs into the SQL database
	2. You can view the logs and run reports

### FortiAnalyzer Operating Modes - Analyzer
- Dashboard -> System Information (collector or analyzer)
- Central log aggregator for one or more logging devices, or FortiAnalyzer in collector mode
	- Can still forward logs to another FortiAnalyzer (or syslog/CEF server)

### FortiAnalyzer Operating Modes - Collector
- Collects logs from multiple devices and forwards them to FortiAnalyzer in analyzer mode
	- Can aggregate logs into another FortiAnalyzer
	- Can forward to syslog/CEF server in real-time forwarding mode only
- Not used for analytics - archiving only

### Methods of Device Registration
- Two device registration states
	- Registered: authorized to store logs on FortiAnalyzer
	- Unregistered: requesting to store logs on FortiAnalyzer

- Various ways to register a device with FortiAnalyzer:
	- Initiate registration from FortiAnalyzer or from the remote device
	- Stage devices on FortiAnalyzer by prepopulating information

### Request From a Supported Device
1. The FortiGate administrator enables remote logging to FortiAnalyzer
	- Security Fabric -> Fabric Connectors -> Logging & Analytics -> FortiAnalyzer
2. The FortiAnalyzer administrator accepts (or rejects) the registration request
	1. You can assign a new name to the device
	- Device Manager -> Authorize

### Viewing Device Status
- Device Manager displays:
	- All registered devices
	- Log status (up or down)
	- Storage used

### Upload Option
- Near real-time uploading and consistent high-speed compression and analysis
- Configure logging options:
	- `store-and-upload` (CLI configuration only)
	- Real Time
	- Every Minute
	- Every 5 Minutes (default)

```
configure log fortianalyzer setting
set upload-option [store-and-upload |realtime/1-minute/5-minute]
```

Note: `store-and-upload` is only available on FortiGates with an internal hard drive
- By default, if the FortiAnalyzer disk is full, the oldest logs are overwritten; however, you can configure FortiAnalyzer to stop logging

### Log Transmission
- FortiGate uses UDP 514 for log transmission by default

```
config log fortianalyzer setting
set status enable
set server "10.0.13.125"
set serial "FAZ-VMTH24012176"
set enc-algorithm high-medium
set upload-option realtime
end
```

Note: we can test where the traffic is being sent to (port-wise) using a command like:
`diagnose sniffer packet any "host 10.0.13.125" 4`

### Reliable Logging and OFTPS
- Changes the log transport method from UDP to TCP
- If you enable logging to FortiAnalyzer using the FortiAnalyzer GUI, reliable logging is autoenabled
	- If you enable logging to FortiAnalyzer using the CLI, reliable logging is not autoenabled. You must manually set it using `set reliable enable`
- If using reliable logging, you can encrypt communications using SSL-security OFTP (OFTPS)
- FortiCloud uses TCP, and you can set the encryption algorithm using the CLI (default setting is high)

### Logging Scope
- Depending on the size of your organization, the amount of data can vary significantly
- Balance between reducing security risks and assigning resources while adhering to regulations
	- If logging is optional for certain flows, decide whether to spend resources on it
	- Too much data can be as bad as too little
- Prioritize analysis based on
	- Source and destination
	- Type of traffic
	- Type of security event (for example, web filter or intrusion prevention)
	- Frequency
	- Time

### Rolling Logs and Automatically Deleting Old Logs
- How can you better manage your logs on disk?
	- System Settings -> Advanced -> Device Log Settings
- From here, we can roll logs at a specific time or we can delete logs older than a specific age

### FortiGate: Viewing and Searching Log Messages - GUI
- Select log type from `Log & Report`
	- Forward Traffic
	- Local Traffic
	- Sniffer Traffic
	- System Events
	- Security Events

- From these screens, we can filter, choose our log locations to search, and view verbose logs
- Right click any column to add more columns that aren't shown

### FortiGate: Viewing Logs Associated With a Firewall Policy
- Access log messages generated by individual policies
- Right click the firewall policy and select `Show matching logs`

### Viewing and Searching Log Messages - CLI

```
execute log filter
```

- Configures which log messages you will see, how many log messages you can view at one time (max of 1000), and the type of log messages you can view

```
execute log display
```

- Allows you to see specific log messages that you already configured within the `execute log filter` command

### Log View - FortiAnalyzer
- View all logs received for each FortiGate
- You can choose to view only specific devices, Fortinet logs, log browse, log groups

- Log View -> Logs -> All

### Viewing FortiGate Logs on FortiAnalyzer
- View three different types of FortiGate logs: traffic, security, and event
- Security and event logs offer a summary dashboard

- Log View -> Logs -> Fortinet Logs

- View a summary of security logs or event logs to investigate

- Log View -> Logs -> Fortinet Logs -> Event Summary / Security Summary

### Real Time vs. Historical Log Views
- View historical logs with the option to specify a time period
- By default, historical logs are displayed
- When viewing logs in real time, you can pause the view to get a more detailed view of the logs
