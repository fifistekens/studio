# **App Name**: Invoicify Pro

## Core Features:

- Data Fetching and Display: Fetch data from the specified API endpoint (e.g., `/rpt_BureauUsageInputCatReport`) based on user-defined parameters and display it in a tabular format. Allow users to define the endpoint via a configuration setting.
- Interactive Data Grid: Implement sorting (single and multiple fields), filtering (by userId dropdown and title search with highlighting), field selection (show/hide columns), pagination with adjustable page size, and responsive grid UI.  Include post detail modal on click.
- Data Export: Add export functionality for CSV, Excel (XLSX), and PDF formats based on the currently filtered view.
- Data Visualization: Generate a chart (e.g., posts per user) to visualize the data.  Use a library like Chart.js or Recharts.

## Style Guidelines:

- Primary color: Dark green (#004d40) with a subtle gradient for the default theme.
- Secondary color for default theme: Light green (#a5d6a7) for backgrounds and subtle contrasts.
- Accent color for default theme: Teal (#008080) for interactive elements and highlights.
- Dark Theme Primary Color: Dark Gray (#212121) for a sleek, modern look.
- Dark Theme Secondary Color: Light Gray (#e0e0e0) for text and UI elements on the dark background.
- Dark Theme Accent Color: Indigo (#3f51b5) for interactive elements and highlights in dark theme.
- Modern, clean layout with a sidebar for navigation and a main content area for data display.
- Use a consistent set of icons for navigation and actions, such as export, filter, and sort.
- Subtle transitions and animations for a smooth user experience when filtering, sorting, or paginating data.