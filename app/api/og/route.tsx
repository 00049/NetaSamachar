import { ImageResponse } from 'next/og';
import { POLITICIANS, PARTIES } from '@/data/politicians';

export const runtime = 'edge';

// We should ideally load fonts, but we can use the default sans-serif for simplicity if fetching fonts isn't strictly necessary.
// For a production app, we would load the 'Inter' or 'Playfair Display' font buffers here.

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // If an ID is provided, generate a specific politician share card
    const id = searchParams.get('id');

    if (id) {
      const politician = POLITICIANS.find((p) => p.id === id);
      const party = politician ? PARTIES.find(p => p.id === politician.partyId) : null;
      
      if (politician) {
        // Calculate an overall score based on the methodology (simplified version here for display)
        const score = Math.round((politician.promisesFulfilled / Math.max(politician.promisesTotal, 1)) * 40 + (politician.attendancePercent * 0.3) + (politician.criminalCases.length > 0 ? 0 : 30));

        return new ImageResponse(
          (
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#090B12',
                backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1e2e 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1e2e 2%, transparent 0%)',
                backgroundSize: '100px 100px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '1000px',
                  padding: '60px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '600px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', width: '48px', height: '48px', borderRadius: '12px', border: '2px solid #22C55E', alignItems: 'center', justifyContent: 'center', background: 'rgba(34, 197, 94, 0.1)', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                      N
                    </div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '24px', letterSpacing: '0.1em', fontWeight: 'bold', textTransform: 'uppercase' }}>Neta Samachar</span>
                  </div>
                  <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#F5F5F7', margin: '20px 0 10px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                    {politician.name}
                  </h1>
                  <div style={{ fontSize: '32px', color: '#A1A1AA', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {party?.name || politician.partyId} • {politician.position}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', width: '240px', height: '240px', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.1)' }}>
                    {politician.photoUrl ? (
                      <img src={politician.photoUrl} width={240} height={240} style={{ objectFit: 'cover' }} alt={politician.name} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.05)' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', background: 'rgba(230, 177, 106, 0.1)', border: '1px solid rgba(230, 177, 106, 0.3)', color: '#e6b16a', padding: '12px 24px', borderRadius: '8px', fontSize: '28px', fontWeight: 'bold' }}>
                    Score: {score} / 100
                  </div>
                </div>
              </div>
            </div>
          ),
          {
            width: 1200,
            height: 630,
          }
        );
      }
    }

    // Default site-wide share image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#090B12',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1e2e 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1e2e 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', width: '100px', height: '100px', borderRadius: '24px', border: '4px solid #22C55E', alignItems: 'center', justifyContent: 'center', background: 'rgba(34, 197, 94, 0.1)', color: 'white', fontSize: '48px', fontWeight: 'bold' }}>
              N
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'white', fontSize: '48px', letterSpacing: '0.2em', fontWeight: 'bold', lineHeight: 1.1 }}>NETA</span>
              <span style={{ color: 'white', fontSize: '48px', letterSpacing: '0.2em', fontWeight: 'bold', lineHeight: 1.1 }}>SAMACHAR</span>
            </div>
          </div>
          <p style={{ fontSize: '40px', color: '#A1A1AA', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
            Independent, non-partisan platform for political transparency and accountability.
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
