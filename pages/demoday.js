import { useEffect, useState } from 'react';

export default function DemoDay() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('https://artist-spotlight-hub.vercel.app', {
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        let html = await response.text();
        
        // Replace asset paths to use local rewrites
        html = html.replace(/\/assets\//g, '/demo-assets/');
        
        setContent(html);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}
