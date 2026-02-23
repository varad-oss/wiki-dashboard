**WikiDash | Enterprise-Grade Wikipedia Analytics Dashboard**

WikiDash is a high-performance React application designed to provide comprehensive, real-time data visualization and metadata analysis for Wikipedia articles. By integrating multiple RESTful APIs, the platform transforms raw academic data into actionable insights through an intuitive, data-driven user interface.

**Key Engineering Highlights**

Real-Time Data Aggregation: Orchestrates concurrent requests to the MediaWiki Action API and Wikimedia Metrics API.

Interactive Visualizations: Implements dynamic time-series charts using Chart.js to track 30-day engagement trends.

Intelligent Search Normalization: Features a pre-flight verification layer to handle case-insensitivity, redirects, and title canonicalization.

Responsive Architecture: A mobile-first, grid-based layout engineered with Tailwind CSS for seamless cross-device compatibility.

**Tech Stack**

Core: React.js (Functional Components, Hooks)

Styling: Tailwind CSS (Modern Utility-First Design)

Data Visualization: Chart.js / React-Chartjs-2

APIs: MediaWiki Action REST API, Wikimedia Pageviews REST API

Version Control: Git/GitHub

**Engineering Challenges & Technical Decisions**

1. Optimizing Asynchronous Operations (Fault Tolerance)

Challenge: Aggregating data from five distinct API endpoints created a performance bottleneck and increased the risk of total application failure if a single non-critical request failed.
Decision: Implemented Promise.allSettled instead of Promise.all.
Outcome: Enhanced the application's resilience. If the Pageviews API (external metric) is delayed or unavailable, the core article data still renders, ensuring 100% uptime for primary content while gracefully handling secondary data gaps.

2. Solving API Strictness with Title Normalization

Challenge: The Wikimedia Pageviews API is case-sensitive and strictly requires canonical titles, whereas user input is often informal (e.g., "albert einstein" vs "Albert Einstein").
Decision: Developed a "Pre-flight Search Layer" using the list=search endpoint.
Outcome: The system automatically resolves user queries to the official Wikipedia entry title before executing data fetches, eliminating 404 errors and significantly improving the Search UX.

3. Parsing Raw Wikitext to Structured UI

Challenge: The API returns raw wikitext (e.g., '''bold''', [[links]]), which is unreadable in a standard web view.
Decision: Built a custom Regex-based parsing component (WikiText.js) to sanitize and convert wikitext into semantic HTML (h3, strong, em).
Outcome: Successfully maintained the "Separation of Concerns" principle, keeping the main application logic light while delivering a clean, readable, and professional typography experience.

4. UX Optimization: Layout Refactoring

Challenge: Traditional two-column layouts caused "visual debt" and large vertical gaps when article summaries were lengthy.
Decision: Refactored the architecture to a single-column, component-stacked flow with a high-density horizontal "Stats Bar."
Outcome: Improved data readability and ensured that critical analytics are consistently positioned, regardless of content length. Added a smooth-scroll "View Analytics" trigger to bridge the gap between content and data.

**Installation & Deployment**

Clone Repository:

git clone [https://github.com/varad-oss/wiki-dashboard.git](https://github.com/varad-oss/wiki-dashboard.git)


Environment Setup:

cd wiki-dashboard
npm install


Local Execution:

npm start


The application will initialize on http://localhost:3000.
