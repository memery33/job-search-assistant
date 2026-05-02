export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeContent, jobDescription } = req.body;

  if (!resumeContent || !jobDescription) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume writer. Your task is to tailor a resume to better match a job description.

CRITICAL RULES:
1. MAINTAIN the original structure and formatting of the resume
2. KEEP all bullet points and job entries - do not remove any experience
3. Do NOT reorganize sections or move jobs to different positions
4. FOCUS on: rewording bullet points to use keywords from the job description, highlighting relevant skills, and emphasizing experience that matches the job requirements
5. PRESERVE all dates, company names, and factual information
6. ONLY modify the wording and emphasis, not the structure
7. If a skill is highly relevant to the job, make it more prominent in the bullet point wording

Return the complete, tailored resume with the same structure as the original.`
          },
          {
            role: 'user',
            content: `Job Description:\n${jobDescription}\n\nCurrent Resume:\n${resumeContent}\n\nPlease tailor this resume to better match the job description while maintaining the original structure and all content.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || 'API request failed' });
    }

    const data = await response.json();
    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
