# Molly's Job Search Assistant

A personal job tracking and AI-powered resume tailoring tool built as a single HTML file.

## Features

- **Job Tracking**: Add, edit, delete, and filter job postings
- **Status Management**: Track applications through Saved → Applied → Interviewing → Offer/Rejected
- **Smart Filtering**: Search by title, company, or keywords; filter by type (Agency, Pharma) and fit level
- **Resume Management**: Store and manage multiple base resumes
- **AI Resume Tailoring**: Demo mode with keyword matching to tailor resumes to job descriptions
- **Local Storage**: All data persists in your browser's localStorage

## Getting Started

Simply open `index.html` in your browser, or run a local server:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Usage

1. **Jobs Tab**: View and manage job postings
   - Click "+ Add Job" to add new opportunities
   - Use filters to narrow down by type or fit level
   - Update status as you progress through applications
   - Edit or delete jobs as needed

2. **Resumes Tab**: Manage your resumes
   - Click "+ Add Resume" to store a base resume
   - Click "✨ Tailor" to tailor a resume to a job description
   - Edit or delete resumes as needed

## Tech Stack

- Pure HTML, CSS, and JavaScript
- No build tools or dependencies required
- localStorage for data persistence
- Demo AI tailoring using keyword matching

## Future Enhancements

- Add real OpenAI API integration for smarter tailoring
- Export tailored resumes as PDF
- Add application deadline tracking
- Include interview notes and follow-up reminders
