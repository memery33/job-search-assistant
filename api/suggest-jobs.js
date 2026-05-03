export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile } = req.body;

  if (!profile) {
    return res.status(400).json({ error: 'Missing profile data' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are a career advisor and job search expert. Given a user's profile, suggest 5 real, specific job postings that would be a strong match. These should be realistic roles that exist at real companies.

For each job, provide:
- title: The exact job title
- company: A real company that typically hires for this role
- type: One of: full-time, part-time, contract, freelance, internship
- workModel: One of: remote, hybrid, onsite
- salary: Realistic salary range for the role and experience level
- location: Where the role would be based
- description: 2-3 sentence description of the role
- requirements: Key qualifications (1-2 sentences)
- fitNotes: Why this is a good match for the user (1-2 sentences)
- searchQuery: A URL-safe search string like "Senior Product Manager Google" (just the role + company, no URL encoding needed)

Do NOT include a "url" field. Return ONLY a JSON array of 5 job objects. No markdown, no explanation, just the JSON array.`,
        messages: [
          {
            role: 'user',
            content: `Find matching jobs for this person:
- Name: ${profile.displayName || 'Not provided'}
- Industry: ${profile.industry || 'Not specified'}
- Target Role: ${profile.targetRole || 'Not specified'}
- Experience Level: ${profile.experienceLevel || 'Not specified'}
- Preferred Work Model: ${profile.preferredWorkModel || 'Any'}
- Preferred Location: ${profile.preferredLocation || 'Anywhere'}
- Target Salary: ${profile.targetSalary || 'Not specified'}
- Additional Notes: ${profile.notes || 'None'}

Return 5 job suggestions as a JSON array.`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'API request failed' });
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Parse the JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse job suggestions' });
    }

    const jobs = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
