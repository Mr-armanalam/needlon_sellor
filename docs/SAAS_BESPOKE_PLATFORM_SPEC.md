# Needlon SaaS Platform: Bespoke Tailoring & Garment Commerce Blueprint

## 1. Executive Vision & Core Business Architecture
Needlon is architected as a specialized multi-tenant SaaS platform empowering:
1. **Independent Tailors & Craftsmen**: Solo sewing artisans, bespoke patternmakers, and boutique creators.
2. **Brick-and-Mortar Tailor Shops**: Physical ateliers with a master tailor, cutting masters, and fitting stations.
3. **Fashion Brands & Retailers**: Hybrid sellers selling both standard ready-to-wear inventory and bespoke tailored garments.

---

## 2. Core Functional Pillars

### Pillar A: Dual Commerce Modes
- **Ready-to-Wear (RTW)**:
  - Standard pre-sewn clothes sold by fixed sizes (XS, S, M, L, XL, XXL) or collar/waist metrics.
  - Sourced directly from inventory stock.
  - Measurement input is **disabled** unless the seller has explicitly marked the product as customizable.
- **Made-to-Measure & Bespoke Customization**:
  - Garments created or altered according to customer-specific body measurements and posture nuances.
  - Sourced with custom cutting timelines, fabric allocation, and tailor review.

### Pillar B: Dual Measurement Intake Workflows
1. **Digital Customer Flow (Online Submission)**:
   - Buyer clicks "Customize" on a customizable product or submits measurements in the post-checkout order tracking flow.
   - Buyer enters metrics guided by visual anatomical diagrams and posture selectors.
2. **Physical Tailor Shop Flow (In-Store Master Tailor Entry)**:
   - Walk-in customer visits physical tailor shop atelier.
   - Master tailor takes physical measurements with tape.
   - Tailor inputs measurements directly into the seller portal (`apps/seller`) attached to the customer record or walk-in order.
   - Stored in the database for future repeat orders and pattern cutting.

### Pillar C: Seller Product Customization Control Rules
- **Default State**: During product listing, `isCustomizable` is `true` by default.
- **Pre-Order Flexibility**: Seller can toggle `isCustomizable = false` for strictly ready-to-wear items *before* any order is placed.
- **Post-Order Lock**: Once an order is placed with bespoke customization, the seller **cannot** disable or deny customization for that order item.

---

## 3. Bespoke Measurement Data Taxonomy

### Menswear Garment Models
1. **Shirt**:
   - *Essential*: neck_circumference, chest_circumference, waist_circumference, hip_circumference, shoulder_width, sleeve_length, shirt_length, bicep_circumference, wrist_circumference
   - *Bespoke & Posture*: armhole_circumference, scye_depth, forearm_circumference, front_chest_width, back_width, shoulder_slope, left_wrist_circumference, right_wrist_circumference
2. **Pant**:
   - *Essential*: waist_circumference, hip_seat_circumference, outseam_length, inseam_length, crotch_rise_depth, thigh_circumference, knee_circumference, bottom_hem_opening
   - *Bespoke & Posture*: total_crotch_contour, calf_circumference, front_rise, back_rise, waist_drop_slope, stance_and_prominence
3. **Safari Suit Jacket**:
   - *Essential*: neck_circumference, shoulder_width, chest_circumference, waist_circumference, hip_circumference, sleeve_length, safari_jacket_length, bicep_circumference, cuff_opening
   - *Bespoke & Posture*: armhole_circumference, front_chest_width, back_width, belt_waist_level, shoulder_slope, lapel_fall_point
4. **Jacket / Blazer**:
   - *Essential*: chest_circumference, waist_circumference, hip_seat_circumference, shoulder_width, sleeve_length, jacket_length, bicep_circumference, wrist_cuff_circumference
   - *Bespoke & Posture*: neck_point_to_front_button_stance, scye_depth, armhole_circumference, half_back_width, front_chest_width, shoulder_slope, chest_prominence, back_prominence_seat_angle
5. **Coat / Overcoat**:
   - *Essential*: chest_circumference_over_suit, waist_circumference_over_suit, hip_circumference_over_suit, shoulder_width, sleeve_length, overcoat_full_length, bicep_circumference, cuff_opening
   - *Bespoke & Posture*: scye_depth_enlarged, armhole_circumference, half_back_width, front_chest_width, lapel_break_point, vent_length, shoulder_slope
6. **Waistcoat**:
   - *Essential*: chest_circumference, waist_stomach_circumference, front_length_to_point, back_length, shoulder_strap_width
   - *Bespoke & Posture*: neck_base_to_front_opening_depth, armhole_circumference, side_seam_length, chest_prominence, stomach_prominence_drop
7. **Kurta**:
   - *Essential*: collar_neck_circumference, chest_circumference, waist_stomach_circumference, hip_circumference, shoulder_width, sleeve_length, kurta_full_length, armhole_circumference, bicep_circumference, sleeve_cuff_opening
   - *Bespoke & Posture*: side_slit_start_point_hip_level, front_placket_slit_length, front_chest_width, back_width, shoulder_slope
8. **Khandress Kurta / Pathani**:
   - *Essential*: collar_neck_circumference, chest_circumference, waist_circumference, hip_seat_circumference, shoulder_width, sleeve_length, kurta_length, bicep_circumference, cuff_opening
   - *Bespoke & Posture*: armhole_circumference, epaulet_shoulder_flap_length, chest_pocket_placement_depth, side_slit_height, hem_curve_depth, shoulder_slope

### Womenswear Garment Models
1. **Shirt**:
   - *Essential*: neck_circumference, upper_bust_circumference, bust_circumference, under_bust_circumference, waist_circumference, hip_circumference, shoulder_width, sleeve_length, shirt_length, bicep_circumference, cuff_circumference
   - *Bespoke & Posture*: bust_point_height_shoulder_to_apex, bust_apex_to_apex_distance, front_waist_length, back_waist_length, armhole_circumference, across_front, across_back, shoulder_slope
2. **Pant**:
   - *Essential*: natural_waist_circumference, high_hip_circumference, full_hip_seat_circumference, outseam_length, inseam_length, crotch_rise_depth, thigh_circumference, knee_circumference, bottom_hem_opening
   - *Bespoke & Posture*: total_crotch_contour, calf_circumference, front_rise, back_rise, waist_to_hip_depth, posture_seat_prominence
3. **Lehenga**:
   - *Essential*: waist_wear_point_circumference, high_hip_circumference, full_hip_circumference, lehenga_length_waist_to_floor, lehenga_length_with_heels, flare_ghera_target_width
   - *Bespoke & Posture*: waist_to_hip_depth, front_center_length, back_center_length, side_waist_to_floor_length
4. **Blouse (Saree / Lehenga)**:
   - *Essential*: upper_bust_circumference, bust_circumference, under_bust_circumference, waist_blouse_hem_circumference, shoulder_width, blouse_length, front_neck_depth, back_neck_depth, sleeve_length, sleeve_round_bicep_or_cuff
   - *Bespoke & Posture*: shoulder_to_bust_apex_point, apex_to_apex_bust_distance, armhole_circumference, shoulder_strap_width, across_front, across_back, cup_size_dart_depth
5. **Ladies Jacket**:
   - *Essential*: upper_bust_circumference, bust_circumference, waist_circumference, hip_circumference, shoulder_width, sleeve_length, jacket_length, bicep_circumference, wrist_cuff_opening
   - *Bespoke & Posture*: bust_point_shoulder_to_apex, bust_apex_to_apex_distance, front_waist_length, back_waist_length, armhole_circumference, across_front, across_back, shoulder_slope, button_stance_height
6. **Ladies Coat**:
   - *Essential*: bust_circumference_over_garment, waist_circumference_over_garment, hip_circumference_over_garment, shoulder_width, sleeve_length, coat_length, bicep_circumference, cuff_opening
   - *Bespoke & Posture*: bust_height, scye_depth, armhole_circumference, across_front, across_back, lapel_break_point, back_waist_length, shoulder_slope

---

## 4. Database Schema Specification

```sql
CREATE TABLE customer_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES seller(id) ON DELETE CASCADE,
  order_id UUID REFERENCES product_orders(id) ON DELETE SET NULL,
  order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  customer_name VARCHAR(150),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(150),
  
  gender VARCHAR(20) NOT NULL, -- 'menswear' | 'womenswear'
  garment_type VARCHAR(50) NOT NULL, -- 'shirt', 'pant', 'lehenga', etc.
  measurement_unit VARCHAR(10) NOT NULL DEFAULT 'INCHES', -- 'INCHES' | 'CM'
  
  essential_measurements JSONB NOT NULL DEFAULT '{}'::jsonb,
  posture_specifics JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  fit_preference VARCHAR(30) DEFAULT 'REGULAR', -- 'SLIM' | 'REGULAR' | 'COMFORT'
  tailor_notes TEXT,
  
  source VARCHAR(30) NOT NULL DEFAULT 'ONLINE_CUSTOMER', -- 'ONLINE_CUSTOMER' | 'IN_STORE_TAILOR_MASTER'
  status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'IN_CUTTING' | 'COMPLETED'
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
