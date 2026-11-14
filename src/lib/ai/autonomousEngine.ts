import {
  DesignCategory,
  DesignSubcategory,
  DesignDocument,
  DesignLayer,
  BrandKit,
} from '../ddom/types';
import { CATEGORY_PRESETS, COLOR_PALETTES, TYPOGRAPHY_PAIRS } from '../ddom/defaults';

export interface GenerationInput {
  prompt: string;
  category: DesignCategory;
  subcategory?: DesignSubcategory;
  brandKit?: BrandKit | null;
  stylePreference?: string;
  industry?: string;
  companyName?: string;
  tagline?: string;
  accentColor?: string;
  conceptIndex?: number;
}

export class AutonomousDesignEngine {
  static extractEntities(prompt: string): {
    companyName: string;
    tagline: string;
    industry: string;
    style: string;
  } {
    const p = prompt.trim();
    const quoteMatch = p.match(/["']([^"']+)["']/);
    let companyName = quoteMatch ? quoteMatch[1] : '';

    if (!companyName) {
      const calledMatch = p.match(/(?:called|named|for)\s+([A-Z][A-Za-z0-9&.\s]{1,24})/);
      if (calledMatch) {
        companyName = calledMatch[1].trim();
      }
    }

    if (!companyName) {
      const words = p.split(/\s+/).filter((w) => w.length > 2);
      companyName = words.slice(0, 2).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Vanguard Dynamics';
    }

    let tagline = 'Intelligent Excellence & Innovation';
    if (p.toLowerCase().includes('security') || p.toLowerCase().includes('cyber')) {
      tagline = 'Zero-Trust Defense & Sovereign Intelligence';
    } else if (p.toLowerCase().includes('finance') || p.toLowerCase().includes('bank') || p.toLowerCase().includes('invest')) {
      tagline = 'Global Capital & Wealth Advisory';
    } else if (p.toLowerCase().includes('health') || p.toLowerCase().includes('medical')) {
      tagline = 'Next-Generation Patient Care & Diagnostics';
    } else if (p.toLowerCase().includes('legal') || p.toLowerCase().includes('law')) {
      tagline = 'Attorneys at Law & Strategic Counsel';
    } else if (p.toLowerCase().includes('eco') || p.toLowerCase().includes('green') || p.toLowerCase().includes('energy')) {
      tagline = 'Sustainable Energy & Climate Solutions';
    }

    let industry = 'Technology & Software';
    if (/fintech|finance|wealth|crypto|invest/i.test(p)) industry = 'Finance & Banking';
    else if (/health|med|clinic|pharma/i.test(p)) industry = 'Healthcare & Medicine';
    else if (/legal|law|attorney/i.test(p)) industry = 'Legal & Corporate Services';
    else if (/real estate|property|arch/i.test(p)) industry = 'Real Estate & Architecture';
    else if (/food|cafe|restaurant|coffee/i.test(p)) industry = 'Hospitality & Dining';
    else if (/fashion|luxury|apparel/i.test(p)) industry = 'Luxury Fashion & Lifestyle';

    let style = 'Modern Minimalist';
    if (/luxury|gold|premium|high-end/i.test(p)) style = 'Luxury Serif';
    else if (/corporate|enterprise|formal|blue/i.test(p)) style = 'Executive Corporate';
    else if (/creative|abstract|bold|vibrant/i.test(p)) style = 'Vibrant Studio';
    else if (/cyberpunk|futuristic|neon/i.test(p)) style = 'Cyberpunk Future';

    return { companyName, tagline, industry, style };
  }

  static generate(input: GenerationInput): DesignDocument {
    const { prompt, category } = input;
    const entities = this.extractEntities(prompt);
    const companyName = input.companyName || entities.companyName;
    const tagline = input.tagline || entities.tagline;
    const industry = input.industry || entities.industry;
    const style = input.stylePreference || entities.style;

    let subcategory: DesignSubcategory = input.subcategory || (
      category === 'logo' ? 'logo_modern' :
      category === 'letterhead' ? 'letterhead_a4' :
      category === 'stationery' ? 'business_card_front' :
      category === 'website' ? 'website_landing' :
      category === 'social' ? 'social_instagram_square' : 'brand_guidelines'
    );

    const preset = CATEGORY_PRESETS[subcategory] || CATEGORY_PRESETS['logo_modern'];
    const artboard = { ...preset.artboard };

    let palette = COLOR_PALETTES[0];
    if (input.brandKit?.colors) {
      palette = {
        name: input.brandKit.name,
        primary: input.brandKit.colors.primary,
        secondary: input.brandKit.colors.secondary,
        accent: input.brandKit.colors.accent,
        neutralDark: input.brandKit.colors.neutralDark,
        neutralLight: input.brandKit.colors.neutralLight,
      };
    } else if (style.includes('Luxury')) {
      palette = COLOR_PALETTES[2];
    } else if (style.includes('Executive') || industry.includes('Finance') || industry.includes('Legal')) {
      palette = COLOR_PALETTES[3];
    } else if (industry.includes('Healthcare') || industry.includes('Eco')) {
      palette = COLOR_PALETTES[1];
    }

    let typo = TYPOGRAPHY_PAIRS[0];
    if (input.brandKit?.typography) {
      typo = {
        name: 'Brand Standard',
        heading: input.brandKit.typography.headingFont,
        body: input.brandKit.typography.bodyFont,
      };
    } else if (style.includes('Luxury')) {
      typo = TYPOGRAPHY_PAIRS[1];
    } else if (style.includes('Executive')) {
      typo = TYPOGRAPHY_PAIRS[3];
    }

    let layers: DesignLayer[] = [];
    const conceptIdx = input.conceptIndex || 0;

    switch (category) {
      case 'logo':
        layers = this.synthesizeLogo(artboard, companyName, tagline, palette, typo, style, conceptIdx);
        break;
      case 'letterhead':
        layers = this.synthesizeLetterhead(artboard, companyName, tagline, palette, typo, input.brandKit);
        break;
      case 'stationery':
        layers = this.synthesizeStationery(subcategory, artboard, companyName, tagline, palette, typo, input.brandKit);
        break;
      case 'website':
        layers = this.synthesizeWebsite(artboard, companyName, tagline, palette, typo, industry);
        break;
      case 'social':
        layers = this.synthesizeSocial(subcategory, artboard, companyName, tagline, palette, typo, prompt);
        break;
      case 'brand':
        layers = this.synthesizeBrandBoard(artboard, companyName, tagline, palette, typo);
        break;
      default:
        layers = this.synthesizeLogo(artboard, companyName, tagline, palette, typo, style, conceptIdx);
    }

    const docId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      id: docId,
      version: '1.0',
      title: `${companyName} - ${preset.label}`,
      category,
      subcategory,
      artboard,
      layers,
      brandKitId: input.brandKit?.id,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        promptUsed: prompt,
        industry,
        colorPalette: [palette.primary, palette.secondary, palette.accent, palette.neutralDark, palette.neutralLight],
        typographyPairing: { heading: typo.heading, body: typo.body },
        tags: [category, subcategory, industry, style],
      },
    };
  }

  private static synthesizeLogo(
    artboard: any,
    company: string,
    tagline: string,
    palette: any,
    typo: any,
    style: string,
    conceptIdx: number
  ): DesignLayer[] {
    const W = artboard.width;
    const H = artboard.height;
    const layers: DesignLayer[] = [];
    const isDark = artboard.backgroundColor.startsWith('#0') || artboard.backgroundColor.startsWith('#1');
    const primaryTextColor = isDark ? '#FFFFFF' : '#0F172A';
    const secondaryTextColor = isDark ? '#94A3B8' : '#64748B';

    const cx = W / 2;
    const cy = H / 2 - 40;

    layers.push({
      id: 'bg-accent-glow',
      name: 'Ambient Background Glow',
      type: 'shape',
      shapeType: 'circle',
      x: cx - 220,
      y: cy - 220,
      width: 440,
      height: 440,
      rotation: 0,
      opacity: 0.12,
      visible: true,
      zIndex: 1,
      fill: palette.primary,
    });

    if (conceptIdx === 0) {
      layers.push({
        id: 'logo-crest-outer',
        name: 'Geometric Hexagon Ring',
        type: 'shape',
        shapeType: 'rectangle',
        x: cx - 90,
        y: cy - 90,
        width: 180,
        height: 180,
        rotation: 45,
        opacity: 0.9,
        visible: true,
        zIndex: 2,
        fill: 'transparent',
        stroke: palette.primary,
        strokeWidth: 8,
        borderRadius: 28,
      });

      layers.push({
        id: 'logo-crest-inner',
        name: 'Core Accent Diamond',
        type: 'shape',
        shapeType: 'rectangle',
        x: cx - 55,
        y: cy - 55,
        width: 110,
        height: 110,
        rotation: 45,
        opacity: 1,
        visible: true,
        zIndex: 3,
        fill: palette.secondary,
        borderRadius: 16,
      });

      layers.push({
        id: 'logo-icon-mark',
        name: 'Vector Emblem Icon',
        type: 'icon',
        iconName: 'Zap',
        x: cx - 36,
        y: cy - 36,
        width: 72,
        height: 72,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 4,
        color: '#FFFFFF',
        strokeWidth: 2.5,
      });
    } else if (conceptIdx === 1) {
      layers.push({
        id: 'logo-crest-circle',
        name: 'Monogram Circle Frame',
        type: 'shape',
        shapeType: 'circle',
        x: cx - 95,
        y: cy - 95,
        width: 190,
        height: 190,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 2,
        fill: 'transparent',
        stroke: palette.accent || palette.primary,
        strokeWidth: 6,
      });

      layers.push({
        id: 'logo-monogram-initial',
        name: 'Brand Monogram Initial',
        type: 'text',
        text: company.charAt(0).toUpperCase() || 'V',
        x: cx - 60,
        y: cy - 65,
        width: 120,
        height: 120,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 3,
        fontSize: 100,
        fontFamily: typo.heading,
        fontWeight: 800,
        textAlign: 'center',
        color: palette.primary,
      });
    } else {
      layers.push({
        id: 'logo-shield-frame',
        name: 'Sovereign Shield Frame',
        type: 'shape',
        shapeType: 'rectangle',
        x: cx - 85,
        y: cy - 95,
        width: 170,
        height: 190,
        rotation: 0,
        opacity: 0.15,
        visible: true,
        zIndex: 2,
        fill: palette.primary,
        borderRadius: 24,
      });

      layers.push({
        id: 'logo-icon-shield',
        name: 'Shield Emblem',
        type: 'icon',
        iconName: 'ShieldCheck',
        x: cx - 50,
        y: cy - 60,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 3,
        color: palette.accent || palette.primary,
        strokeWidth: 2,
      });
    }

    layers.push({
      id: 'logo-text-title',
      name: 'Company Wordmark',
      type: 'text',
      text: company.toUpperCase(),
      x: cx - 350,
      y: cy + 130,
      width: 700,
      height: 60,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 5,
      fontSize: 38,
      fontFamily: typo.heading,
      fontWeight: 800,
      textAlign: 'center',
      color: primaryTextColor,
      letterSpacing: 4,
    });

    layers.push({
      id: 'logo-text-tagline',
      name: 'Brand Tagline',
      type: 'text',
      text: tagline.toUpperCase(),
      x: cx - 350,
      y: cy + 195,
      width: 700,
      height: 30,
      rotation: 0,
      opacity: 0.85,
      visible: true,
      zIndex: 6,
      fontSize: 13,
      fontFamily: typo.body,
      fontWeight: 500,
      textAlign: 'center',
      color: secondaryTextColor,
      letterSpacing: 6,
    });

    return layers;
  }

  private static synthesizeLetterhead(
    artboard: any,
    company: string,
    tagline: string,
    palette: any,
    typo: any,
    brandKit?: BrandKit | null
  ): DesignLayer[] {
    const W = artboard.width;
    const H = artboard.height;
    const layers: DesignLayer[] = [];

    layers.push({
      id: 'lh-header-bar-primary',
      name: 'Top Header Band',
      type: 'shape',
      shapeType: 'rectangle',
      x: 0,
      y: 0,
      width: W,
      height: 12,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 1,
      fill: palette.primary,
    });

    layers.push({
      id: 'lh-header-bar-secondary',
      name: 'Top Header Accent Strip',
      type: 'shape',
      shapeType: 'rectangle',
      x: 0,
      y: 12,
      width: 260,
      height: 4,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 2,
      fill: palette.accent || palette.secondary,
    });

    layers.push({
      id: 'lh-logo-badge',
      name: 'Header Logo Badge',
      type: 'shape',
      shapeType: 'rectangle',
      x: 50,
      y: 45,
      width: 48,
      height: 48,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 3,
      fill: palette.primary,
      borderRadius: 10,
    });

    layers.push({
      id: 'lh-logo-icon',
      name: 'Header Logo Icon',
      type: 'icon',
      iconName: 'Hexagon',
      x: 60,
      y: 55,
      width: 28,
      height: 28,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 4,
      color: '#FFFFFF',
      strokeWidth: 2,
    });

    layers.push({
      id: 'lh-company-name',
      name: 'Company Heading',
      type: 'text',
      text: company,
      x: 110,
      y: 44,
      width: 400,
      height: 32,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 5,
      fontSize: 22,
      fontFamily: typo.heading,
      fontWeight: 800,
      textAlign: 'left',
      color: '#0F172A',
      letterSpacing: 0.5,
    });

    layers.push({
      id: 'lh-company-tagline',
      name: 'Company Subheading',
      type: 'text',
      text: tagline,
      x: 110,
      y: 76,
      width: 400,
      height: 18,
      rotation: 0,
      opacity: 0.8,
      visible: true,
      zIndex: 6,
      fontSize: 10,
      fontFamily: typo.body,
      fontWeight: 500,
      textAlign: 'left',
      color: '#64748B',
      letterSpacing: 1,
    });

    const email = brandKit?.contactInfo?.email || `contact@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const phone = brandKit?.contactInfo?.phone || '+1 (800) 555-0199';
    const web = brandKit?.contactInfo?.website || `www.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    layers.push({
      id: 'lh-contact-info',
      name: 'Header Contact Info',
      type: 'text',
      text: `${phone}\n${email}\n${web}`,
      x: W - 320,
      y: 46,
      width: 270,
      height: 52,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 7,
      fontSize: 10,
      fontFamily: typo.body,
      fontWeight: 500,
      textAlign: 'right',
      color: '#475569',
      lineHeight: 1.6,
    });

    layers.push({
      id: 'lh-divider-header',
      name: 'Header Divider Rule',
      type: 'shape',
      shapeType: 'rectangle',
      x: 50,
      y: 115,
      width: W - 100,
      height: 1,
      rotation: 0,
      opacity: 0.2,
      visible: true,
      zIndex: 8,
      fill: '#94A3B8',
    });

    layers.push({
      id: 'lh-meta-date',
      name: 'Letterhead Date',
      type: 'text',
      text: 'November 14, 2026',
      x: 50,
      y: 150,
      width: 300,
      height: 20,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 9,
      fontSize: 11,
      fontFamily: typo.body,
      fontWeight: 600,
      textAlign: 'left',
      color: '#334155',
    });

    layers.push({
      id: 'lh-meta-recipient',
      name: 'Recipient Address Block',
      type: 'text',
      text: 'To: The Board of Directors & Strategic Partners\nExecutive Directorate\nGlobal Operations Center, Suite 1200\nSan Francisco, CA 94105',
      x: 50,
      y: 185,
      width: 450,
      height: 75,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 10,
      fontSize: 11,
      fontFamily: typo.body,
      fontWeight: 500,
      textAlign: 'left',
      color: '#1E293B',
      lineHeight: 1.5,
    });

    layers.push({
      id: 'lh-meta-subject',
      name: 'Subject Heading',
      type: 'text',
      text: 'SUBJECT: STRATEGIC MEMORANDUM & AUTHORIZATION OF EXECUTIVE DIRECTIVES',
      x: 50,
      y: 285,
      width: W - 100,
      height: 24,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 11,
      fontSize: 12,
      fontFamily: typo.heading,
      fontWeight: 700,
      textAlign: 'left',
      color: palette.primary,
      letterSpacing: 0.5,
    });

    layers.push({
      id: 'lh-body-paragraph-1',
      name: 'Body Content Paragraph',
      type: 'text',
      text: `Dear Esteemed Partners,\n\nWe are pleased to formally present the institutional framework and strategic initiatives for the upcoming operational cycle. Our organization continues to demonstrate leadership in our sector through relentless innovation, adherence to exemplary compliance standards, and sustainable technological value creation.\n\nAll deliverables detailed herein have undergone comprehensive verification by our technical and operational task forces. We remain dedicated to fostering high-trust, resilient partnerships that yield measurable societal and commercial impact across all operational jurisdictions.\n\nPlease review the attached specifications and confirm scheduling for the executive briefing at your earliest convenience.`,
      x: 50,
      y: 330,
      width: W - 100,
      height: 260,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 12,
      fontSize: 11.5,
      fontFamily: typo.body,
      fontWeight: 400,
      textAlign: 'justify',
      color: '#334155',
      lineHeight: 1.8,
    });

    layers.push({
      id: 'lh-signoff-text',
      name: 'Sign-off Statement',
      type: 'text',
      text: `Sincerely & Respectfully,\n\n\n_____________________________________\nChief Executive Officer & Managing Director\n${company}`,
      x: 50,
      y: 630,
      width: 400,
      height: 90,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 13,
      fontSize: 11.5,
      fontFamily: typo.body,
      fontWeight: 500,
      textAlign: 'left',
      color: '#1E293B',
      lineHeight: 1.6,
    });

    layers.push({
      id: 'lh-watermark-icon',
      name: 'Center Watermark Crest',
      type: 'icon',
      iconName: 'Shield',
      x: W / 2 - 120,
      y: H / 2 - 80,
      width: 240,
      height: 240,
      rotation: 0,
      opacity: 0.03,
      visible: true,
      zIndex: 1,
      color: palette.primary,
      strokeWidth: 1,
    });

    layers.push({
      id: 'lh-divider-footer',
      name: 'Footer Divider Line',
      type: 'shape',
      shapeType: 'rectangle',
      x: 50,
      y: H - 85,
      width: W - 100,
      height: 1,
      rotation: 0,
      opacity: 0.2,
      visible: true,
      zIndex: 14,
      fill: '#94A3B8',
    });

    const address = brandKit?.contactInfo?.address || '100 Innovation Boulevard, Tech Park, Suite 400, San Francisco, CA 94107';
    const regNo = brandKit?.contactInfo?.registrationNumber || 'Registration ID: US-DEL-2024-884920';

    layers.push({
      id: 'lh-footer-legal',
      name: 'Footer Legal Text',
      type: 'text',
      text: `${company} • ${address}\n${regNo} • Confidential & Proprietary Document`,
      x: 50,
      y: H - 75,
      width: W - 100,
      height: 35,
      rotation: 0,
      opacity: 0.8,
      visible: true,
      zIndex: 15,
      fontSize: 9.5,
      fontFamily: typo.body,
      fontWeight: 400,
      textAlign: 'center',
      color: '#64748B',
      lineHeight: 1.5,
    });

    layers.push({
      id: 'lh-footer-bar',
      name: 'Bottom Color Strip',
      type: 'shape',
      shapeType: 'rectangle',
      x: 0,
      y: H - 8,
      width: W,
      height: 8,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 16,
      fill: palette.primary,
    });

    return layers;
  }

  private static synthesizeStationery(
    subcategory: DesignSubcategory,
    artboard: any,
    company: string,
    tagline: string,
    palette: any,
    typo: any,
    brandKit?: BrandKit | null
  ): DesignLayer[] {
    const W = artboard.width;
    const H = artboard.height;
    const layers: DesignLayer[] = [];

    if (subcategory === 'business_card_front') {
      layers.push({
        id: 'bc-accent-stripe',
        name: 'Left Edge Accent Stripe',
        type: 'shape',
        shapeType: 'rectangle',
        x: 0,
        y: 0,
        width: 14,
        height: H,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 2,
        fill: palette.primary,
      });

      layers.push({
        id: 'bc-geometric-corner',
        name: 'Top Right Angle Accents',
        type: 'shape',
        shapeType: 'rectangle',
        x: W - 160,
        y: -40,
        width: 200,
        height: 200,
        rotation: 45,
        opacity: 0.08,
        visible: true,
        zIndex: 1,
        fill: palette.secondary,
      });

      layers.push({
        id: 'bc-logo-icon',
        name: 'Card Logo Icon',
        type: 'icon',
        iconName: 'Shield',
        x: 70,
        y: 70,
        width: 48,
        height: 48,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 3,
        color: palette.accent || palette.primary,
        strokeWidth: 2,
      });

      layers.push({
        id: 'bc-company-name',
        name: 'Company Wordmark',
        type: 'text',
        text: company.toUpperCase(),
        x: 135,
        y: 76,
        width: 450,
        height: 36,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 4,
        fontSize: 22,
        fontFamily: typo.heading,
        fontWeight: 800,
        textAlign: 'left',
        color: '#FFFFFF',
        letterSpacing: 2,
      });

      layers.push({
        id: 'bc-person-name',
        name: 'Executive Name',
        type: 'text',
        text: 'ALEXANDER STERLING',
        x: 70,
        y: 220,
        width: 600,
        height: 44,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 5,
        fontSize: 28,
        fontFamily: typo.heading,
        fontWeight: 700,
        textAlign: 'left',
        color: '#FFFFFF',
        letterSpacing: 1.5,
      });

      layers.push({
        id: 'bc-person-title',
        name: 'Executive Title',
        type: 'text',
        text: 'FOUNDER & CHIEF EXECUTIVE OFFICER',
        x: 70,
        y: 272,
        width: 600,
        height: 24,
        rotation: 0,
        opacity: 0.9,
        visible: true,
        zIndex: 6,
        fontSize: 13,
        fontFamily: typo.body,
        fontWeight: 600,
        textAlign: 'left',
        color: palette.primary,
        letterSpacing: 3,
      });

      const phone = brandKit?.contactInfo?.phone || '+1 (555) 839-2041';
      const email = brandKit?.contactInfo?.email || 'a.sterling@nexusdynamics.io';
      const web = brandKit?.contactInfo?.website || 'www.nexusdynamics.io';
      const address = 'San Francisco, CA • London • Tokyo';

      layers.push({
        id: 'bc-contact-details',
        name: 'Contact Coordinates',
        type: 'text',
        text: `M: ${phone}\nE: ${email}\nW: ${web}\nA: ${address}`,
        x: 70,
        y: 380,
        width: 600,
        height: 120,
        rotation: 0,
        opacity: 0.85,
        visible: true,
        zIndex: 7,
        fontSize: 13.5,
        fontFamily: typo.body,
        fontWeight: 400,
        textAlign: 'left',
        color: '#CBD5E1',
        lineHeight: 1.7,
      });

      layers.push({
        id: 'bc-qr-box',
        name: 'Digital V-Card QR Frame',
        type: 'shape',
        shapeType: 'rectangle',
        x: W - 180,
        y: H - 180,
        width: 110,
        height: 110,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 8,
        fill: '#FFFFFF',
        borderRadius: 12,
      });

      layers.push({
        id: 'bc-qr-icon',
        name: 'QR Vector Symbol',
        type: 'icon',
        iconName: 'QrCode',
        x: W - 165,
        y: H - 165,
        width: 80,
        height: 80,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 9,
        color: '#0F172A',
        strokeWidth: 2,
      });
    } else {
      layers.push({
        id: 'inv-title',
        name: 'Invoice Wordmark',
        type: 'text',
        text: 'INVOICE',
        x: 50,
        y: 50,
        width: 300,
        height: 44,
        rotation: 0,
        opacity: 1,
        visible: true,
        zIndex: 2,
        fontSize: 34,
        fontFamily: typo.heading,
        fontWeight: 800,
        textAlign: 'left',
        color: palette.primary,
        letterSpacing: 2,
      });
    }

    return layers;
  }

  private static synthesizeWebsite(
    artboard: any,
    company: string,
    tagline: string,
    palette: any,
    typo: any,
    industry: string
  ): DesignLayer[] {
    const W = artboard.width;
    const layers: DesignLayer[] = [];

    layers.push({
      id: 'web-nav-bg',
      name: 'Sticky Navigation Bar',
      type: 'shape',
      shapeType: 'rectangle',
      x: 0,
      y: 0,
      width: W,
      height: 80,
      rotation: 0,
      opacity: 0.95,
      visible: true,
      zIndex: 20,
      fill: '#0F172A',
      stroke: '#1E293B',
      strokeWidth: 1,
    });

    layers.push({
      id: 'web-nav-logo',
      name: 'Navbar Brand Wordmark',
      type: 'text',
      text: company.toUpperCase(),
      x: 80,
      y: 28,
      width: 300,
      height: 28,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 21,
      fontSize: 18,
      fontFamily: typo.heading,
      fontWeight: 800,
      textAlign: 'left',
      color: '#FFFFFF',
      letterSpacing: 2,
    });

    layers.push({
      id: 'web-nav-links',
      name: 'Navigation Menu Links',
      type: 'text',
      text: 'Platform       Solutions       Enterprise       Pricing       Documentation',
      x: W / 2 - 250,
      y: 30,
      width: 500,
      height: 24,
      rotation: 0,
      opacity: 0.85,
      visible: true,
      zIndex: 21,
      fontSize: 13,
      fontFamily: typo.body,
      fontWeight: 500,
      textAlign: 'center',
      color: '#94A3B8',
    });

    layers.push({
      id: 'web-hero-headline',
      name: 'Hero Main Headline',
      type: 'text',
      text: `Transform Ideas Into\nProfessional Editable Assets`,
      x: W / 2 - 500,
      y: 225,
      width: 1000,
      height: 140,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 7,
      fontSize: 56,
      fontFamily: typo.heading,
      fontWeight: 800,
      textAlign: 'center',
      color: '#FFFFFF',
      lineHeight: 1.15,
      letterSpacing: -1,
    });

    return layers;
  }

  private static synthesizeSocial(
    subcategory: DesignSubcategory,
    artboard: any,
    company: string,
    tagline: string,
    palette: any,
    typo: any,
    prompt: string
  ): DesignLayer[] {
    const W = artboard.width;
    const H = artboard.height;
    const layers: DesignLayer[] = [];

    layers.push({
      id: 'soc-bg-glow',
      name: 'Social Ambient Orb',
      type: 'shape',
      shapeType: 'circle',
      x: W - 350,
      y: -100,
      width: 600,
      height: 600,
      rotation: 0,
      opacity: 0.25,
      visible: true,
      zIndex: 1,
      fill: palette.primary,
    });

    layers.push({
      id: 'soc-main-headline',
      name: 'Social Bold Headline',
      type: 'text',
      text: 'THE FUTURE OF\nCREATIVE INTELLIGENCE\nHAS ARRIVED.',
      x: 80,
      y: 160,
      width: W - 160,
      height: 220,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 5,
      fontSize: 54,
      fontFamily: typo.heading,
      fontWeight: 900,
      textAlign: 'left',
      color: '#FFFFFF',
      lineHeight: 1.15,
      letterSpacing: -1,
    });

    return layers;
  }

  private static synthesizeBrandBoard(
    artboard: any,
    company: string,
    tagline: string,
    palette: any,
    typo: any
  ): DesignLayer[] {
    const W = artboard.width;
    const layers: DesignLayer[] = [];

    layers.push({
      id: 'bb-title',
      name: 'Board Main Title',
      type: 'text',
      text: `${company.toUpperCase()} - BRAND IDENTITY SYSTEM`,
      x: 80,
      y: 60,
      width: W - 160,
      height: 50,
      rotation: 0,
      opacity: 1,
      visible: true,
      zIndex: 2,
      fontSize: 32,
      fontFamily: typo.heading,
      fontWeight: 800,
      textAlign: 'left',
      color: '#FFFFFF',
      letterSpacing: 1,
    });

    return layers;
  }
}
