/**
 * Content Articles Seeder
 * Provides rich article content for OContentPreviews.
 * Each article has: id, title, summary, category, and full markdown article body.
 */
export interface ContentArticle {
  id: string
  title: string
  summary: string
  category: string
  article: string
}

export const contentArticles: ContentArticle[] = [
  {
    id: 'freelancing-guide',
    title: 'The Complete Guide to Freelancing',
    summary: 'How to land your first client in 30 days using LinkedIn and cold outreach.',
    category: 'Freelancing',
    article: `
## The Complete Guide to Freelancing

### Week 1: Set Your Foundation

Before reaching out to anyone, you need a solid foundation. Define your niche — are you a writer, developer, designer, or consultant? Narrowing your focus makes you more compelling to clients.

**Action steps:**
- Choose 1-2 core services you'll offer
- Set competitive but not desperate rates (research on Upwork and Fiverr for benchmarks)
- Create a portfolio with 3 showcase pieces (even personal projects count)

### Week 2: Build Your Brand

Your LinkedIn profile is your storefront. Optimize it:
- **Headline:** "[Your Role] | Helping [target audience] achieve [result]"
- **About section:** Tell your story in first person. What problem do you solve?
- **Featured section:** Pin your portfolio pieces

### Week 3: Cold Outreach That Works

Don't spam. Research 10-15 companies or individuals who need your services. Craft personalized messages:
> "Hi [Name], I noticed [specific observation about their business]. I recently helped [similar client] achieve [result] and thought you might find value in a similar approach. Would you be open to a 15-minute chat?"

### Week 4: Close and Deliver

When you get a yes, send a simple proposal with:
1. Problem statement
2. Your approach
3. Timeline and deliverables
4. Price and payment terms

Deliver excellent work, ask for a testimonial, and ask for referrals. Your first client is the hardest — after that, momentum builds.
`,
  },
  {
    id: 'passive-income-blueprint',
    title: 'Passive Income Blueprint',
    summary: 'Build a portfolio of revenue streams that generate income around the clock.',
    category: 'Investing',
    article: `
## Passive Income Blueprint

### Understanding Passive Income

True passive income doesn't mean "zero work" — it means building systems that generate revenue with minimal ongoing effort after the initial setup.

### Stream 1: Digital Products ($500-2,000/month)

Create once, sell forever. Top options:
- **Templates:** Notion templates, spreadsheet models, design kits
- **E-books:** Short, focused guides solving a specific problem
- **Online courses:** Record once, sell via Gumroad or Teachable

### Stream 2: Affiliate Marketing ($300-1,500/month)

Recommend products you genuinely use:
1. Join Amazon Associates, ShareASale, or Impact
2. Create content (blog posts, YouTube videos, social threads) around the product
3. Disclose affiliate relationships (required by law)
4. Focus on high-commission items: software subscriptions, courses, premium tools

### Stream 3: Content Monetization ($200-2,000/month)

Build an audience and monetize:
- **YouTube:** Ad revenue + sponsorships at 1,000+ subscribers
- **Medium Partner Program:** Get paid per read
- **Newsletter:** Sponsorships at 1,000+ subscribers

### Stream 4: Dividend Investing ($50-500/month)

Long-term wealth building:
- Invest in dividend aristocrats (companies with 25+ years of dividend increases)
- Reinvest dividends automatically
- Start small — even $100/month compounds over decades

### The Stacking Principle

Don't try all at once. Build Stream 1, stabilize it, then add Stream 2. Each stream reduces your dependency on any single source.
`,
  },
  {
    id: 'ecommerce-starter-kit',
    title: 'E-Commerce Starter Kit',
    summary: 'Launch a profitable online store in a weekend with zero inventory.',
    category: 'E-Commerce',
    article: `
## E-Commerce Starter Kit: Zero to Launch in 48 Hours

### Hour 1-4: Validate Your Idea

Before building anything, validate:
1. Search for your product idea on Google Trends
2. Check Amazon reviews for pain points in existing products
3. Look at Etsy and eBay for competition and pricing
4. Use free keyword tools to estimate search volume

**Red flags:** Oversaturated market, razor-thin margins (<30%), legal/regulatory barriers

### Hour 4-8: Choose Your Model

**Print-on-Demand (recommended for beginners):**
- Platforms: Printful, Printify, Gelato
- Connect to: Shopify, Etsy, or WooCommerce
- Products: T-shirts, hoodies, mugs, phone cases, tote bags

**Dropshipping:**
- Best with niche suppliers (not AliExpress clones)
- Use Spocket or DSers for faster shipping
- Focus on 5-15 day delivery windows

### Hour 8-16: Build Your Store

**Shopify (fastest path):**
1. Sign up and choose a free theme (Dawn is solid)
2. Add 5-10 products with good mockups
3. Write product descriptions that address pain points
4. Set up payments (Shopify Payments + PayPal)
5. Configure shipping rates

### Hour 16-24: Marketing Setup

- Create Instagram/TikTok accounts with your brand name
- Set up a simple welcome email sequence
- Install Meta Pixel and Google Analytics

### Hour 24-48: Launch and Learn

- Post 3 pieces of content on social media
- Set a modest ad budget ($5-10/day) to test audiences
- Offer a launch discount
- Track everything — data beats intuition

### Ongoing: The 80/20 Rule

80% of your revenue will come from 20% of products. Identify your winners and double down. Cut losers quickly.
`,
  },
]

/**
 * Get a content article by its ID.
 */
export function getContentArticleById(id: string): ContentArticle | undefined {
  return contentArticles.find((a) => a.id === id)
}
