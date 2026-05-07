import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface NextServiceDate {
  label: string;
  date: string; // YYYY-MM-DD
}

interface VehicleSpecs {
  fuelType: string;
  standard: string;
  engineCC?: number;
  transmission?: string;
  fuelEfficiency?: number;
  vehicleType: string;
  age: number;
}

interface EmissionResults {
  CO2: number;
  NOx: number;
  PM25: number;
  CO: number;
  HC: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  }).format(d);
}

function getEmissionLevel(co2: number): { color: string; bg: string; border: string; label: string } {
  if (co2 < 2) return { color: '#1B5E20', bg: '#E8F5E9', border: '#A5D6A7', label: 'Low' };
  if (co2 < 4) return { color: '#E65100', bg: '#FFF3E0', border: '#FFCC80', label: 'Moderate' };
  if (co2 < 7) return { color: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A', label: 'High' };
  return { color: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A', label: 'Critical' };
}

function getScoreStyle(score: number): { color: string; bg: string; border: string; label: string; icon: string } {
  if (score >= 85) return { color: '#1B5E20', bg: '#E8F5E9', border: '#A5D6A7', label: 'Excellent', icon: 'check_circle' };
  if (score >= 60) return { color: '#E65100', bg: '#FFF3E0', border: '#FFCC80', label: 'Needs Attention', icon: 'warning' };
  return { color: '#B71C1C', bg: '#FFEBEE', border: '#EF9A9A', label: 'High Risk', icon: 'error' };
}

// ── Email HTML Builder ──────────────────────────────────────────────────────────

function buildEmailHTML(payload: {
  vehicleName: string;
  vehicleImageUrl?: string;
  vehicleSpecs: VehicleSpecs;
  emissionResults: EmissionResults;
  maintenanceScore: number;
  nextServiceDates: NextServiceDate[];
  recommendations?: { title: string; description: string }[];
}): string {
  const { vehicleName, vehicleImageUrl, vehicleSpecs, emissionResults, maintenanceScore, nextServiceDates, recommendations } = payload;
  const emLevel = getEmissionLevel(emissionResults.CO2);
  const scoreStyle = getScoreStyle(maintenanceScore);

  // ── Color tokens mirroring the app's MD3 light theme
  const C = {
    bg:           '#F4F7F2',
    surface:      '#FFFFFF',
    surfaceVar:   '#EEF2EC',
    primary:      '#2E7D32',
    primaryLight: '#E8F5E9',
    primaryBorder:'#A5D6A7',
    onPrimary:    '#FFFFFF',
    outline:      '#C8D8C6',
    outlineVar:   '#E0EBE0',
    onSurface:    '#1C1B1F',
    onSurfaceVar: '#49454F',
    muted:        '#79747E',
    secondary:    '#00796B',
  };

  // ── Metric cards row
  const metrics = [
    { label: 'CO&#8322;',   value: emissionResults.CO2.toFixed(2),              unit: 'gm / day', color: emLevel.color,  bg: emLevel.bg,     border: emLevel.border },
    { label: 'NOx',         value: (emissionResults.NOx  * 1000).toFixed(1),    unit: 'g / day',  color: '#5B21B6',      bg: '#EDE9FE',      border: '#C4B5FD' },
    { label: 'PM2.5',       value: (emissionResults.PM25 * 1000).toFixed(2),    unit: 'g / day',  color: '#1D4ED8',      bg: '#EFF6FF',      border: '#BFDBFE' },
    { label: 'CO',          value: (emissionResults.CO   * 1000).toFixed(1),    unit: 'g / day',  color: '#BE185D',      bg: '#FDF2F8',      border: '#F9A8D4' },
    { label: 'HC',          value: (emissionResults.HC   * 1000).toFixed(1),    unit: 'g / day',  color: '#065F46',      bg: '#ECFDF5',      border: '#6EE7B7' },
  ];

  const metricsHtml = metrics.map(m => `
    <td style="padding:0 5px;vertical-align:top;">
      <div style="background:${m.bg};border:1.5px solid ${m.border};border-radius:14px;padding:14px 10px;text-align:center;min-width:70px;">
        <div style="font-size:1.25rem;font-weight:800;color:${m.color};font-family:Georgia,serif;line-height:1.1;">${m.value}</div>
        <div style="font-size:0.6rem;color:${C.muted};text-transform:uppercase;letter-spacing:0.07em;margin:3px 0;">${m.unit}</div>
        <div style="font-size:0.75rem;font-weight:700;color:${m.color};">${m.label}</div>
      </div>
    </td>`).join('');

  // ── Spec chips
  const specChips = [
    vehicleSpecs.fuelType?.toUpperCase(),
    vehicleSpecs.standard?.replace('bs', 'BS-').toUpperCase(),
    vehicleSpecs.vehicleType,
    vehicleSpecs.engineCC ? `${vehicleSpecs.engineCC}cc` : '',
    vehicleSpecs.transmission,
    vehicleSpecs.fuelEfficiency ? `${vehicleSpecs.fuelEfficiency} km/l` : '',
    `${vehicleSpecs.age} yr${vehicleSpecs.age !== 1 ? 's' : ''} old`,
  ].filter(Boolean);

  const specChipsHtml = specChips.map(chip => `
    <span style="display:inline-block;background:${C.surfaceVar};border:1.5px solid ${C.outline};border-radius:20px;padding:4px 12px;font-size:0.72rem;font-weight:600;color:${C.onSurfaceVar};margin:3px 3px;">${chip}</span>
  `).join('');

  // ── Service date tiles
  const serviceColors = [
    { text: C.primary,   bg: C.primaryLight,  border: C.primaryBorder, icon: '&#128292;' },
    { text: '#00796B',   bg: '#E0F2F1',        border: '#80CBC4',       icon: '&#127807;' },
    { text: '#1565C0',   bg: '#E3F2FD',        border: '#90CAF9',       icon: '&#9989;'   },
  ];

  const serviceDatesHtml = nextServiceDates.map((item, i) => {
    const sc = serviceColors[i % serviceColors.length];
    return `
    <td style="padding:0 6px;vertical-align:top;width:33%;">
      <div style="background:${sc.bg};border:1.5px solid ${sc.border};border-top:3px solid ${sc.text};border-radius:14px;padding:16px 12px;text-align:center;">
        <div style="font-size:1.5rem;margin-bottom:8px;">${sc.icon}</div>
        <div style="font-size:0.72rem;font-weight:700;color:${sc.text};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">${item.label}</div>
        <div style="font-size:0.88rem;font-weight:700;color:${C.onSurface};line-height:1.3;">${formatDate(item.date)}</div>
      </div>
    </td>`;
  }).join('');

  // ── AI Recommendations
  const recsHtml = recommendations && recommendations.length > 0
    ? recommendations.slice(0, 3).map((rec, i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1.5px solid ${C.outlineVar};">
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
              <td style="width:36px;vertical-align:top;padding-right:12px;">
                <div style="width:32px;height:32px;background:${C.primaryLight};border:1.5px solid ${C.primaryBorder};border-radius:10px;text-align:center;line-height:32px;font-size:1rem;">
                  ${i === 0 ? '&#9749;' : i === 1 ? '&#128161;' : '&#9889;'}
                </div>
              </td>
              <td style="vertical-align:top;">
                <div style="font-weight:700;font-size:0.88rem;color:${C.onSurface};margin-bottom:3px;">${rec.title}</div>
                <div style="font-size:0.8rem;color:${C.onSurfaceVar};line-height:1.5;">${rec.description}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`).join('')
    : '';

  // ── Vehicle image
  const imageHtml = vehicleImageUrl
    ? `<div style="text-align:center;margin-bottom:20px;">
        <img src="${vehicleImageUrl}" alt="${vehicleName}"
          style="max-width:100%;max-height:200px;object-fit:cover;border-radius:16px;border:1.5px solid ${C.outlineVar};display:block;margin:0 auto;" />
       </div>`
    : '';

  // ── Gauge bar (text-safe for email clients)
  const gaugeWidth = Math.min(100, maintenanceScore);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Emission Report – ${vehicleName}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:'Google Sans','Roboto',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${C.bg};padding:24px 0;">
  <tr><td align="center">

  <!-- Main container -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

    <!-- ── HEADER ──────────────────────────────────────────────── -->
    <tr>
      <td style="background:${C.primary};border-radius:24px 24px 0 0;padding:32px 32px 28px;text-align:center;">
        <!-- Logo row -->
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom:16px;">
          <tr>
            <td style="width:40px;height:40px;background:rgba(255,255,255,0.18);border-radius:12px;text-align:center;vertical-align:middle;font-size:1.3rem;padding:6px;">
              &#127807;
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <span style="font-size:1.4rem;font-weight:800;color:#FFFFFF;letter-spacing:-0.3px;">Emission-Sense</span>
            </td>
          </tr>
        </table>
        <h1 style="margin:0 0 6px;font-size:1.55rem;font-weight:800;color:#FFFFFF;line-height:1.25;">${vehicleName}</h1>
        <p style="margin:0;font-size:0.85rem;color:rgba(255,255,255,0.75);">Your personalised vehicle emission report</p>
      </td>
    </tr>

    <!-- ── VEHICLE CARD ─────────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:24px 28px 20px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        ${imageHtml}
        <!-- Spec chips -->
        <div style="text-align:center;margin-bottom:4px;">
          ${specChipsHtml}
        </div>
        <!-- Emission class badge -->
        <div style="text-align:center;margin-top:12px;">
          <span style="display:inline-block;background:${emLevel.bg};border:1.5px solid ${emLevel.border};border-radius:20px;padding:6px 18px;font-size:0.78rem;font-weight:700;color:${emLevel.color};letter-spacing:0.05em;">
            &#11044;&nbsp; ${emLevel.label} Emission Class
          </span>
        </div>
      </td>
    </tr>

    <!-- ── DIVIDER ───────────────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:0 28px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <hr style="border:none;border-top:1.5px solid ${C.outlineVar};margin:0;" />
      </td>
    </tr>

    <!-- ── EMISSION RESULTS ──────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:24px 28px 20px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <!-- Section header -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:16px;">
          <tr>
            <td>
              <span style="font-size:0.72rem;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.1em;">&#128202;&nbsp; Daily Emission Results</span>
            </td>
          </tr>
        </table>
        <!-- Metric cards -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>${metricsHtml}</tr>
        </table>
      </td>
    </tr>

    <!-- ── DIVIDER ───────────────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:0 28px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <hr style="border:none;border-top:1.5px solid ${C.outlineVar};margin:0;" />
      </td>
    </tr>

    <!-- ── MAINTENANCE SCORE ─────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:24px 28px 20px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <span style="font-size:0.72rem;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.1em;">&#9989;&nbsp; Maintenance Health Score</span>
        <!-- Score row -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:14px;">
          <tr>
            <td style="vertical-align:middle;padding-right:16px;">
              <!-- Score number -->
              <span style="font-size:2.6rem;font-weight:900;color:${scoreStyle.color};font-family:Georgia,serif;line-height:1;">${maintenanceScore}</span>
              <span style="font-size:1rem;color:${C.muted};font-weight:400;"> / 100</span>
            </td>
            <td style="vertical-align:middle;width:100%;">
              <!-- Progress bar track -->
              <div style="background:${C.surfaceVar};border-radius:999px;height:10px;overflow:hidden;border:1px solid ${C.outline};">
                <div style="height:100%;width:${gaugeWidth}%;background:${scoreStyle.color};border-radius:999px;"></div>
              </div>
            </td>
            <td style="vertical-align:middle;padding-left:16px;white-space:nowrap;">
              <span style="display:inline-block;background:${scoreStyle.bg};border:1.5px solid ${scoreStyle.border};border-radius:20px;padding:4px 14px;font-size:0.75rem;font-weight:700;color:${scoreStyle.color};">${scoreStyle.label}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── DIVIDER ───────────────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:0 28px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <hr style="border:none;border-top:1.5px solid ${C.outlineVar};margin:0;" />
      </td>
    </tr>

    <!-- ── NEXT SERVICE DATES ────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:24px 28px 20px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <span style="font-size:0.72rem;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.1em;">&#128197;&nbsp; Your Next 3 Service Milestones</span>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:14px;">
          <tr>${serviceDatesHtml}</tr>
        </table>
      </td>
    </tr>

    ${recsHtml ? `
    <!-- ── DIVIDER ──────────────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:0 28px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <hr style="border:none;border-top:1.5px solid ${C.outlineVar};margin:0;" />
      </td>
    </tr>
    <!-- ── AI RECOMMENDATIONS ──────────────────────────────────── -->
    <tr>
      <td style="background:${C.surface};padding:24px 28px;border-left:1.5px solid ${C.outlineVar};border-right:1.5px solid ${C.outlineVar};">
        <span style="font-size:0.72rem;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.1em;">&#129302;&nbsp; AI Personalised Recommendations</span>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:6px;">
          ${recsHtml}
        </table>
      </td>
    </tr>` : ''}

    <!-- ── FOOTER ────────────────────────────────────────────────── -->
    <tr>
      <td style="background:${C.surfaceVar};border-radius:0 0 24px 24px;padding:24px 28px;text-align:center;border:1.5px solid ${C.outlineVar};border-top:none;">
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom:10px;">
          <tr>
            <td style="width:28px;height:28px;background:${C.primaryLight};border-radius:8px;text-align:center;vertical-align:middle;font-size:1rem;padding:4px;">
              &#127807;
            </td>
            <td style="padding-left:8px;vertical-align:middle;">
              <span style="font-size:0.95rem;font-weight:800;color:${C.primary};">Emission-Sense</span>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 4px;font-size:0.75rem;color:${C.muted};">ASEP Group 11 · Vehicle Emission Analysis Project</p>
        <p style="margin:0 0 4px;font-size:0.7rem;color:${C.muted};">Standards: IPCC / COPERT / EMEP-EEA / CPCB India</p>
        <p style="margin:10px 0 0;font-size:0.68rem;color:${C.muted};border-top:1px solid ${C.outline};padding-top:10px;">This is a one-time report. No further emails will be sent.</p>
      </td>
    </tr>

  </table>
  <!-- /Main container -->

  </td></tr>
  </table>
  <!-- /Outer wrapper -->

</body>
</html>`;
}

// ── API Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      vehicleName,
      vehicleImageUrl,
      vehicleSpecs,
      emissionResults,
      maintenanceScore,
      nextServiceDates,
      recommendations,
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'Email service not configured. Please add EMAIL_USER and EMAIL_PASS to .env.local.' },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = buildEmailHTML({
      vehicleName:      vehicleName || 'Your Vehicle',
      vehicleImageUrl,
      vehicleSpecs:     vehicleSpecs || { fuelType: 'Petrol', standard: 'BS4', vehicleType: 'Car', age: 0 },
      emissionResults:  emissionResults || { CO2: 0, NOx: 0, PM25: 0, CO: 0, HC: 0 },
      maintenanceScore: maintenanceScore ?? 70,
      nextServiceDates: nextServiceDates || [],
      recommendations,
    });

    await transporter.sendMail({
      from:    `"Emission-Sense \u{1F33F}" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: `Your Emission Report – ${vehicleName || 'Vehicle Analysis'}`,
      html:    htmlContent,
    });

    return NextResponse.json({ message: 'Report sent! Check your inbox.' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Email Send Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to send email: ${msg}` }, { status: 500 });
  }
}
