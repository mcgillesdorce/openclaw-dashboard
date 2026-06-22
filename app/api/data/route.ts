/**
 * API route to fetch dashboard data from GitHub
 * Server-side fetch avoids CORS issues
 */

export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function GET() {
  try {
    const [billingRes, dashboardRes] = await Promise.all([
      fetch(
        'https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/billing_data.json',
        { cache: 'no-store' }
      ),
      fetch(
        'https://raw.githubusercontent.com/mcgillesdorce/openclaw-dashboard/data/dashboard_data.json',
        { cache: 'no-store' }
      )
    ]);

    if (!billingRes.ok || !dashboardRes.ok) {
      return Response.json(
        {
          error: `GitHub fetch failed: ${billingRes.status} ${dashboardRes.status}`,
          billing: null,
          dashboard: null
        },
        { status: 200 } // Return 200 with error flag so client can handle it
      );
    }

    const billing = await billingRes.json();
    const dashboard = await dashboardRes.json();

    return Response.json(
      { error: null, billing, dashboard },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
        }
      }
    );
  } catch (error) {
    console.error('Data fetch error:', error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        billing: null,
        dashboard: null
      },
      { status: 200 }
    );
  }
}
