WikiDash: Real-Time Wikipedia Analytics Dashboard
WikiDash is a dynamic, single-page web application built with React and Tailwind CSS that provides a deep-dive analysis of any Wikipedia article. Users can enter a page title to fetch and display a rich set of statistics, metadata, and engagement metrics in a clean, intuitive, and visually appealing interface.

Features
Core Page Information: View the Page Title, ID, and total length in bytes.

Edit History: See the creation date, date of the last edit, the username of the last editor, and the total number of unique editors.

Content Analysis: Read the full introductory summary with formatted headings, and view the article's main thumbnail.

Connectivity: Browse scrollable lists of all pages the article links to and all pages that link back to it.

Audience Engagement Metrics:

Visualize the daily page views for the last 30 days with an interactive chart.

View total and average daily page views.

See the number of languages the article is available in.

User-Friendly Interface:

A robust search that handles case-insensitivity and redirects.

A "View Analytics" button for quickly navigating to the data visualizations.

Clear loading and error states to ensure a smooth user experience.

Tech Stack
Frontend: React.js

Styling: Tailwind CSS

Charts & Visualization: Chart.js (with react-chartjs-2)

API: MediaWiki Action API & Wikimedia Pageviews API

Setup and Running the Project
Follow these instructions to get the project running on your local machine.

Prerequisites
You must have Node.js and npm (Node Package Manager) installed on your computer. You can download them from the official Node.js website.

Installation & Setup
Clone the repository to your local machine:

git clone [https://github.com/your-username/wiki-dashboard.git](https://github.com/your-username/wiki-dashboard.git)

Navigate into the project directory:

cd wiki-dashboard

Install all the necessary dependencies:

npm install

Running the Application
Start the development server:

npm start

Open your browser: The application will automatically open in your default browser at http://localhost:3000.

Usage
The application loads with a default search term (e.g., "Lana Rhoades").

Enter any Wikipedia article title into the search bar.

Click the "Analyze" button to fetch the data.

Once the data is loaded, the dashboard will populate with the article's summary and statistics.

If the article summary is long, a "View Analytics" button will appear. Click it to smoothly scroll down to the page views chart and other metrics.

Challenges and Technical Decisions
This project involved several challenges related to handling real-world, asynchronous data and presenting it effectively. Here’s an overview of the key problems and the solutions implemented.

1. Challenge: API Performance and Concurrency
Problem: Fetching all the required data points (core info, links, revisions, pageviews, etc.) required multiple API calls. Making these calls sequentially would result in a slow and unresponsive user experience.

Technical Decision: Orchestrate all API calls to run concurrently using Promise.allSettled.

Reasoning: Promise.allSettled was chosen over Promise.all for its resilience. The Wikimedia Pageviews API sometimes fails for new or obscure articles. With Promise.allSettled, a failure in this non-critical endpoint does not prevent the rest of the dashboard from loading. The application can gracefully handle the missing data (e.g., by showing "0" views) instead of showing a complete error to the user.

2. Challenge: Handling Inconsistent API Behavior
Problem: Different Wikipedia APIs have different requirements. The main query API is flexible with search terms (e.g., "albert einstein" works), but the Pageviews API is strict and requires the exact, correctly-capitalized page title ("Albert Einstein"). This caused 404 Not Found errors for case-insensitive searches.

Technical Decision: Implement a "pre-flight" API call. Before fetching the main data, the application first uses the flexible list=search endpoint to find the official, canonical title for the user's query. This correct title is then used for all subsequent, stricter API calls.

Reasoning: This two-step process makes the application much more robust and user-friendly, as it accommodates natural user input without breaking.

3. Challenge: Parsing and Displaying Raw Wikitext
Problem: The API returns the article summary as raw "wikitext," including markup like == Section Heading ==, [[Internal Link|Display Text]], and '''bold text'''. Displaying this raw text is unreadable and unprofessional.

Technical Decision: Create a dedicated React component (WikiText.js) to parse and format this content.

Reasoning: Encapsulating this logic in a separate component follows the principle of separation of concerns. The component uses regular expressions to identify and replace wikitext syntax with appropriate HTML tags (<h3>, <strong>, <em>). This keeps the main App.js component clean and focused on layout and state management, while the WikiText component handles the complex task of presentation.

4. Challenge: Responsive and Clean Layout
Problem: The initial two-column layout created awkward, large empty spaces when an article summary was significantly longer than the list of stats. This led to a visually unbalanced and unprofessional appearance.

Technical Decision: Refactor the layout to a more modern, single-column flow. The core stats were moved into a compact, horizontal "stats bar" below the main summary. The rest of the content (analytics, link lists) is stacked vertically in its own distinct sections.

Reasoning: This vertical flow is more robust and naturally responsive. It eliminates the empty space problem and ensures the layout is clean and logical on all screen sizes, from mobile devices to large desktops.