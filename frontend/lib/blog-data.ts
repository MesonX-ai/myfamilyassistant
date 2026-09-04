export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "Guides" | "Product" | "Trust" | "Stories" | "Tips";
  author: string;
  readTime: number;
  image?: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "your-first-agent-five-minutes",
    title: "Your first agent in five minutes",
    excerpt:
      "A trigger, a model, an output — see how ordinary fixes turn into a working agent without writing glue code.",
    date: "Aug 18, 2026",
    category: "Guides",
    author: "Sarah Chen",
    readTime: 5,
    tags: ["getting-started", "agents", "tutorial"],
    content: `
# Your First Agent in Five Minutes

Building an agent has never been easier. In this guide, we'll walk you through creating your first working agent — no coding required.

## What You'll Build

By the end of this guide, you'll have a working agent that:
- Listens for a trigger (a time, event, or manual request)
- Runs a model to make a decision
- Performs an action based on the result

## Step 1: Create a New Workflow

1. Click **New Workflow** on the canvas
2. Give it a name: "My First Agent"
3. Choose a template or start blank

## Step 2: Add a Trigger

Triggers are how your agent knows when to act:

- **Time-based**: "Every Monday at 9 AM"
- **Event-based**: "When a family member texts"
- **Manual**: "When I click a button"

For your first agent, select **Manual Trigger** — you'll click a button to start it.

## Step 3: Connect a Model

Models are the brain of your agent. Connect Claude or another LLM:

1. Drag a **Model** node onto the canvas
2. Connect your trigger to the model
3. Write a simple prompt: "Remind me what I need to do today"

## Step 4: Add an Output

Outputs are where your results go:

- Send a notification
- Save to a note
- Post to a group chat
- Log to a spreadsheet

Connect the model output to an action node.

## Step 5: Test It

Click **Test Run** to see your agent in action. It should:
1. Wait for your trigger (click the button)
2. Run the model with your prompt
3. Perform the output action

Congratulations! You've built your first agent in under five minutes.

## What's Next?

Now that you understand the basics:
- Add more complex logic with conditional nodes
- Connect multiple models for advanced reasoning
- Integrate with your family's tools and services
- Set it to run automatically on a schedule

Welcome to the studio. Happy building.
    `,
  },
  {
    id: "2",
    slug: "living-canvas-agent-building",
    title: "What a living canvas means for agent building",
    excerpt:
      "Why wiring workflows visually beats hand-written graphs for debugging, iteration, and family-friendly craft.",
    date: "Aug 4, 2026",
    category: "Product",
    author: "Marcus Webb",
    readTime: 8,
    tags: ["canvas", "visual-building", "workflow"],
    content: `
# What a Living Canvas Means for Agent Building

Traditional workflow builders force you to choose: visual simplicity or powerful complexity. We built a canvas that gives you both.

## The Problem with Static Workflows

Most tools show you a fixed diagram. You wire nodes, click save, and hope your workflow works. If something breaks at 3 AM:

- You're staring at a static graph
- You can't see what data flows between nodes
- Debugging means reading logs, not seeing the problem
- Iteration is slow: save → test → hunt for the issue → repeat

## A Living Canvas

Our canvas is different. It's alive:

### Real-Time Data Visibility
Watch data flow through your workflow as it runs. Every node shows exactly what it received and what it sent. No more guessing.

### Instant Iteration
Change a prompt, reconnect a node, or add logic — and test immediately. No deploy. No waiting. Just build.

### Visual Debugging
When something goes wrong, you see it. The canvas highlights the exact point where the workflow failed, showing you the data that caused it.

### Natural Expression
Some workflows are simple: A → B → C. Others branch, loop, and make decisions. The canvas lets you express both without compromise.

## Why This Matters for Families

Building automation for your family isn't like enterprise software. You want to:

- Tinker without breaking production
- Understand how your automations work
- Share workflows with family members who aren't engineers
- Change things on the fly when plans change

A living canvas makes all of this possible.

## The Technical Side

Under the hood, the canvas maintains a graph representation of your workflow. Every connection is typed — we know what data flows where. When you test:

1. We simulate the workflow node-by-node
2. We capture the data at each step
3. We highlight the execution path in real-time
4. We show you exactly what each node decided

## What's Coming

We're adding even more to the canvas:

- **Breakpoints**: Pause workflows mid-run to inspect state
- **Replay**: Re-run a workflow with the same inputs that caused a problem
- **Collaboration**: Build together with family members in real-time
- **Performance insights**: See which nodes are slow or resource-hungry

The living canvas isn't just a better interface — it's a fundamentally different way to think about building agents. Not as static code, but as a craft you can touch, see, and iterate on.

That's the studio.
    `,
  },
  {
    id: "3",
    slug: "privacy-by-default-workflows",
    title: "Privacy by default: who can see your workflows",
    excerpt:
      "An honest look at where workflow data lives, who has access, and the controls we put in your hands.",
    date: "Jul 21, 2026",
    category: "Trust",
    author: "Elena Rodriguez",
    readTime: 7,
    tags: ["privacy", "security", "trust"],
    content: `
# Privacy by Default: Who Can See Your Workflows

We believe privacy is not a feature — it's a responsibility. Here's how we think about it, and what we do to protect your family's data.

## Where Your Data Lives

When you build a workflow, data flows through three places:

1. **Your browser**: Workflow design, editing, visualization
2. **Our servers**: Workflow execution, model calls, persistence
3. **Third-party services**: Only if you explicitly connect them (Gmail, calendar, etc.)

Each layer has different privacy guarantees.

## Your Browser

The canvas runs locally. Your workflow definitions, test runs, and the data you preview are stored in your browser cache. We don't transmit them by default.

This means:
- You can build offline
- Your workflow structure stays private until you save
- We never see a workflow you've only designed and not shared

## Our Servers

When you save and run workflows, we store:

- The workflow structure (nodes, connections, prompts)
- Execution logs (when your agent ran, how long it took)
- Model outputs (what Claude said, what action was taken)

We never store:
- Personally identifiable information, unless you explicitly put it in a prompt
- Message contents from your family's chats
- Passwords or authentication credentials

Your data is encrypted in transit (TLS) and at rest. We use key rotation and compliance with GDPR/CCPA.

## Sharing & Permissions

By default, workflows are private to you. You control who sees them:

- **Private**: Only you can view and edit
- **View-only**: Share the canvas with family members who can see but not change
- **Collaborate**: Invite others to edit your workflow together
- **Public**: Share a workflow with the community (you choose what to publish)

When you share a workflow, the person you're sharing with can see:
- The workflow structure and prompts
- Their own execution results
- NOT other people's data or execution history

## Model Calls

When your workflow calls Claude or another model:

- We send only the data your prompt requires
- The model provider (Anthropic, etc.) processes it per their privacy policy
- We don't log model inputs/outputs by default unless you enable workflow history
- You can run models on-device if you self-host

## Compliance

We comply with:
- **GDPR**: You own your data. You can export, modify, or delete any workflow and its history.
- **CCPA**: You have the right to know what we store, who we share it with, and to request deletion.
- **SOC 2 Type II**: Our infrastructure is audited annually. Access is logged.

## What We're Building

We're working on:

- **End-to-end encryption**: Workflows encrypted so only you can decrypt them
- **Local execution**: Run complex workflows entirely on your device
- **Differential privacy**: Share aggregate insights without exposing individual data
- **Privacy reports**: Transparency about what's flowing where in your workflow

## The Bottom Line

Your family's automation is yours. We're not mining it for data. We're not selling it. We're not even looking at it unless you ask us to help debug.

That's the trust we're building.
    `,
  },
  {
    id: "4",
    slug: "bill-tracking-workflow-tutorial",
    title: "Build a Family Bill Tracker in 10 Minutes",
    excerpt:
      "Automate bill tracking and share reminders with your family. A practical workflow you can start using today.",
    date: "Jul 15, 2026",
    category: "Guides",
    author: "James Park",
    readTime: 10,
    tags: ["tutorial", "finance", "automation"],
    content: `
# Build a Family Bill Tracker in 10 Minutes

Never miss a bill again. Here's a complete workflow that tracks upcoming bills and alerts your family.

## What We're Building

A workflow that:
1. Checks a shared spreadsheet for bills due this month
2. Calls Claude to summarize them in plain language
3. Sends a notification to your family chat
4. Logs everything for future reference

## Step 1: Set Up Your Data Source

Create a Google Sheet with these columns:
- Bill Name (e.g., "Electric Bill")
- Due Date (e.g., "15th")
- Amount (e.g., "$120")
- Paid? (Yes/No)

Share the sheet with your family. Get the sheet ID from the URL.

## Step 2: Create the Workflow

In the canvas:

1. Add a **Schedule Trigger** (first of every month)
2. Add a **Google Sheets** connector node
3. Configure it to read your bills sheet
4. Add a **Model** node with this prompt:

\`\`\`
Review these family bills:
{SHEET_DATA}

Create a brief, friendly summary of:
- Bills due this month
- Total amount
- Which ones are paid
- Any that need attention

Keep it under 50 words.
\`\`\`

5. Add a **Notification** output:
   - Send to: Your family group chat
   - Message: Use the model output

## Step 3: Test It

1. Click **Run Now** to test without waiting for the schedule
2. Check that it reads your sheet correctly
3. Verify the notification goes to the right place
4. Adjust the prompt if needed

## Step 4: Add Intelligence (Optional)

Want to make it smarter?

- Add a **Conditional node**: Only alert if total > $500
- Add a **Date calculation node**: Flag bills due in 3 days
- Add a **Historical lookup**: Compare this month to last month

## Tips & Tricks

### Make It Personal
Change the prompt tone. Make it funny, formal, or casual — match your family's voice.

### Add Multiple Alerts
Send one alert to the money-handler, another to the family group chat.

### Track Over Time
Log bills to a database or archive sheet to see spending trends.

### Integrate More Sources
Pull bills from credit card APIs, utility company emails, or subscription services.

## Common Customizations

**Weekly instead of monthly?**
Change the trigger to "Every Monday at 9 AM"

**Only alert about big bills?**
Add a filter: "Only include bills over $100"

**Assign responsibilities?**
Add Claude logic: "Suggest who should pay this bill based on household rules"

That's it. You now have a family bill tracker that works while you sleep.
    `,
  },
  {
    id: "5",
    slug: "meal-planning-multi-agent-workflow",
    title: "Meal Planning with Multi-Agent Workflows",
    excerpt:
      "Use multiple models to plan meals, check ingredients, and generate shopping lists automatically.",
    date: "Jul 8, 2026",
    category: "Stories",
    author: "Priya Desai",
    readTime: 12,
    tags: ["meal-planning", "multi-agent", "advanced"],
    content: `
# Meal Planning with Multi-Agent Workflows

We were planning weekly meals the old way: texts, voice memos, and spreadsheets scattered across three apps. Then we built this workflow.

## The Challenge

Every week, the same dance:
1. Mom checks the calendar for busy nights (no time for cooking)
2. Dad reviews what's in the fridge
3. Someone searches for recipes
4. Everyone argues about preferences
5. Finally, someone writes a shopping list (and forgets something)

## The Solution: Multi-Agent Workflow

Instead of humans passing information around, let models work in sequence:

**Agent 1: Calendar Planner**
- Reads your family calendar
- Identifies busy nights (order food, quick meals)
- Flags special occasions (celebrations, guests coming)

**Agent 2: Inventory Manager**
- Checks your grocery inventory
- Notes what's expiring soon (use first!)
- Identifies dietary restrictions

**Agent 3: Meal Generator**
- Takes output from Agents 1 & 2
- Generates meal suggestions for each day
- Considers preferences and time constraints

**Agent 4: Shopping List**
- Takes the meal plan
- Creates a consolidated shopping list
- Groups items by store section
- Removes items you already have

**Agent 5: Communication**
- Shares the plan with your family
- Formats it nicely (dinner theme, special notes)
- Posts to your family group chat

## How It Works

The workflow:

\`\`\`
Calendar Trigger (Weekly, Sunday 6 PM)
        ↓
Read Calendar → (busy nights, events)
        ↓
Read Inventory → (available items, expiring soon)
        ↓
Generate Meals → (respects constraints, time, preferences)
        ↓
Create Shopping List → (consolidated, organized)
        ↓
Send Notification → (family sees plan + shopping list)
\`\`\`

## The Prompts

**Meal Generator Prompt:**
\`\`\`
Plan a week of meals for a family of 4.

Calendar constraints:
{CALENDAR_DATA}

Available ingredients:
{INVENTORY_DATA}

Preferences:
- Vegetarian nights: Monday, Thursday
- Quick meals: Tuesday, Wednesday (under 30 min)
- Celebration dinner: Saturday (guest coming)

For each day, provide:
1. Meal name
2. Time estimate
3. Key ingredients needed
4. 3-sentence description

Format as JSON for easy parsing.
\`\`\`

**Shopping List Prompt:**
\`\`\`
Create a shopping list from these meals:
{MEAL_PLAN}

Inventory we have:
{CURRENT_INVENTORY}

Rules:
1. Don't include items we already have
2. Group by store section (produce, dairy, meat, etc.)
3. Note quantities
4. Flag any specialty items
5. Estimate total cost

Format as a bulleted list.
\`\`\`

## Results

After running this workflow for 3 weeks:

- **30 minutes saved per week**: No more back-and-forth texts
- **Less food waste**: Items expiring soon are prioritized
- **Better variety**: The model suggests dishes we wouldn't have thought of
- **Happier family**: Everyone sees the plan at once and can object early

## How to Build It

1. Connect your calendar (Google Calendar, Outlook)
2. Set up an inventory tracking sheet (manual or RFID scanner)
3. Create the meal planning workflow with the prompts above
4. Test with this week's data
5. Schedule it to run every Sunday

## Customizations

**Add Nutritional Goals:**
"Ensure at least 3 servings of vegetables per day"

**Budget Constraints:**
"Keep shopping list under $100"

**Allergy Management:**
Pull allergies from family profiles and filter recipes

**Restaurant Integration:**
On busy nights, suggest local restaurants instead of cooking

**Feedback Loop:**
Every family member rates meals (thumbs up/down) → model learns preferences

## The Bigger Picture

This workflow shows what multi-agent systems can do for families:

- One person (the model) gathers data
- Another person (model) analyzes constraints
- A third generates options
- A fourth formats the output
- A fifth communicates to humans

You're not replacing humans with AI — you're using AI to do the coordination work so humans can focus on what matters (deciding if we like the plan, not managing the logistics).

That's the real power of agentic workflows.
    `,
  },
  {
    id: "6",
    slug: "workflow-templates-library",
    title: "We're Building a Workflow Templates Library",
    excerpt:
      "Ready-made workflows for common family needs. No building required — just customize and run.",
    date: "Jun 30, 2026",
    category: "Product",
    author: "Alex Kim",
    readTime: 6,
    tags: ["templates", "announcements", "product"],
    content: `
# We're Building a Workflow Templates Library

Starting today, you can browse ready-made workflows created by our team and the community. Pick one, customize it, and start automating.

## What's in the Library (Initial Release)

**Family Organization**
- Weekly meal planner
- Bill tracker and reminder
- Chore scheduler
- Trip coordinator

**Communication**
- Weekly family digest (from your calendar, weather, news)
- Birthday reminder (3 weeks before)
- Anniversary tracker
- Group chat summarizer

**Finance**
- Budget tracker
- Savings goal monitor
- Investment portfolio digest
- Expense categorizer

**Learning & Development**
- Study schedule planner
- Vocabulary builder (daily words + quiz)
- Reading list manager
- Skill tracker

**Home & Garden**
- Plant watering reminder
- Home maintenance schedule
- Garden planner
- Energy usage monitor

## How Templates Work

1. **Browse the library**: Filter by category, time commitment, complexity
2. **Preview**: See exactly how the workflow is built
3. **Customize**: Adjust prompts, data sources, notifications
4. **Deploy**: One click to activate
5. **Modify**: Edit anytime as your needs change

## Why Templates?

Feedback from early users:
> "I love the idea but don't know where to start"
> "I want to automate something but don't want to build from scratch"
> "I'd learn faster if I started with a working example"

Templates solve all of these. They're:

- **Educational**: See best practices in action
- **Time-saving**: 10 minutes to a working workflow
- **Customizable**: Templates are just starting points
- **Shareable**: Build a template, share with the community

## Community Templates

We're launching with our templates. But the real magic is community-built workflows.

Next month:
- Vote on new templates
- Submit your own workflows
- Get featured on our blog
- Earn reputation as a builder

## What's Coming

We're actively working on:

- **Template versioning**: Community votes on the best versions
- **Template marketplace**: Monetize if you want
- **Analytics**: See how many people use your template
- **Forums**: Help people customize your templates
- **AI recommendations**: "Based on your workflows, you might like this template"

## Try One Today

Go to **Resources → Templates** and pick one that resonates with you. 

We can't wait to see what you build.
    `,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((post) => post.tags.includes(tag));
}
