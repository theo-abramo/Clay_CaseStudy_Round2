# Clay Table Quick Reference - Copy & Paste Ready

## 📋 Table Name
```
FlowFinance - Website Visitors
```

---

## 🔗 Webhook Configuration

**Webhook URL Format:**
```
https://hooks.clay.com/webhook/rec_XXXXXXXXXXXXX
```

**Expected Payload:**
```json
{
  "event": "pricing_page_viewed|demo_requested|trial_started|plan_clicked|plan_hover",
  "timestamp": "2025-11-13T10:30:00Z",
  "sessionId": "1699876200000-abc123",
  "url": "https://yoursite.com",
  "email": "john@acme.com",
  "company": "Acme Corp",
  "domain": "acme.com",
  "companySize": "51-200 employees",
  "intent_level": "HIGH|MEDIUM|LOW"
}
```

---

## 📊 Complete Column Structure (26 Columns)

### SECTION 1: Webhook Data (7 columns)
| # | Column Name | Type | Source | Formula/Config |
|---|-------------|------|--------|----------------|
| 1 | event | Text | Webhook | Auto |
| 2 | timestamp | DateTime | Webhook | Auto |
| 3 | sessionId | Text | Webhook | Auto |
| 4 | email | Email | Webhook | Auto |
| 5 | company | Text | Webhook | Auto |
| 6 | domain | Text | Webhook/Formula | `{email}.split('@')[1]` |
| 7 | intent_level | Text | Webhook | Auto |

### SECTION 2: Company Enrichment (5 columns)
| # | Column Name | Type | Source | Formula/Config |
|---|-------------|------|--------|----------------|
| 8 | Company Data | Object | Clearbit | Input: `{domain}` |
| 9 | Company Size | Number | Formula | `{Company Data.metrics.employees}` |
| 10 | Company Industry | Text | Formula | `{Company Data.category.industry}` |
| 11 | Company LinkedIn | URL | Formula | `"https://linkedin.com/company/" + {Company Data.linkedin.handle}` |
| 12 | Company HQ | Text | Formula | `{Company Data.geo.city} + ", " + {Company Data.geo.state}` |

### SECTION 3: Hiring Signal (4 columns)
| # | Column Name | Type | Source | Formula/Config |
|---|-------------|------|--------|----------------|
| 13 | Careers Page | Text | Web Scraper | URL: `"https://" + {domain} + "/careers"` |
| 14 | Open Positions | Number | Formula | `({Careers Page}.match(/position/gi) \|\| []).length` |
| 15 | Is Hiring | Boolean | Formula | `{Open Positions} > 5` |
| 16 | Hiring Score | Number | Formula | `{Is Hiring} ? 30 : 0` |

### SECTION 4: Funding Signal (3 columns)
| # | Column Name | Type | Source | Formula/Config |
|---|-------------|------|--------|----------------|
| 17 | Recent News | Text | Google Search | Query: `{company} + " funding OR raised OR Series"` |
| 18 | Has Funding Signal | Boolean | Formula | `{Recent News}.includes('raised') \|\| {Recent News}.includes('funding')` |
| 19 | Funding Score | Number | Formula | `{Has Funding Signal} ? 40 : 0` |

### SECTION 5: Qualification (2 columns)
| # | Column Name | Type | Source | Formula/Config |
|---|-------------|------|--------|----------------|
| 20 | Is Qualified | Boolean | Formula | `{Is Hiring} \|\| {Has Funding Signal}` |
| 21 | Lead Score | Number | Formula | See formula below |

### SECTION 6: Decision Maker (3 columns)
| # | Column Name | Type | Source | Formula/Config |
|---|-------------|------|--------|----------------|
| 22 | Decision Maker | Object | LinkedIn | Query: `{company} + " CFO OR VP Finance"` - Run if qualified |
| 23 | DM Email | Email | Hunter.io | Name: `{Decision Maker.name}`, Domain: `{domain}` |
| 24 | DM Confidence | Number | Formula | `{DM Email.confidence}` |

### SECTION 7: Outreach (2 columns)
| # | Column Name | Type | Source | Formula/Config |
|---|-------------|------|--------|----------------|
| 25 | Personalized Message | Long Text | GPT-4 | See prompt below |
| 26 | Email Sent | Boolean | SmartLead | Run if: `{Personalized Message}` not empty |

---

## 🤖 Key Formulas

### Lead Score (Column 21)
```javascript
let score = 0;

// Event scoring
if ({event} === 'pricing_page_viewed') score += 20;
if ({event} === 'demo_requested') score += 50;
if ({event} === 'trial_started') score += 80;
if ({event} === 'plan_clicked') score += 40;

// Signal scoring  
if ({Is Hiring}) score += 30;
if ({Has Funding Signal}) score += 40;

// Company size scoring
if ({Company Size} > 200) score += 20;
if ({Company Size} > 500) score += 30;

// Intent level scoring
if ({intent_level} === 'HIGH') score += 15;
if ({intent_level} === 'VERY HIGH') score += 25;

return score;
```

**Score Interpretation:**
- 80-100: 🔥 Immediate outreach
- 50-79: ⚡ Outreach within 24h
- 30-49: 📧 Add to nurture
- 0-29: 👀 Monitor only

### Domain Extraction (Column 6)
```javascript
if ({email}) {
  return {email}.split('@')[1];
}
return null;
```

### Open Positions Count (Column 14)
```javascript
if (!{Careers Page}) return 0;

const content = {Careers Page}.toLowerCase();
const keywords = [
  'position', 'job opening', 'we\'re hiring', 
  'join our team', 'job posting', 'opening'
];

let count = 0;
keywords.forEach(keyword => {
  const matches = content.match(new RegExp(keyword, 'gi'));
  if (matches) count = Math.max(count, matches.length);
});

return count;
```

### Funding Signal Detection (Column 18)
```javascript
if (!{Recent News}) return false;

const news = {Recent News}.toLowerCase();
const keywords = [
  'raised', 'funding', 'series a', 'series b', 'series c',
  'investment', 'investors', 'venture capital', 'seed round',
  'capital', 'financing', 'backed by'
];

return keywords.some(keyword => news.includes(keyword));
```

---

## 💬 GPT-4 Prompt (Column 25)

```
You are a B2B sales expert writing personalized outreach emails.

PROSPECT INFORMATION:
- Name: {Decision Maker.name}
- Title: {Decision Maker.title}
- Company: {company} ({Company Size} employees, {Company Industry})
- Location: {Company HQ}

INTENT SIGNALS:
- Event: {event}
- Viewed pricing on: {timestamp}
- Hiring Status: {Is Hiring} ({Open Positions} open positions)
- Funding Signal: {Has Funding Signal}
- Recent News: {Recent News}
- Lead Score: {Lead Score}/100

PRODUCT:
FlowFinance - Modern corporate spend management platform
- Corporate cards (virtual & physical)
- Automated expense tracking & reconciliation  
- Real-time spend analytics & reporting
- Seamless accounting integrations

TASK:
Write a highly personalized outreach email that:

1. **Subject Line** (under 50 characters):
   - Relevant to their growth signal
   - Creates curiosity
   - Not salesy

2. **Email Body** (under 120 words):
   - Start with their specific situation (hiring/funding)
   - Subtly acknowledge pricing page visit
   - One clear benefit for their company size/stage
   - Soft CTA with calendar link
   - Professional but warm tone
   - NO generic templates

3. **Calendar Link**:
   https://calendly.com/flowfinance/demo

OUTPUT FORMAT:
Subject: [your subject line]

Hi {Decision Maker.name},

[your email body]

Best,
Sarah Chen
Account Executive, FlowFinance

---

CRITICAL: Make it feel personal and timely, not automated. Reference specific details that show you researched them.
```

**GPT-4 Settings:**
- Model: `gpt-4-turbo-preview`
- Temperature: `0.7`
- Max tokens: `300`
- Top P: `1`

---

## ⚙️ Run Conditions

### Company Enrichment (Columns 8-12)
```
Run if: {domain} is not empty
```

### Hiring Signal (Columns 13-16)
```
Run if: {domain} is not empty
```

### Funding Signal (Columns 17-19)
```
Run if: {company} is not empty
```

### Decision Maker Search (Column 22)
```
Run if: {Is Qualified} = true
```

### Email Finding (Column 23)
```
Run if: {Decision Maker} is not empty
```

### Message Generation (Column 25)
```
Run if: {Is Qualified} = true AND {DM Email} is not empty AND {DM Confidence} > 90
```

### Email Sending (Column 26)
```
Run if: {Personalized Message} is not empty
⚠️ Manual review first! Don't auto-send initially.
```

---

## 🎯 Views & Filters

### View 1: "All Events"
```
Filter: None
Sort: {timestamp} descending
```

### View 2: "Qualified Leads"
```
Filter: {Is Qualified} = true
Sort: {Lead Score} descending
```

### View 3: "Ready to Contact"
```
Filter: 
  {Is Qualified} = true AND
  {DM Email} is not empty AND
  {Email Sent} = false
Sort: {Lead Score} descending
```

### View 4: "High Score Leads"
```
Filter: {Lead Score} >= 70
Sort: {Lead Score} descending
```

### View 5: "Needs Review"
```
Filter:
  {Is Qualified} = true AND
  ({Company Data} is empty OR {DM Email} is empty)
```

---

## 📊 Dashboard Metrics

Create a separate "Dashboard" table with these aggregations:

**Daily Metrics:**
- Total events received
- Form submissions (where email exists)
- Qualification rate: `qualified / total submissions`
- Avg lead score
- Emails sent

**Funnel:**
```
Pricing Views → Form Submissions → Qualified → Contacted → Responded
```

**Costs:**
- Events processed × $0
- Clearbit lookups × $1
- Emails found × $0.20  
- GPT messages × $0.04
- Emails sent × $0.50

---

## 🚨 Error Handling

### Empty Domain
```
If {domain} is empty:
  - Skip enrichment
  - Mark as "Incomplete Data"
  - Log for review
```

### Failed Enrichment
```
If {Company Data} fails:
  - Try alternative: HubSpot
  - Manual research for high-score leads
  - Flag in Slack
```

### No Decision Maker Found
```
If {Decision Maker} is empty:
  - Try broader search: "finance leader"
  - Check company website /team page
  - Use ZoomInfo as backup
```

### Low Email Confidence
```
If {DM Confidence} < 90:
  - Don't auto-send
  - Flag for manual verification
  - Try alternative: Phone number
```

---

## 🎤 Interview Talking Points

**When showing this table:**

1. **"The webhook captures every interaction"**
   → Point to columns 1-7

2. **"We enrich company data from multiple sources"**
   → Point to columns 8-12

3. **"Then check for growth signals"**
   → Point to hiring (13-16) and funding (17-19) sections

4. **"Our qualification logic is intelligent"**
   → Point to columns 20-21, explain scoring

5. **"We find and verify decision makers"**
   → Point to columns 22-24

6. **"And generate personalized outreach"**
   → Point to column 25, show example

7. **"All automated, zero manual work"**
   → Show auto-run settings

---

## ⚡ Quick Setup Commands

### Test Your Webhook
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "demo_requested",
    "timestamp": "2025-11-13T10:30:00Z",
    "email": "test@acme.com",
    "company": "Acme Corp",
    "domain": "acme.com",
    "intent_level": "HIGH"
  }'
```

### Expected Response
```json
{
  "success": true,
  "recordId": "rec_abc123xyz"
}
```

---

## 📝 Notes Section (For Each Row)

Good practice: Add a "Notes" column for:
- Manual research insights
- Follow-up reminders
- Why lead was/wasn't qualified
- Response tracking

---

## ✅ Pre-Launch Checklist

- [ ] Webhook URL copied to website
- [ ] All 26 columns created
- [ ] Formulas tested with sample data
- [ ] Run conditions configured
- [ ] Auto-run enabled
- [ ] Views and filters set up
- [ ] Slack notifications working
- [ ] Team has access to table
- [ ] Daily monitoring scheduled
- [ ] Cost tracking setup

---

**Print this page and keep it handy during setup!** 📄