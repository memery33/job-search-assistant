export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeContent, jobDescription } = req.body;

  if (!resumeContent || !jobDescription) {
    return res.status(400).json({ error: 'Missing required fields' });
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
        system: `You are an expert resume writer. Your task is to tailor a resume to better match a job description by REWORDING and EMPHASIZING relevant content.

WHAT YOU MUST DO:
1. REWORD bullet points to include keywords and phrases from the job description
2. EMPHASIZE skills and experience that directly match the job requirements
3. STRENGTHEN action verbs to be more impactful
4. ADD context to bullet points that align with what the job is looking for
5. Move the most relevant experience and skills to the TOP of each section
6. REORDER bullet points within each job to put the most relevant ones first
7. MARK all changes by wrapping modified text in double asterisks: **changed text**

WHAT YOU MUST NOT DO:
1. Remove any jobs or experience
2. Change dates or company names
3. Add completely new skills or experience not in the original resume
4. Change the overall resume structure (sections, job order)

EXAMPLE TRANSFORMATION:
Original: "Managed team of 5 developers"
Job wants: "leadership" and "agile"
Tailored: "**Led** **agile** development team of 5 developers, **implementing Scrum methodologies** and **improving delivery speed by 30%**"

Return the COMPLETE tailored resume with the same overall structure but with significantly improved content that matches the job description. ALL changes must be marked with **double asterisks**.`,
        messages: [
          {
            role: 'user',
            content: `Job Description:\n${jobDescription}\n\nCurrent Resume:\n${resumeContent}\n\nPlease tailor this resume to better match the job description while maintaining the original structure and all content.`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'API request failed' });
    }

    const data = await response.json();
    return res.status(200).json({ result: data.content[0].text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
