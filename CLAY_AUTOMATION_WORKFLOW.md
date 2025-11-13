# Clay Automation Workflow for FlowFinance Demo

## 🎯 Objective
Automatically identify and reach out to high-intent prospects who visit our pricing page AND show signals of growth/expansion.

## 📊 Sequential Logic Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIGGER: Pricing Page Visit              │
│  (Webhook from website when visitor scrolls to #pricing)   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              ENRICHMENT 1: Identify Company                 │
│  • Extract email domain from visitor                        │
│  • Use Clearbit/Hunter.io to identify company               │
│  • Get company LinkedIn URL                                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         CONDITION CHECK: Growth Signals Present?            │
│                                                             │
│  Path A: Is Company Hiring?                                │
│  ├── Scrape company careers page                           │
│  ├── Count open positions                                   │
│  └── IF positions > 5 → TAG: "High Growth"                 │
│                                                             │
│                     OR                                      │
│                                                             │
│  Path B: Financial Expansion Announced?                    │
│  ├── Search recent news (last 90 days)                     │
│  ├── Keywords: "raised", "funding", "Series", "expansion"  │
│  └── IF match found → TAG: "Expansion Signal"              │
└─────────────────────────────┬───────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌─────────────┐
            │  QUALIFIED   │    │ NOT QUALIFIED│
            │  (Continue)  │    │  (Stop Flow) │
            └──────┬───────┘    └──────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         ENRICHMENT 2: Find Decision Maker                   │
│  • Search LinkedIn for CFO/Head of Finance                  │
│  • Get decision maker's email via Hunter.io                 │
│  • Scrape decision maker's recent posts/activity            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         ENRICHMENT 3: Personalization Data                  │
│  • Recent company milestones                                │
│  • Educational background (alma mater)                      │
│  • Shared connections                                       │
│  • Recent LinkedIn posts/articles                           │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            ACTION: Generate Personalized Message            │
│  Uses GPT-4 to craft message with:                         │
│  • Reference to pricing page visit                          │
│  • Mention of hiring/expansion signal                       │
│  • Personalized hook (school, article, etc.)               │
│  • Clear value proposition                                  │
│  • Soft CTA (calendar link)                                │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              FINAL ACTION: Send Outreach                    │
│  • Send via SmartLead.ai or similar                        │
│  • Add to CRM with tags                                     │
│  • Schedule follow-up sequence                              │
│  • Notify sales team in Slack                               │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Clay Table Structure

### Table Name: "FlowFinance - Pricing Page Visitors"

### Columns Setup

| Column Name | Type | Source | Notes |
|------------|------|--------|-------|
| `timestamp` | Date/Time | Webhook | When they visited pricing |
| `visitor_ip` | Text | Webhook | For company lookup |
| `visitor_email` | Email | Webhook | If captured via form |
| `company_domain` | Text | Clearbit | Extracted from email/IP |
| `company_name` | Text | Clearbit | Full company name |
| `company_linkedin` | URL | Clearbit | Company LinkedIn profile |
| `company_size` | Number | Clearbit | Employee count |
| `company_industry` | Text | Clearbit | Industry category |
| `careers_page_url` | URL | Formula | company_domain + /careers |
| `open_positions_count` | Number | Scraper | Count of job postings |
| `is_hiring` | Checkbox | Formula | IF open_positions > 5 |
| `recent_news` | Text | API | Last 90 days of news |
| `funding_keywords_found` | Checkbox | Formula | Contains "raised", "Series", etc |
| `growth_signal` | Text | Formula | "Hiring" OR "Funding" OR "Both" |
| `is_qualified` | Checkbox | Formula | is_hiring OR funding_keywords_found |
| `decision_maker_name` | Text | LinkedIn Scraper | CFO/Finance Lead |
| `decision_maker_title` | Text | LinkedIn Scraper | Job title |
| `decision_maker_email` | Email | Hunter.io | Work email |
| `decision_maker_linkedin` | URL | LinkedIn Search | Profile URL |
| `alma_mater` | Text | LinkedIn Scraper | Education |
| `recent_posts` | Text | LinkedIn Scraper | Last 3 posts |
| `personalized_hook` | Text | GPT-4 | Custom intro line |
| `outreach_message` | Long Text | GPT-4 | Full message |
| `message_sent` | Checkbox | SmartLead | Delivery status |
| `sent_date` | Date | SmartLead | When sent |
| `crm_id` | Text | Salesforce | CRM record ID |

### Filters

1. **Qualified Leads**: `is_qualified = TRUE`
2. **Not Yet Contacted**: `message_sent = FALSE`
3. **High Priority**: `company_size > 50 AND is_qualified = TRUE`

## 📝 Clay Formula Examples

### Is Hiring Check
```javascript
// In is_hiring column
{open_positions_count} > 5
```

### Funding Keywords Check
```javascript
// In funding_keywords_found column
{recent_news}.includes("raised") || 
{recent_news}.includes("funding") || 
{recent_news}.includes("Series") ||
{recent_news}.includes("expansion") ||
{recent_news}.includes("investment")
```

### Growth Signal Classification
```javascript
// In growth_signal column
if ({is_hiring} && {funding_keywords_found}) {
  return "Both - HOT LEAD";
} else if ({is_hiring}) {
  return "Hiring";
} else if ({funding_keywords_found}) {
  return "Funding";
} else {
  return "None";
}
```

### Qualification Status
```javascript
// In is_qualified column
{is_hiring} || {funding_keywords_found}
```

## 🤖 GPT-4 Prompts in Clay

### Personalized Hook Generation

```
Given the following information about a prospect:
- Name: {decision_maker_name}
- Title: {decision_maker_title}
- Company: {company_name}
- Alma Mater: {alma_mater}
- Recent LinkedIn Activity: {recent_posts}
- Company Signal: {growth_signal}

Generate a single, natural sentence that serves as a personalized opener for an outreach message. The sentence should:
1. Feel genuine and researched, not templated
2. Reference either their alma mater, a recent post, or the growth signal
3. Be under 25 words
4. Create curiosity without being salesy

Output ONLY the hook sentence, nothing else.
```

### Full Message Generation

```
Write a personalized outreach message for a B2B sales email with these details:

PROSPECT INFO:
- Name: {decision_maker_name}
- Title: {decision_maker_title}
- Company: {company_name}
- They visited our pricing page on: {timestamp}

COMPANY SIGNALS:
- Growth Signal: {growth_signal}
- Open Positions: {open_positions_count}
- Recent News: {recent_news}

PERSONALIZATION HOOK:
{personalized_hook}

PRODUCT:
FlowFinance is a modern spend management platform that offers:
- Corporate cards with real-time controls
- Automated expense tracking and reconciliation
- AI-powered spend analytics
- Seamless accounting integrations

REQUIREMENTS:
1. Start with the personalized hook
2. Acknowledge their pricing page visit (subtly)
3. Reference their growth signal (hiring/funding) as context for timing
4. Explain how FlowFinance helps fast-growing companies
5. Include one specific benefit relevant to their situation
6. End with a soft CTA (calendar link or simple question)
7. Keep under 150 words
8. Professional but conversational tone
9. No pushy language

Calendar link: https://calendly.com/flowfinance/demo

Output ONLY the email body, no subject line.
```

## 🎤 Interview Talking Points

### Opening
"I built this to demonstrate how FlowFinance would qualify and reach out to high-intent prospects at scale. The key insight is that a pricing page visit plus growth signals equals a hot lead."

### Technical Depth
"The automation uses webhooks to capture pricing page visits, then runs parallel enrichment workflows. We check hiring data from careers pages and news mentions for funding signals. Both paths feed into qualification logic."

### Personalization
"The real magic is in the GPT-4 layer. We're not just sending bulk emails—we're using LinkedIn data, alma mater, and recent activity to craft messages that feel researched and timely."

### Business Impact
"For FlowFinance, this means:
- Only contacting companies showing clear buying signals
- Reducing sales team workload by 80%
- Increasing response rates through better targeting
- Scaling outreach without scaling headcount"

### Scale Potential
"This workflow processes hundreds of visitors daily. Each qualified lead gets a unique, personalized message within minutes of their pricing page visit. That's impossible to do manually."

## 🚀 Demo Flow for Interview

1. **Show the Website** (30 seconds)
   - "Here's FlowFinance's website that I built"
   - Scroll to pricing page
   - Point out quality and professionalism

2. **Open Browser Console** (15 seconds)
   - Show the tracking log when pricing section is viewed
   - "This triggers our webhook to Clay"

3. **Show Clay Table** (2 minutes)
   - Walk through the columns
   - Explain the enrichment sequence
   - Show a few sample rows with data

4. **Explain the Logic** (2 minutes)
   - Draw or show the flowchart
   - Emphasize the AND/OR conditions
   - Highlight personalization layer

5. **Show Sample Messages** (1 minute)
   - Display 2-3 generated messages
   - Point out unique personalization
   - Show how they differ based on signals

6. **Discuss Scale** (30 seconds)
   - "This handles 100+ visitors daily"
   - "Sales team only sees qualified, enriched leads"
   - "Personalization is automated but authentic"

## 🎯 Questions They Might Ask

**Q: How do you handle false positives?**
A: We could add additional filters like company size minimum, specific industries, or require both signals (hiring AND funding) for highest confidence.

**Q: What's the response rate?**
A: With this level of targeting and personalization, we'd expect 8-12% response rates vs. 1-2% for cold outreach.

**Q: How do you scale this to other pages?**
A: The same logic applies to any high-intent page—demo requests, case study downloads, API docs. Each has different qualification criteria.

**Q: What if the decision maker isn't on LinkedIn?**
A: We fall back to general titles (any finance exec), or use Clearbit/ZoomInfo for direct phone numbers to the finance department.

**Q: How do you avoid spam filters?**
A: High personalization + legitimate intent (they visited our site) + proper email warming = high deliverability. We'd use tools like SmartLead or Instantly for sending infrastructure.

---

**Remember**: The goal isn't to show every technical detail—it's to demonstrate you understand how to solve real business problems with Clay's automation capabilities. Stay focused on the value this creates for FlowFinance's sales team! 🎯