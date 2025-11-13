# Clay Integration Guide - Connect Your Website to Clay Automation

## 🎯 Overview

This guide shows you how to connect your FlowFinance demo website **directly to Clay** so every visitor interaction automatically triggers your enrichment and outreach workflow.

## 🔌 Step 1: Set Up Clay Webhook (5 minutes)

### Create Your Webhook in Clay

1. **Go to Clay** → Open your workspace
2. **Create a New Table** called "FlowFinance - Website Visitors"
3. **Add Webhook Column**:
   - Click "+ Add Column" → "Integrations" → "Webhook"
   - Name it: "Website Events"
   - Copy your webhook URL (looks like: `https://hooks.clay.com/webhook/...`)

### Configure Webhook to Receive Data

Clay will automatically create a new row for each event. The webhook will receive:
```json
{
  "event": "pricing_page_viewed",
  "timestamp": "2025-11-13T10:30:00Z",
  "sessionId": "1699876200000-abc123",
  "url": "https://yoursite.com",
  "email": "john@acme.com",
  "company": "Acme Corp",
  "domain": "acme.com",
  "intent_level": "HIGH"
}
```

## 🌐 Step 2: Update Your Website (2 minutes)

### Option A: Add Your Webhook URL Directly

Open your `index.html` file and find this line (around line 820):

```javascript
// In production, send to Clay webhook:
// fetch('YOUR_CLAY_WEBHOOK_URL', {
```

**Replace it with:**

```javascript
// Send to Clay webhook
fetch('https://hooks.clay.com/webhook/YOUR_ACTUAL_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(event)
});
```

### Option B: Environment Variable Approach (Recommended for Production)

Create a simple config at the top of your script:

```javascript
const CLAY_WEBHOOK_URL = 'https://hooks.clay.com/webhook/YOUR_WEBHOOK_URL';
```

Then in the `track()` function:

```javascript
track(eventName, data = {}) {
  const event = { /* ... */ };
  
  // Send to Clay
  fetch(CLAY_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(err => console.log('Tracking error:', err));
  
  // Also log for debugging
  console.log('🎯 Sent to Clay:', eventName);
}
```

## 📊 Step 3: Set Up Your Clay Table Structure

### Required Columns

| Column Name | Type | Source | Purpose |
|-------------|------|--------|---------|
| `event` | Text | Webhook | Event type (pricing_viewed, demo_requested) |
| `timestamp` | Date/Time | Webhook | When event occurred |
| `sessionId` | Text | Webhook | Track user sessions |
| `email` | Email | Webhook | User's work email (from forms) |
| `company` | Text | Webhook | Company name (from forms) |
| `domain` | Text | Webhook/Formula | Company domain (auto-extracted from email) |
| `intent_level` | Text | Webhook | HIGH/MEDIUM/LOW |
| `company_enriched` | Object | Clearbit | Company data enrichment |
| `company_size` | Number | Formula | From Clearbit data |
| `company_linkedin` | URL | Formula | From Clearbit data |
| `is_hiring` | Boolean | Web Scraper | Scraped from careers page |
| `open_positions` | Number | Web Scraper | Count of job postings |
| `recent_news` | Text | News API | Last 90 days |
| `has_funding_signal` | Boolean | Formula | Keywords in news |
| `is_qualified` | Boolean | Formula | is_hiring OR has_funding_signal |
| `decision_maker` | Text | LinkedIn | CFO/VP Finance name |
| `decision_maker_email` | Email | Hunter.io | Work email |
| `decision_maker_linkedin` | URL | LinkedIn | Profile URL |
| `personalized_message` | Long Text | GPT-4 | Generated outreach |
| `message_sent` | Boolean | SmartLead | Delivery status |

### Formula Examples

**Extract Domain from Email:**
```javascript
// In 'domain' column
{email}.split('@')[1]
```

**Check for Funding Signals:**
```javascript
// In 'has_funding_signal' column
{recent_news}.includes('raised') || 
{recent_news}.includes('funding') || 
{recent_news}.includes('Series')
```

**Qualify Lead:**
```javascript
// In 'is_qualified' column
({is_hiring} && {open_positions} > 5) || {has_funding_signal}
```

## 🤖 Step 4: Build Your Automation Workflow

### Sequential Logic Flow

```
TRIGGER: New row added via webhook
  ↓
CONDITION 1: Is there an email? (Form submission events only)
  ↓
  YES → Continue to enrichment
  NO → Just log the event (page view tracking)
  ↓
ENRICHMENT STEP 1: Identify Company
  ↓ Use Clearbit to enrich from domain
  ↓ Get: company name, size, industry, LinkedIn
  ↓
ENRICHMENT STEP 2: Check Growth Signals
  ↓
  PATH A: Check if Hiring
  ↓ → Build careers page URL: {domain}/careers
  ↓ → Scrape page for job listings
  ↓ → Count open positions
  ↓ → IF count > 5: Mark as hiring
  ↓
  PATH B: Check for Funding
  ↓ → Search news mentions (last 90 days)
  ↓ → Check for keywords: "raised", "funding", "Series"
  ↓ → IF found: Mark as funding signal
  ↓
CONDITION 2: Is lead qualified?
  ↓ Check: {is_qualified} = TRUE
  ↓
  YES → Continue to outreach
  NO → Stop (add to nurture list)
  ↓
ENRICHMENT STEP 3: Find Decision Maker
  ↓ → Search LinkedIn: "{company} CFO" OR "VP Finance"
  ↓ → Get decision maker's name and LinkedIn
  ↓ → Use Hunter.io to find email
  ↓ → Scrape recent LinkedIn posts/activity
  ↓
ENRICHMENT STEP 4: Personalization Data
  ↓ → Get alma mater from LinkedIn
  ↓ → Recent company milestones
  ↓ → Shared connections
  ↓
CONTENT GENERATION: Create Personalized Message
  ↓ → Use GPT-4 integration
  ↓ → Feed it all enrichment data
  ↓ → Generate unique outreach message
  ↓
FINAL ACTION: Send Outreach
  ↓ → Send via SmartLead/Instantly
  ↓ → Add to CRM (Salesforce/HubSpot)
  ↓ → Notify sales team in Slack
  ↓
DONE ✅
```

## 🛠️ Step 5: Configure Each Enrichment

### 1. Clearbit Enrichment

**Column**: `company_enriched`
**Integration**: Clearbit Enrichment API
**Input**: `{domain}`
**Settings**: 
- Return full company object
- Cache results for 30 days

**Extract specific fields:**
- `company_size`: `{company_enriched.employees}`
- `company_linkedin`: `{company_enriched.linkedin.handle}`
- `company_industry`: `{company_enriched.category.industry}`

### 2. Careers Page Scraper

**Column**: `careers_page_content`
**Integration**: Clay's Web Scraper or Apify
**Input**: `https://{domain}/careers`
**Settings**:
- Timeout: 10 seconds
- Extract: All text content
- Fallback: Try `/jobs`, `/join-us`, `/team`

**Count positions:**
```javascript
// In 'open_positions' column
{careers_page_content}.split('position').length - 1
```

### 3. News Search

**Column**: `recent_news`
**Integration**: News API or Google News API
**Input**: `{company}` 
**Settings**:
- Date range: Last 90 days
- Max results: 10
- Language: English

### 4. LinkedIn People Search

**Column**: `decision_maker_search`
**Integration**: LinkedIn Sales Navigator API (via Clay)
**Input**: `{company} CFO OR VP Finance`
**Settings**:
- Current company only
- Return top 3 results
- Include: name, title, LinkedIn URL

### 5. Email Finding

**Column**: `decision_maker_email`
**Integration**: Hunter.io
**Input**: 
- Name: `{decision_maker}`
- Domain: `{domain}`
**Settings**:
- Minimum confidence: 90%
- Verification: Yes

### 6. GPT-4 Message Generation

**Column**: `personalized_message`
**Integration**: OpenAI GPT-4
**Prompt**:
```
Write a personalized B2B outreach email with these details:

PROSPECT:
- Name: {decision_maker}
- Title: {decision_maker_title}
- Company: {company}
- They visited our pricing page on: {timestamp}

SIGNALS:
- Hiring: {is_hiring} ({open_positions} positions)
- Funding news: {recent_news}
- Company size: {company_size}

PERSONALIZATION:
- School: {alma_mater}
- Recent post: {recent_linkedin_post}

PRODUCT:
FlowFinance - corporate cards + spend management platform

REQUIREMENTS:
1. Subject line (under 50 chars)
2. Acknowledge their pricing page visit (subtle)
3. Reference growth signal (hiring/funding)
4. One specific benefit for their situation
5. Soft CTA with calendar link
6. Under 120 words
7. Professional but warm tone

Output format:
Subject: [subject line]

[email body]
```

### 7. Send Email

**Column**: `email_sent`
**Integration**: SmartLead.ai or Instantly
**Input**:
- To: `{decision_maker_email}`
- Subject: Extract from `{personalized_message}`
- Body: Extract from `{personalized_message}`
- From: `sales@flowfinance.com`
**Settings**:
- Track opens/clicks
- Schedule: Send within 1 hour
- Daily limit: 50 emails

### 8. CRM Integration

**Column**: `crm_record_id`
**Integration**: Salesforce / HubSpot
**Action**: Create or update contact
**Data**:
```json
{
  "email": "{decision_maker_email}",
  "firstName": "{decision_maker}",
  "company": "{company}",
  "leadSource": "Website - Pricing Page",
  "leadScore": "{intent_level}",
  "customField_hiringSignal": "{is_hiring}",
  "customField_fundingSignal": "{has_funding_signal}"
}
```

### 9. Slack Notification

**Column**: `slack_notified`
**Integration**: Slack Webhook
**Message**:
```
🔥 New Qualified Lead!

Company: {company} ({company_size} employees)
Decision Maker: {decision_maker} ({decision_maker_title})
Signal: {is_hiring ? 'Hiring' : ''} {has_funding_signal ? 'Recent funding' : ''}
Message sent: ✅

View in Clay: [Link to row]
```

## ⚡ Step 6: Set Up Conditional Logic

### Use Clay's "Run if" Feature

**For Email Enrichment:**
```
Run if: {email} is not empty
```

**For Qualification Check:**
```
Run if: {is_qualified} = TRUE
```

**For Message Sending:**
```
Run if: {decision_maker_email} is not empty AND {is_qualified} = TRUE
```

## 🎨 Step 7: Test Your Workflow

### Test Checklist

1. **Submit test form on your website**
   - Use a real work email (your own)
   - Check if data appears in Clay table

2. **Verify enrichment runs**
   - Check Clearbit populated company data
   - Verify careers page scrape worked
   - Confirm news search returned results

3. **Test qualification logic**
   - Manually set `is_hiring = TRUE` on test row
   - Verify workflow continues to next steps

4. **Check message generation**
   - Review generated message quality
   - Ensure personalization is relevant

5. **Test email sending (carefully!)**
   - Use your own email first
   - Verify formatting looks good
   - Check if tracking works

## 📈 Step 8: Monitor & Optimize

### Key Metrics to Track

**In Clay:**
- Events received per day
- Form submission rate
- Qualification rate (%)
- Email delivery rate
- Response rate

**Create a Dashboard:**
1. **Daily Events**: Count rows by date
2. **Intent Distribution**: HIGH vs MEDIUM vs LOW
3. **Qualification Rate**: Qualified / Total form submissions
4. **Conversion Funnel**:
   - Pricing page views
   - → Demo requests
   - → Qualified leads
   - → Emails sent
   - → Responses received

## 🚨 Common Issues & Solutions

### Issue 1: Webhook Not Receiving Data
**Solution**: 
- Check browser console for CORS errors
- Verify webhook URL is correct
- Test with Postman first

### Issue 2: Email Domain Not Extracting
**Solution**:
- Check formula: `{email}.split('@')[1]`
- Ensure email field has data
- Add error handling in formula

### Issue 3: Careers Page Not Found
**Solution**:
- Try multiple URLs: `/careers`, `/jobs`, `/join-us`
- Use Apify's LinkedIn Jobs scraper instead
- Fallback to manual check for high-value leads

### Issue 4: Low Qualification Rate
**Solution**:
- Adjust thresholds (e.g., >3 positions instead of >5)
- Add more signals (e.g., company growth rate)
- Include news without funding keywords

### Issue 5: Poor Message Quality
**Solution**:
- Refine GPT-4 prompt with examples
- Add more context data
- A/B test different prompt styles

## 🎯 Advanced: Multi-Event Scoring

Instead of binary qualification, score leads:

**Lead Score Formula:**
```javascript
let score = 0;
if ({event} === 'pricing_page_viewed') score += 20;
if ({event} === 'demo_requested') score += 50;
if ({event} === 'trial_started') score += 80;
if ({is_hiring}) score += 30;
if ({has_funding_signal}) score += 40;
if ({company_size} > 200) score += 20;
return score;
```

**Prioritize based on score:**
- 80-100: Immediate outreach
- 50-79: Outreach within 24h
- 30-49: Add to nurture
- 0-29: Monitor only

## 💰 Cost Estimate

**Per 1,000 website visitors:**
- Clay: $0 (included in plan)
- Clearbit: ~$50 (50 form submissions × $1)
- Hunter.io: ~$10 (50 emails found × $0.20)
- GPT-4: ~$2 (50 messages × $0.04)
- SmartLead: ~$25 (50 emails × $0.50)
**Total: ~$87 per 1,000 visitors**

With 2% form conversion = 20 qualified leads = **$4.35 per qualified lead**

## 🎓 Pro Tips

1. **Start Simple**: Get pricing page tracking working first, then add complexity
2. **Test with Your Own Email**: Always test new automations on yourself
3. **Monitor Daily**: Check your Clay table daily for errors
4. **Iterate on Prompts**: GPT-4 messages improve with refinement
5. **Respect Consent**: Only email people who submitted forms
6. **Follow Up**: Add follow-up sequences after 3, 7, 14 days

## 🔗 Quick Setup Commands

### For Interview Demo (Simulated)
Keep the console logging version - shows Clay's value without needing real setup

### For Production (Real Integration)
1. Get Clay webhook URL
2. Add to website config
3. Test with your email
4. Build enrichment workflow
5. Launch! 🚀

---

## Next Steps

1. ✅ Deploy your website to GitHub Pages
2. ✅ Create Clay account (if you don't have one)
3. ✅ Set up webhook table
4. ✅ Add webhook URL to website
5. ✅ Test with your own email
6. ✅ Build enrichment workflow
7. ✅ Show this in your interview!

**Questions?** Reference this guide during your interview - showing you've thought through the entire integration demonstrates deep Clay understanding!

---

**For your interview**: You don't need to actually integrate this - just show you **know how to**. The console logging version is perfect for demonstration!