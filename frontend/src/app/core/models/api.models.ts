/** Types mirroring the Django REST API payloads. */

export interface CategoryMini {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
}

export interface AerialCategory extends CategoryMini {
  short_summary: string;
  display_order: number;
  project_count: number;
  service_count: number;
}

export interface AerialProject {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  client_sector: string;
  category: CategoryMini;
  location_name: string;
  drone_platform: string;
  video_resolution: string;
  video_embed_url: string;
  thumbnail_url: string;
  deliverables_tags: string[];
  is_featured: boolean;
}

export interface AerialProjectDetail extends AerialProject {
  airspace_clearance: string;
  shoot_summary: string;
  created_at: string;
}

export interface AerialService {
  id: number;
  title: string;
  slug: string;
  category: CategoryMini;
  short_description: string;
  detailed_description: string;
  included_deliverables: string[];
  drone_fleet_used: string[];
  typical_turnaround: string;
  /** Decimal serialized as string by DRF, e.g. "890.00". */
  starting_price_eur: string | null;
  is_featured: boolean;
}

export interface DroneFleetItem {
  id: number;
  model_name: string;
  category_label: string;
  camera_sensor: string;
  max_resolution_fps: string;
  flight_time_min: number;
  key_use_cases: string[];
  image_url: string;
}

export interface PilotMember {
  id: number;
  full_name: string;
  role_title: string;
  certifications: string;
  bio: string;
  photo_url: string;
}

export type DroneStyle = 'cinema' | 'fpv' | 'combo' | 'inspection';
export type LocationEnvironment = 'priroda' | 'mesto' | 'interier';
export type DurationTier = 'short' | 'half_day' | 'full_day';

export interface FlightQuotePayload {
  drone_style: DroneStyle;
  shoot_location: string;
  location_environment: LocationEnvironment;
  duration_tier: DurationTier;
  post_production_needed: boolean;
  preferred_date: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  project_details: string;
  /** Honeypot – must remain empty. */
  website: string;
}

export interface FlightQuoteResponse extends Omit<FlightQuotePayload, 'website'> {
  id: number;
  created_at: string;
}

export interface ProjectQuery {
  category?: string;
  featured?: boolean;
  search?: string;
  ordering?: string;
}
