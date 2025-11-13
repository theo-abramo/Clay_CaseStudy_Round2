# Clay Setup Walkthrough - Visual Guide

## 🎯 Complete Setup in 30 Minutes

This guide walks you through setting up the **entire automation** in Clay, step by step.

---

## Part 1: Create Your Webhook (5 minutes)

### Step 1: Create New Table
```
1. Open Clay.com → Log in
2. Click "Create Table" (top right)
3. Name it: "FlowFinance - Website Visitors"
4. Click "Create"
```

### Step 2: Add Webhook Column
```
1. In your new table, click "+ Add Column" (top right)
2. Select "Integrations" → "Webhook"
3. Name the column: "Website Events"
4. Click "Create Webhook"
5. 🔑 COPY THE WEBHOOK URL - you'll need this!
   (Should look like: https://hooks.clay.com/webhook/rec_abc123xyz...)
```

### Step 3: Configure Webhook
```
1. Click the webhook column header (⚙️ settings icon)
2. Under "Payload Mapping":
   - Map "event" → event
   - Map "timestamp" → timestamp
   - Map "email" → email
   - Map "company" → company
   - Map "domain" → domain
   - Map "intent_level" → intent_level
3. Click "Save"
```

---

## Part 2: Build Your Enrichment Columns (15 minutes)

### Column 1: Company Enrichment (Clearbit)
```
1. Click "+ Add Column" → "Enrich Data" → "Company" → "Clearbit"
2. Name it: "Company Data"
3. Input field: {domain}
4. Settings:
   ☑ Return full object
   ☐ Only run if domain exists
5. Click "Add Column"
```

### Column 2: Extract Company Size
```
1. Click "+ Add Column" → "Formula" → "Custom Formula"
2. Name it: "Company Size"
3. Formula: {Company Data.metrics.employees}
4. Click "Add Column"
```

### Column 3: Extract LinkedIn URL
```
1. Click "+ Add Column" → "Formula" → "Custom Formula"
2. Name it: "Company LinkedIn"
3. Formula: "https://linkedin.com/company/" + {Company Data.linkedin.handle}
4. Click "Add Column"
```

### Column 4: Careers Page Scraper
```
1. Click "+ Add Column" → "Enrich Data" → "Scrape Website"
2. Name it: "Careers Page Content"
3. URL formula: "https://" + {domain} + "/careers"
4. Settings:
   - Selector: body (or specific job listing selectors)
   - Timeout: 10 seconds
   ☑ Follow redirects
5. Run if: {domain} is not empty
6. Click "Add Column"
```

### Column 5: Count Open Positions
```
1. Click "+ Add Column" → "Formula" → "Custom Formula"  
2. Name it: "Open Positions Count"
3. Formula: 
   if ({Careers Page Content}.includes('position') || 
       {Careers Page Content}.includes('job')) {
     return Math.max(
       ({Careers Page Content}.match(/position/gi) || []).length,
       ({Careers Page Content}.match(/job opening/gi) || []).length,
       ({Careers Page Content}.match(/we're hiring/gi) || []).length
     );
   }
   return 0;
4. Click "Add Column"
```

### Column 6: Is Hiring?
```
1. Click "+ Add Column" → "Formula" → "Custom Formula"
2. Name it: "Is Hiring"
3. Formula: {Open Positions Count} > 5
4. Click "Add Column"
```

### Column 7: Recent News Search
```
1. Click "+ Add Column" → "Enrich Data" → "Search Google"
2. Name it: "Recent Company News"
3. Search query: {company} + " funding OR raised OR Series OR investment"
4. Settings:
   - Time range: Past 3 months
   - Number of results: 5
5. Run if: {company} is not empty
6. Click "Add Column"
```

### Column 8: Has Funding Signal?
```
1. Click "+ Add Column" → "Formula" → "Custom Formula"
2. Name it: "Has Funding Signal"
3. Formula:
   {Recent Company News}.toLowerCase().includes('raised') ||
   {Recent Company News}.toLowerCase().includes('funding') ||
   {Recent Company News}.toLowerCase().includes('series') ||
   {Recent Company News}.toLowerCase().includes('investment')
4. Click "Add Column"
```

### Column 9: Is Qualified?
```
1. Click "+ Add Column" → "Formula" → "Custom Formula"
2. Name it: "Is Qualified"
3. Formula: {Is Hiring} === true || {Has Funding Signal} === true
4. Click "Add Column"
```

---

## Part 3: Find Decision Makers (5 minutes)

### Column 10: LinkedIn People Search
```
1. Click "+ Add Column" → "Enrich Data" → "People" → "LinkedIn"
2. Name it: "Decision Maker"
3. Search query: {company} + " CFO OR VP Finance OR Head of Finance"
4. Settings:
   - Current company only: ☑
   - Return: First result
5. Run if: {Is Qualified} = true
6. Click "Add Column"
```

### Column 11: Find Email
```
1. Click "+ Add Column" → "Enrich Data" → "Email" → "Hunter.io"
2. Name it: "Decision Maker Email"
3. Inputs:
   - Name: {Decision Maker.name}
   - Domain: {domain}
4. Settings:
   - Minimum confidence: 90%
   ☑ Verify email
5. Run if: {Decision Maker} is not empty
6. Click "Add Column"
```

---

## Part 4: Generate Personalized Message (3 minutes)

### Column 12: GPT-4 Message
```
1. Click "+ Add Column" → "Enrich Data" → "AI" → "Use AI"
2. Name it: "Personalized Outreach"
3. Prompt:
   Write a personalized B2B sales email:
   
   TO: {Decision Maker.name}, {Decision Maker.title} at {company}
   SIGNAL: {Is Hiring ? "They're hiring (" + Open Positions Count + " positions)" : "Recent funding news"}
   CONTEXT: They visited our pricing page on {timestamp}
   
   PRODUCT: FlowFinance - corporate spend management platform with cards, 
   expense automation, and real-time reporting
   
   REQUIREMENTS:
   - Start with their growth signal (hiring/funding)
   - Reference pricing page visit subtly
   - One specific benefit for their situation
   - Soft CTA: calendar link
   - Under 120 words
   - Professional but warm
   
   Output format:
   Subject: [subject line under 50 chars]
   
   [email body]
   
   Calendar: https://calendly.com/flowfinance/demo

4. Model: GPT-4
5. Temperature: 0.7
6. Run if: {Is Qualified} = true AND {Decision Maker Email} is not empty
7. Click "Add Column"
```

---

## Part 5: Send Email & Notify (2 minutes)

### Column 13: Send Email (Optional - Be Careful!)
```
1. Click "+ Add Column" → "Enrich Data" → "Email" → "Send Email"
2. Name it: "Email Sent"
3. Settings:
   - To: {Decision Maker Email}
   - Subject: [Extract from {Personalized Outreach}]
   - Body: [Extract from {Personalized Outreach}]
   - From: your-email@flowfinance.com
4. Run if: {Personalized Outreach} is not empty
5. ⚠️ START WITH MANUAL REVIEW - Don't auto-send at first!
6. Click "Add Column"
```

### Column 14: Slack Notification
```
1. Click "+ Add Column" → "Integrations" → "Slack"
2. Name it: "Slack Alert"
3. Message:
   🔥 New Qualified Lead!
   
   Company: {company} ({Company Size} employees)
   Contact: {Decision Maker.name} - {Decision Maker.title}
   Signal: {Is Hiring ? "Hiring" : "Funding"}
   
   Message: {Personalized Outreach}
   
   View in Clay: [row link]

4. Channel: #sales-qualified-leads
5. Run if: {Is Qualified} = true
6. Click "Add Column"
```

---

## Part 6: Configure Automation Settings

### Set Up Auto-Run
```
1. Click table name → "Settings" → "Automations"
2. Enable "Auto-run enrichments"
3. Settings:
   ☑ Run when new row added
   ☑ Run when data updated
   - Delay: 0 seconds (immediate)
   - Daily limit: 100 rows
4. Click "Save"
```

### Set Up Filters
```
1. Create View: "Qualified Leads Only"
   - Filter: {Is Qualified} = true
   
2. Create View: "High Intent - Needs Review"
   - Filter: {intent_level} = "HIGH" OR "VERY HIGH"
   
3. Create View: "Messages Ready to Send"
   - Filter: {Personalized Outreach} is not empty AND {Email Sent} = false
```

---

## Part 7: Test Your Workflow

### Test Checklist

**1. Test Webhook Receipt**
```
✓ Submit form on your website with test email
✓ Check if new row appears in Clay
✓ Verify all webhook data populated correctly
```

**2. Test Enrichment Flow**
```
✓ Clearbit enriched company data
✓ Careers page scraped successfully
✓ Position count calculated
✓ News search returned results
✓ Qualification logic worked (is_qualified = true/false)
```

**3. Test Decision Maker Finding**
```
✓ LinkedIn search found correct person
✓ Email found with high confidence
✓ Title is decision-maker level (CFO, VP, etc.)
```

**4. Test Message Generation**
```
✓ Message is personalized (uses name, company, signal)
✓ Subject line is compelling
✓ Tone is professional but warm
✓ Includes calendar link
✓ Under 120 words
```

**5. Test Notifications**
```
✓ Slack message sent to correct channel
✓ Contains all relevant data
✓ Link to Clay row works
```

---

## Part 8: Monitor & Optimize

### Daily Checks (First Week)
```
Morning:
□ Review new qualified leads
□ Check enrichment success rate
□ Look for any errors/empty fields

Afternoon:
□ Review generated messages
□ Manual send to 3-5 best leads
□ Track responses

Evening:
□ Update GPT prompt based on responses
□ Adjust qualification thresholds
□ Note what's working
```

### Weekly Reviews
```
□ Response rate by signal type (hiring vs funding)
□ Best performing message styles
□ Most common data gaps
□ ROI calculation: Cost per qualified lead
```

---

## Troubleshooting Guide

### Problem: Webhook not receiving data
**Check:**
1. Is webhook URL correct in website code?
2. Any CORS errors in browser console?
3. Is website deployed correctly?

**Test:**
```
curl -X POST https://hooks.clay.com/webhook/YOUR_URL \
  -H "Content-Type: application/json" \
  -d '{"event":"test","email":"test@test.com"}'
```

### Problem: Clearbit returning empty
**Fixes:**
- Try with well-known domain (e.g., "stripe.com")
- Check if domain is valid/active
- Use HubSpot enrichment as backup

### Problem: No hiring data found
**Fixes:**
- Try alternate URLs: /jobs, /join-us, /team
- Use LinkedIn job postings API instead
- Manual research for high-value leads

### Problem: Poor message quality
**Fixes:**
- Add more context to GPT prompt
- Include 2-3 examples of good messages
- Increase temperature to 0.8 for more creativity
- Or decrease to 0.5 for more consistency

### Problem: Qualification rate too low
**Adjust thresholds:**
- Change: {Open Positions Count} > 5 → > 3
- Add: OR {Company Size} > 100
- Include: "recently launched" in news keywords

---

## Cost Optimization Tips

**Free/Cheap:**
- Use Google News instead of paid news APIs
- LinkedIn public profiles (no Sales Nav needed)
- Hunter.io free tier: 50 emails/month
- Clay's built-in scrapers

**Worth Paying For:**
- Clearbit: Best company data ($1/lookup)
- Hunter.io paid: Better email accuracy
- GPT-4: High quality, low cost ($0.04/message)
- SmartLead: High deliverability ($0.50/email)

**Skip These (At First):**
- ZoomInfo: Too expensive for startups
- Sales Navigator: Use free LinkedIn first  
- Apollo.io: Hunter.io is better for emails

---

## Interview Demo Script

**Show Them:**

1. **"Here's the webhook"** (5 sec)
   - Show webhook column in Clay
   - Point to URL

2. **"When someone visits pricing..."** (10 sec)
   - Open browser console
   - Scroll to pricing
   - Show event logged

3. **"Clay enriches the data"** (30 sec)
   - Show Clearbit column
   - Show careers scrape
   - Show qualification logic

4. **"Then finds the decision maker"** (20 sec)
   - Show LinkedIn search
   - Show Hunter.io email
   - Show high confidence score

5. **"And generates a personalized message"** (30 sec)
   - Show GPT-4 column
   - Read sample message
   - Point out personalization

6. **"All automatically"** (10 sec)
   - Show auto-run settings
   - Mention: "Happens in < 2 minutes"
   - Emphasize: "Zero manual work"

**Total demo time: 1 minute 45 seconds**

---

## Success Metrics to Share

After 1 month, you should see:
- 📊 **Conversion Rate**: 2-4% of visitors → qualified leads
- ⚡ **Speed**: Lead to outreach in < 2 minutes
- 🎯 **Accuracy**: 80%+ enrichment success rate
- 💰 **Cost**: $4-5 per qualified lead
- 📧 **Response Rate**: 8-12% (vs 1-2% for cold)

---

## You're Ready! 🚀

**For Interview:**
- Study this guide
- Know the column structure
- Understand each enrichment step
- Be ready to explain the "why" behind each decision

**For Production:**
- Follow steps 1-7
- Test thoroughly (step 8)
- Monitor daily (first week)
- Iterate based on results

**Questions During Interview?**
- "I'd set up a webhook column first..."
- "Then build enrichment in this order..."
- "The qualification logic checks if..."

You've got this! 💪