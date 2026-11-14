export type DesignCategory =
  | 'logo'
  | 'letterhead'
  | 'stationery'
  | 'website'
  | 'social'
  | 'brand';

export type DesignSubcategory =
  | 'logo_minimalist'
  | 'logo_corporate'
  | 'logo_luxury'
  | 'logo_modern'
  | 'logo_creative'
  | 'letterhead_a4'
  | 'letterhead_us_letter'
  | 'business_card_front'
  | 'business_card_back'
  | 'invoice_standard'
  | 'envelope_dl'
  | 'id_card'
  | 'email_signature'
  | 'presentation_slide'
  | 'website_landing'
  | 'website_corporate'
  | 'website_portfolio'
  | 'social_instagram_square'
  | 'social_instagram_story'
  | 'social_linkedin_creative'
  | 'social_facebook_banner'
  | 'social_youtube_thumbnail'
  | 'brand_guidelines';

export type LayerType = 'text' | 'shape' | 'icon' | 'image' | 'group';

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
  visible: boolean;
  zIndex: number;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string | number;
  fontStyle?: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
}

export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'polygon'
  | 'star'
  | 'line'
  | 'badge'
  | 'pill'
  | 'divider';

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  borderRadius?: number;
  gradient?: {
    type: 'linear' | 'radial';
    angle?: number;
    stops: Array<{ offset: number; color: string }>;
  };
  svgPath?: string;
}

export interface IconLayer extends BaseLayer {
  type: 'icon';
  iconName: string;
  color: string;
  strokeWidth?: number;
  fill?: string;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  alt?: string;
  objectFit: 'cover' | 'contain' | 'fill';
  borderRadius?: number;
  filter?: string;
}

export interface GroupLayer extends BaseLayer {
  type: 'group';
  childrenIds: string[];
}

export type DesignLayer = TextLayer | ShapeLayer | IconLayer | ImageLayer | GroupLayer;

export interface ArtboardConfig {
  width: number;
  height: number;
  unit: 'px' | 'mm' | 'in';
  dpi: number;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundGradient?: {
    type: 'linear' | 'radial';
    angle: number;
    stops: Array<{ offset: number; color: string }>;
  };
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  gridSize?: number;
  showGrid?: boolean;
}

export interface DesignDocument {
  id: string;
  version: '1.0';
  title: string;
  category: DesignCategory;
  subcategory: DesignSubcategory;
  artboard: ArtboardConfig;
  layers: DesignLayer[];
  brandKitId?: string;
  metadata: {
    createdAt: string;
    updatedAt: string;
    promptUsed?: string;
    industry?: string;
    colorPalette?: string[];
    typographyPairing?: {
      heading: string;
      body: string;
    };
    tags: string[];
    isFavorite?: boolean;
  };
}

export interface BrandKit {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  industry?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutralDark: string;
    neutralLight: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    accentFont?: string;
  };
  logoUrl?: string;
  logoVectorSvg?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    registrationNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export interface UserProjectSummary {
  id: string;
  title: string;
  category: DesignCategory;
  subcategory: DesignSubcategory;
  thumbnail?: string;
  updatedAt: string;
  createdAt: string;
  layerCount: number;
  brandKitId?: string;
}
